import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { catalog, featuredProducts } from '../src/data/products'
import { responsiveImage } from '../src/lib/images'
import { homeHeroSizes, notFound, origin, pageImage, pages, pageTitle, productPath, type PageMetadata } from '../src/lib/routes'

const metaBlock = /<!-- page-meta:start -->[\s\S]*?<!-- page-meta:end -->/
const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const escape = (value: string) => value.replace(/[&<>"]/g, (character) => entities[character])

function structuredData(page: PageMetadata) {
  const product = catalog.find((item) => productPath(item) === page.path)
  const base = { '@context': 'https://schema.org', url: origin + page.path, description: page.description }
  if (product) return {
    ...base, '@type': 'Product', name: product.name, model: product.code, image: pageImage(page), brand: { '@type': 'Brand', name: 'MAGIC' },
  }
  if (page.type === 'article') return {
    ...base, '@type': 'Article', headline: page.title, image: pageImage(page),
    author: { '@type': 'Organization', name: 'TADORA', url: origin + '/about' },
  }
  if (page.path === '/') return { ...base, '@type': 'WebSite', name: 'TADORA', inLanguage: 'vi' }
  if (page.path === '/about') return { ...base, '@type': 'AboutPage', name: page.title, inLanguage: 'vi' }
  return { ...base, '@type': 'WebPage', name: page.title, inLanguage: 'vi' }
}

function markup(html: string, page: PageMetadata) {
  const title = escape(pageTitle(page))
  const description = escape(page.description)
  const url = escape(origin + page.path)
  const image = escape(pageImage(page))
  const is404 = page.path === notFound.path
  const schema = JSON.stringify(structuredData(page)).replace(/</g, '\\u003c')
  const hero = responsiveImage(featuredProducts[0].image, 'product')
  return html.replace(metaBlock, () => `<!-- page-meta:start -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  ${is404 ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`}
  <meta property="og:locale" content="vi_VN" />
  <meta property="og:site_name" content="TADORA" />
  <meta property="og:type" content="${page.type ?? 'website'}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:alt" content="${escape(page.title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  ${page.path === '/' ? `<link rel="preload" as="image" imagesrcset="${escape(hero.srcSet)}" imagesizes="${homeHeroSizes}" fetchpriority="high" />` : ''}
  ${is404 ? '' : `<script type="application/ld+json">${schema}</script>`}
  <!-- page-meta:end -->`)
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(({ path }) => `  <url><loc>${escape(origin + path)}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

export function staticPages(): Plugin {
  let destination = ''
  return {
    name: 'tadora-static-pages',
    configResolved(config) {
      destination = resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== '/sitemap.xml') return next()
        response.setHeader('Content-Type', 'application/xml; charset=utf-8')
        response.end(sitemap)
      })
    },
    transformIndexHtml(html, context) {
      const path = (context.originalUrl ?? '/').split('?')[0].replace(/\/$/, '') || '/'
      return markup(html, pages.find((page) => page.path === path) ?? notFound)
    },
    async writeBundle() {
      // Vercel cleanUrls serves each nested HTML file at its extensionless path.
      const html = await readFile(resolve(destination, 'index.html'), 'utf8')
      await Promise.all([...pages, notFound].filter((page) => page.path !== '/').map(async (page) => {
        const output = resolve(destination, `.${page.path}.html`)
        await mkdir(dirname(output), { recursive: true })
        await writeFile(output, markup(html, page), 'utf8')
      }))
      await writeFile(resolve(destination, 'sitemap.xml'), sitemap, 'utf8')
    },
  }
}
