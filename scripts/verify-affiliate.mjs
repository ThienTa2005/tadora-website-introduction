import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const host = '127.0.0.1'
const port = '4174'
const base = `http://${host}:${port}`
const canonicalOrigin = 'https://tadora.id.vn'
const creatorLinks = {
  '@nyu.gge': 'https://www.tiktok.com/@nyu.gge?_r=1&_t=ZS-9BfNP3LzPqz',
  '@tien17112005': 'https://www.tiktok.com/@tien17112005?_r=1&_t=ZS-9BfNPzJY2OS',
}
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', host, '--port', port, '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
let serverLog = ''
server.stdout.on('data', (chunk) => { serverLog += chunk })
server.stderr.on('data', (chunk) => { serverLog += chunk })

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) break
    try {
      if ((await fetch(base)).ok) return
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Preview failed to start. Build dist/ first.\n${serverLog}`)
}

let browser
try {
  await waitForServer()
  const sitemap = await fetch(`${base}/sitemap.xml`).then((response) => response.text())
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname)
  assert.equal(new Set(paths).size, paths.length)
  assert.equal(paths.filter((path) => path.startsWith('/products/')).length, 10)
  assert.ok(paths.filter((path) => path.startsWith('/reviews/')).length >= 5)

  for (const path of paths) {
    const response = await fetch(base + path, { headers: { Accept: 'text/html' } })
    assert.equal(response.status, 200, path)
    const html = await response.text()
    assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}${path}"`), path)
    assert.ok(html.includes(`<meta property="og:url" content="${canonicalOrigin}${path}"`), path)
    assert.ok(html.includes('application/ld+json'), path)
  }

  await mkdir('screenshots', { recursive: true })
  browser = await chromium.launch()
  const errors = []
  const internalLinks = new Set()
  const anchors = new Map()
  const events = new Set()
  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('response', (response) => {
      if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
    })
    await page.addInitScript(() => {
      window.tadoraTestEvents = []
      window.gtag = (...args) => window.tadoraTestEvents.push(args)
      Object.defineProperty(navigator, 'share', { value: undefined })
    })

    for (const path of width === 1440 ? paths : ['/', '/products', '/products/b-26', '/videos', '/compare', '/recommend', '/about']) {
      await page.goto(base + path)
      await page.locator('main h1').waitFor()
      assert.equal(await page.locator('main h1').count(), 1, path)
      const overflow = await page.evaluate(() => {
        const frame = document.querySelector('.hub-gallery-main')
        const right = frame?.getBoundingClientRect().right ?? 0
        return Math.max(document.documentElement.scrollWidth, right) - window.innerWidth
      })
      assert.ok(overflow <= 1, `${path} overflows by ${overflow}px at ${width}px`)
      if (width === 1440) {
        for (const link of await page.locator('a[href]').evaluateAll((items) => items.map((item) => item.href))) {
          if (link.startsWith(base)) internalLinks.add(link)
        }
        anchors.set(path, await page.locator('[id]').evaluateAll((items) => items.map((item) => item.id)))
        for (const event of await page.evaluate(() => window.tadoraTestEvents)) events.add(event[1])
      }
      if ((width === 390 || width === 1440) && ['/', '/products/b-26'].includes(path)) {
        await page.locator('main img').first().evaluate((image) => image.decode())
        await page.screenshot({ path: `screenshots/affiliate-${width}-${path === '/' ? 'home' : 'product'}.png` })
      }
    }

    if (width === 390) {
      await page.goto(base)
      await page.keyboard.press('Tab')
      assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Chuyển đến nội dung')
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => document.activeElement === document.getElementById('noi-dung'))
      await page.getByRole('button', { name: 'Mở menu' }).click()
      const tiktokMenu = page.locator('.hub-tiktok-menu')
      await tiktokMenu.locator('summary').click()
      for (const [handle, url] of Object.entries(creatorLinks)) {
        const link = tiktokMenu.getByRole('link', { name: handle, exact: true })
        await link.waitFor()
        assert.equal(await link.getAttribute('href'), url)
      }
      await page.keyboard.press('Escape')
      assert.equal(await tiktokMenu.getAttribute('open'), null)
      await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByText('Về dự án', { exact: true }).click()
      await page.waitForURL('**/about')
      await page.locator('.member-card').first().click()
      await page.getByRole('dialog').waitFor()
      await page.keyboard.press('Escape')
      await page.getByRole('dialog').waitFor({ state: 'hidden' })
      assert.equal(await page.locator('.member-card').first().evaluate((button) => button === document.activeElement), true)
      await page.goto(`${base}/#team`)
      await page.waitForURL('**/about#team')
      await page.locator('#team h2').waitFor()
    }
    if (width !== 1440) {
      await page.close()
      continue
    }

    await page.goto(`${base}/products?need=rang-mieng`)
    await page.getByText('2 sản phẩm', { exact: true }).waitFor()
    await page.getByRole('searchbox', { name: 'Tìm sản phẩm' }).fill('tam nuoc')
    assert.equal(await page.locator('.hub-product').count(), 1)
    await page.getByRole('searchbox', { name: 'Tìm sản phẩm' }).fill('khong-co-san-pham')
    await page.getByText('Chưa tìm thấy sản phẩm phù hợp.', { exact: false }).waitFor()

    await page.goto(`${base}/products/b-26`)
    await page.getByRole('button', { name: 'Xem ảnh 2 của Bàn chải điện MAGIC B-26' }).click()
    await page.locator('.hub-gallery-main[alt$="ảnh 2"]').waitFor()
    await page.getByText('Mẫu này phù hợp với ai?', { exact: true }).click()
    assert.equal(await page.locator('.hub-faq details[open]').count(), 1)
    const affiliate = page.locator('.hub-detail-copy').getByRole('link', { name: 'Xem giá trên TikTok Shop' })
    if (await affiliate.count()) {
      const target = new URL(await affiliate.getAttribute('href'))
      assert.equal(target.protocol, 'https:')
      assert.ok(target.hostname === 'tiktok.com' || target.hostname.endsWith('.tiktok.com'))
      await affiliate.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true }))
      await affiliate.click()
      const event = await page.evaluate(() => window.tadoraTestEvents.find((item) => item[1] === 'affiliate_click'))
      assert.equal(event[2].button_position, 'product_hero')
      assert.equal(event[2].product_id, 'B-26')
    } else {
      await page.locator('.hub-detail-copy .hub-affiliate-state').waitFor()
    }
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.getByRole('button', { name: 'Chia sẻ' }).click()
    await page.getByText('Đã sao chép liên kết.').waitFor()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), `${canonicalOrigin}/products/b-26`)
    for (const event of await page.evaluate(() => window.tadoraTestEvents)) events.add(event[1])

    const mediaRequests = []
    page.on('request', (request) => {
      if (/\/videos\/products\/[^?]+\.mp4$|tiktok\.com\/player\/v1/.test(request.url())) mediaRequests.push(request.url())
    })
    await page.goto(`${base}/videos`)
    await page.locator('.hub-video-card').first().waitFor()
    assert.equal(mediaRequests.length, 0, 'No player download before interaction')
    const tiktokMenu = page.locator('.hub-tiktok-menu')
    await tiktokMenu.locator('summary').click()
    for (const [handle, url] of Object.entries(creatorLinks)) {
      for (const region of [tiktokMenu, page.locator('#tiktok'), page.locator('footer')]) {
        const link = region.getByRole('link', { name: handle, exact: true })
        await link.waitFor()
        assert.equal(await link.getAttribute('href'), url)
        assert.equal(await link.getAttribute('target'), '_blank')
      }
    }
    const creatorLink = tiktokMenu.getByRole('link', { name: '@nyu.gge', exact: true })
    await creatorLink.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once: true }))
    await creatorLink.click()
    const creatorEvent = await page.evaluate(() => window.tadoraTestEvents.find((event) => event[1] === 'creator_click'))
    assert.equal(creatorEvent[2].creator_id, 'nyu.gge')
    assert.equal(creatorEvent[2].button_position, 'navigation')
    await page.getByLabel('Sản phẩm', { exact: true }).selectOption('B-26')
    await page.getByRole('button', { name: 'Mở video: Giới thiệu Bàn chải điện MAGIC B-26' }).click()
    await page.locator('video.hub-player').evaluate((video) => video.play())
    await page.waitForFunction(() => window.tadoraTestEvents.some((event) => event[1] === 'play_video'))
    for (const event of await page.evaluate(() => window.tadoraTestEvents)) events.add(event[1])
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })

    await page.goto(`${base}/recommend`)
    await page.getByLabel('Bạn đang cần gì?').selectOption('rang-mieng')
    await page.getByLabel('Bạn định dùng khi nào?').selectOption('daily')
    await page.getByLabel('Bạn ưu tiên tính năng nào?').selectOption('water')
    await page.getByLabel('Ngân sách dự kiến').selectOption('under-300')
    await page.getByRole('button', { name: 'Xem gợi ý' }).click()
    await page.getByRole('heading', { name: 'Máy tăm nước MAGIC B-02 Pro' }).waitFor()
    for (const event of await page.evaluate(() => window.tadoraTestEvents)) events.add(event[1])

    await page.goto(`${base}/compare`)
    await page.getByLabel('Sản phẩm thứ hai').selectOption('mc-570')
    await page.getByRole('button', { name: 'So sánh', exact: true }).click()
    await page.getByRole('columnheader', { name: 'Bình giữ nhiệt MAGIC MC-570' }).waitFor()
    for (const event of await page.evaluate(() => window.tadoraTestEvents)) events.add(event[1])

    await page.goto(`${base}/privacy`)
    await page.getByRole('button', { name: 'Tắt phân tích truy cập' }).click()
    await page.getByRole('button', { name: 'Bật lại phân tích truy cập' }).waitFor()
    await page.goto(`${base}/products/b-26`)
    await page.locator('main h1').waitFor()
    assert.equal(await page.evaluate(() => window.tadoraTestEvents.length), 0)
    await page.close()
  }

  for (const link of internalLinks) {
    const { pathname, hash } = new URL(link)
    if (paths.includes(pathname)) {
      if (hash) assert.ok(anchors.get(pathname)?.includes(hash.slice(1)), link)
    } else {
      assert.ok(pathname.startsWith('/assets/'), link)
      assert.ok((await fetch(link, { method: 'HEAD' })).ok, link)
    }
  }
  for (const event of ['view_product', 'view_review', 'view_project', 'view_video', 'play_video', 'quiz_complete', 'compare_product', 'share_product']) {
    assert.ok(events.has(event), `Missing analytics event: ${event}`)
  }
  assert.deepEqual(errors, [])
  console.log(`Verified ${paths.length} routes, ${internalLinks.size} internal links, four viewport sizes and affiliate flows.`)
} finally {
  await browser?.close()
  server.kill()
}
