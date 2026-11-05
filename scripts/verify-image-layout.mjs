import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SCREENSHOTS_DIR = join(ROOT, 'screenshots')
const HOST = '127.0.0.1'
const PORT = 4173
const BASE_URL = `http://${HOST}:${PORT}`
const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]
const IMAGE_SELECTOR = '.hero-card img, .closing-product, .product-gallery img, .product-image img'
const LEGACY_HEIGHT_SELECTORS = new Set(['img', '.hero-card img', '.closing-product', '.product-gallery img'])

const server = spawn(process.execPath, [
  join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
  '--host', HOST,
  '--port', String(PORT),
  '--strictPort',
], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] })

let serverLog = ''
server.stdout.on('data', (chunk) => { serverLog += chunk.toString() })
server.stderr.on('data', (chunk) => { serverLog += chunk.toString() })

const waitForServer = async () => {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Vite exited early.\n${serverLog}`)
    try {
      const response = await fetch(BASE_URL)
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Timed out waiting for ${BASE_URL}.\n${serverLog}`)
}

const waitForImages = async (page, selector) => {
  const images = page.locator(selector)
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index)
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((node) => node.complete && node.naturalWidth > 0
      ? undefined
      : new Promise((resolve, reject) => {
          const timeout = window.setTimeout(() => reject(new Error(`Image did not load: ${node.currentSrc || node.src}`)), 10_000)
          node.addEventListener('load', () => { window.clearTimeout(timeout); resolve() }, { once: true })
          node.addEventListener('error', () => { window.clearTimeout(timeout); reject(new Error(`Image failed: ${node.currentSrc || node.src}`)) }, { once: true })
        }))
  }
}

const measureImages = (page) => page.locator(IMAGE_SELECTOR).evaluateAll((images) => images.map((image, index) => {
  const rect = image.getBoundingClientRect()
  const style = getComputedStyle(image)
  const group = image.matches('.hero-card img')
    ? 'hero-card'
    : image.matches('.closing-product')
      ? 'closing-product'
      : image.matches('.product-gallery img')
        ? 'product-gallery'
        : 'product-image'
  const renderedRatio = rect.width ? rect.height / rect.width : 0
  const naturalRatio = image.naturalWidth ? image.naturalHeight / image.naturalWidth : 0
  return {
    index,
    group,
    source: image.currentSrc.split('/').pop(),
    width: Number(rect.width.toFixed(2)),
    height: Number(rect.height.toFixed(2)),
    renderedRatio: Number(renderedRatio.toFixed(4)),
    naturalRatio: Number(naturalRatio.toFixed(4)),
    ratioDelta: Number(Math.abs(renderedRatio - naturalRatio).toFixed(4)),
    boxSizing: style.boxSizing,
    squarePass: renderedRatio >= 0.95 && renderedRatio <= 1.05,
    naturalPass: Math.abs(renderedRatio - naturalRatio) <= 0.05,
  }
}))

const measureLegacyLayout = async (page) => page.evaluate(async ({ selector, legacySelectors }) => {
  const removed = []
  const visitRules = (rules) => {
    for (const rule of rules) {
      if ('cssRules' in rule) visitRules(rule.cssRules)
      if (!('selectorText' in rule) || !legacySelectors.includes(rule.selectorText) || !rule.style.getPropertyValue('height')) continue
      removed.push({ rule, value: rule.style.getPropertyValue('height'), priority: rule.style.getPropertyPriority('height') })
      rule.style.removeProperty('height')
    }
  }
  for (const sheet of document.styleSheets) visitRules(sheet.cssRules)
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  const result = [...document.querySelectorAll(selector)].map((image, index) => {
    const rect = image.getBoundingClientRect()
    const group = image.matches('.hero-card img')
      ? 'hero-card'
      : image.matches('.closing-product')
        ? 'closing-product'
        : image.matches('.product-gallery img')
          ? 'product-gallery'
          : 'product-image'
    const renderedRatio = rect.width ? rect.height / rect.width : 0
    const naturalRatio = image.naturalWidth ? image.naturalHeight / image.naturalWidth : 0
    return {
      index,
      group,
      source: image.currentSrc.split('/').pop(),
      width: Number(rect.width.toFixed(2)),
      height: Number(rect.height.toFixed(2)),
      renderedRatio: Number(renderedRatio.toFixed(4)),
      naturalRatio: Number(naturalRatio.toFixed(4)),
      ratioDelta: Number(Math.abs(renderedRatio - naturalRatio).toFixed(4)),
      boxSizing: getComputedStyle(image).boxSizing,
      squarePass: renderedRatio >= 0.95 && renderedRatio <= 1.05,
      naturalPass: Math.abs(renderedRatio - naturalRatio) <= 0.05,
    }
  })
  for (const entry of removed) entry.rule.style.setProperty('height', entry.value, entry.priority)
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return result
}, { selector: IMAGE_SELECTOR, legacySelectors: [...LEGACY_HEIGHT_SELECTORS] })

const summarize = (records) => {
  const groups = new Map()
  for (const record of records) {
    const key = `${record.viewport}|${record.phase}|${record.group}`
    const values = groups.get(key) ?? []
    values.push(record.renderedRatio)
    groups.set(key, values)
  }
  return [...groups].map(([key, ratios]) => {
    const [viewport, phase, group] = key.split('|')
    return {
      viewport,
      phase,
      group,
      count: ratios.length,
      minRatio: Math.min(...ratios).toFixed(3),
      maxRatio: Math.max(...ratios).toFixed(3),
      pass: ratios.every((ratio) => ratio >= 0.95 && ratio <= 1.05),
    }
  })
}

let browser
let exitCode = 0
try {
  await mkdir(SCREENSHOTS_DIR, { recursive: true })
  await waitForServer()
  browser = await chromium.launch({ headless: true })
  const allMeasurements = []
  const viewportResults = []

  for (const viewport of VIEWPORTS) {
    const viewportName = `${viewport.width}x${viewport.height}`
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', deviceScaleFactor: 1 })
    const page = await context.newPage()
    const notFound = new Set()
    const productVideoRequests = new Set()
    const consoleErrors = []
    page.on('response', (response) => { if (response.status() === 404) notFound.add(response.url()) })
    page.on('request', (request) => { if (new URL(request.url()).pathname.startsWith('/videos/products/')) productVideoRequests.add(request.url()) })
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })

    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await waitForImages(page, '.hero-card img')
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.nav-wrap')).position === 'fixed')
    await page.locator('.hero').screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-hero.png`) })
    await page.locator('.nav-wrap').screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-nav.png`) })

    if (viewport.width <= 720) {
      await page.evaluate(() => window.scrollTo(0, 320))
      await page.waitForFunction(() => {
        const nav = document.querySelector('.nav-wrap')
        if (!nav) return false
        const rect = nav.getBoundingClientRect()
        return rect.top >= 0 && rect.bottom <= window.innerHeight && Number(getComputedStyle(nav).opacity) > .99
      })
      await page.evaluate(() => window.scrollTo(0, 0))
    }

    const intro = page.locator('.intro-section')
    await intro.scrollIntoViewIfNeeded()
    await intro.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-intro.png`) })

    const story = page.locator('.story-band')
    await story.scrollIntoViewIfNeeded()
    await story.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-story.png`) })

    for (const [name, selector] of [['products', '.products-section .section-heading'], ['team', '.team-section .section-heading']]) {
      const heading = page.locator(selector)
      await heading.scrollIntoViewIfNeeded()
      await heading.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-${name}-heading.png`) })
    }

    const journey = page.locator('.journey-section')
    await journey.scrollIntoViewIfNeeded()
    const journeyTarget = viewport.width < 768 ? 3 : 2
    const journeyStep = journey.locator('.timeline-step').nth(journeyTarget)
    if (viewport.width >= 1024) await journeyStep.hover()
    else await journeyStep.click()
    await page.waitForFunction((index) => document.querySelectorAll('.timeline-step')[index]?.getAttribute('aria-pressed') === 'true', journeyTarget)
    await journey.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-journey.png`) })

    const closing = page.locator('.closing-section')
    await closing.scrollIntoViewIfNeeded()
    await waitForImages(page, '.closing-product')
    await closing.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-closing.png`) })

    const aboutUs = page.locator('#about-us')
    await aboutUs.scrollIntoViewIfNeeded()
    await aboutUs.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-footer.png`) })

    const navSpyFailures = []
    for (const [id, label] of [
      ['about', 'Giới thiệu'],
      ['products', 'Sản phẩm'],
      ['team', 'Đội ngũ'],
      ['journey', 'Hành trình'],
      ['about-us', 'Về chúng tôi'],
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      try {
        await page.waitForFunction((expectedLabel) => (
          document.querySelector('.desktop-nav button.active')?.textContent?.trim() === expectedLabel
        ), label, { timeout: 2_000 })
      } catch {
        navSpyFailures.push(id)
      }
    }

    await page.locator('.product-card').first().click()
    const modal = page.locator('.modal')
    await modal.waitFor({ state: 'visible' })
    await waitForImages(page, '.product-gallery img')
    await modal.screenshot({ path: join(SCREENSHOTS_DIR, `${viewportName}-modal.png`) })

    const before = await measureLegacyLayout(page)
    const after = await measureImages(page)
    allMeasurements.push(
      ...before.map((entry) => ({ viewport: viewportName, phase: 'before', ...entry })),
      ...after.map((entry) => ({ viewport: viewportName, phase: 'after', ...entry })),
    )

    const overflow = await page.evaluate(() => {
      const root = document.documentElement
      const body = document.body
      const rootOverflow = getComputedStyle(root).overflowX
      const bodyOverflow = getComputedStyle(body).overflowX
      const contentOverflows = Math.max(root.scrollWidth, body.scrollWidth) > root.clientWidth + 1
      const overflowClipped = ['hidden', 'clip'].includes(rootOverflow) || ['hidden', 'clip'].includes(bodyOverflow)
      return {
        clientWidth: root.clientWidth,
        scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
        rootOverflow,
        bodyOverflow,
        hasHorizontalScrollbar: contentOverflows && !overflowClipped,
      }
    })
    const activeAnimations = await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running' && (animation.effect?.getTiming().duration ?? 0) > 1).length)
    const dormantVideoState = {
      showreelCount: await page.locator('#showreel').count(),
      fullScreenLogoCount: await page.locator('.logo-intro').count(),
      navLogoCount: await page.locator('.nav-logo-motion').count(),
      reducedMotionNavVideoCount: await page.locator('.nav-logo-motion__video').count(),
      productVideoRequests: [...productVideoRequests],
    }
    const afterFailures = after.filter((entry) => !entry.squarePass || !entry.naturalPass || entry.boxSizing !== 'border-box')
    const result = { viewport: viewportName, overflow, notFound: [...notFound], consoleErrors, activeAnimations, dormantVideoState, navSpyFailures, afterFailures }
    viewportResults.push(result)
    if (afterFailures.length || navSpyFailures.length || overflow.hasHorizontalScrollbar || notFound.size || consoleErrors.length || activeAnimations || dormantVideoState.showreelCount || dormantVideoState.fullScreenLogoCount || dormantVideoState.navLogoCount !== 1 || dormantVideoState.reducedMotionNavVideoCount || dormantVideoState.productVideoRequests.length) exitCode = 1
    await context.close()
  }

  const playbackContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const playbackPage = await playbackContext.newPage()
  await playbackPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  const playbackVideo = playbackPage.locator('.nav-logo-motion__video')
  await playbackVideo.waitFor({ state: 'visible' })
  await playbackPage.waitForFunction(() => {
    const video = document.querySelector('.nav-logo-motion__video')
    return video instanceof HTMLVideoElement && video.readyState >= 2 && !video.paused && video.currentTime > 0.05
  }, undefined, { timeout: 10_000 })
  await playbackPage.waitForFunction(() => {
    const video = document.querySelector('.nav-logo-motion__video')
    return video instanceof HTMLVideoElement && video.currentTime >= 2
  }, undefined, { timeout: 10_000 })
  await playbackPage.locator('.nav-wrap').screenshot({ path: join(SCREENSHOTS_DIR, '1440x900-nav-playing.png') })
  const playbackResult = await playbackVideo.evaluate((video) => ({
    width: video.videoWidth,
    height: video.videoHeight,
    duration: Number(video.duration.toFixed(2)),
    muted: video.muted,
    loop: video.loop,
    preload: video.preload,
    playedInNav: !video.paused && video.currentTime > 0,
  }))
  await playbackPage.waitForFunction(() => !document.querySelector('.nav-logo-motion__video') && document.querySelector('.nav-logo-motion__static.is-visible'), undefined, { timeout: 10_000 })
  playbackResult.settledToStatic = true
  playbackResult.revealedHeadings = 0
  for (const selector of ['.products-section .section-heading', '.team-section .section-heading']) {
    await playbackPage.locator(selector).scrollIntoViewIfNeeded()
    await playbackPage.waitForFunction((headingSelector) => {
      const lines = [...document.querySelectorAll(`${headingSelector} .reveal-text__line > span`)]
      return lines.length > 0 && lines.every((line) => Number(getComputedStyle(line).opacity) > 0.95)
    }, selector, { timeout: 5_000 })
    playbackResult.revealedHeadings += 1
  }
  await playbackPage.reload({ waitUntil: 'domcontentloaded' })
  await playbackPage.waitForFunction(() => {
    const video = document.querySelector('.nav-logo-motion__video')
    return video instanceof HTMLVideoElement && !video.paused && video.currentTime > 0.05
  }, undefined, { timeout: 10_000 })
  playbackResult.replayedAfterReload = true
  if (!playbackResult.playedInNav || !playbackResult.settledToStatic || playbackResult.revealedHeadings !== 2 || !playbackResult.replayedAfterReload || !playbackResult.muted || playbackResult.loop) exitCode = 1
  await playbackContext.close()

  const summary = summarize(allMeasurements)
  console.table(summary)
  console.table(viewportResults.map(({ viewport, overflow, notFound, consoleErrors, activeAnimations, dormantVideoState, navSpyFailures, afterFailures }) => ({
    viewport,
    horizontalScrollbar: overflow.hasHorizontalScrollbar,
    rawWidth: `${overflow.scrollWidth}/${overflow.clientWidth}`,
    request404: notFound.length,
    consoleErrors: consoleErrors.length,
    dormantProductVideoRequests: dormantVideoState.productVideoRequests.length,
    forbiddenVideoSections: dormantVideoState.showreelCount + dormantVideoState.fullScreenLogoCount,
    navLogoSlots: dormantVideoState.navLogoCount,
    reducedMotionNavVideos: dormantVideoState.reducedMotionNavVideoCount,
    navSpyFailures: navSpyFailures.length,
    activeAnimations,
    ratioFailures: afterFailures.length,
  })))
  console.table([playbackResult])
  await writeFile(join(SCREENSHOTS_DIR, 'image-layout-report.json'), JSON.stringify({ summary, viewportResults, playbackResult, measurements: allMeasurements }, null, 2))
  console.log(`Screenshots and report: ${SCREENSHOTS_DIR}`)
} catch (error) {
  exitCode = 1
  console.error(error)
} finally {
  if (browser) await browser.close()
  server.kill()
}

process.exitCode = exitCode
