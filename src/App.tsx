import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { SiteShell } from './components/SiteShell'
import { RouteView } from './components/Hub'
import Home from './pages/Home'
import { catalog } from './data/products'
import { articles } from './data/reviews'
import { notFound, origin, pageImage, pages, pageTitle, productPath, resolvePath, reviewPath } from './lib/routes'

const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Videos = lazy(() => import('./pages/Videos'))
const Reviews = lazy(() => import('./pages/Reviews').then((module) => ({ default: module.Reviews })))
const Review = lazy(() => import('./pages/Reviews').then((module) => ({ default: module.Review })))
const Compare = lazy(() => import('./pages/Tools').then((module) => ({ default: module.Compare })))
const Recommend = lazy(() => import('./pages/Tools').then((module) => ({ default: module.Recommend })))
const AffiliateDisclosure = lazy(() => import('./pages/Policies').then((module) => ({ default: module.AffiliateDisclosure })))
const Privacy = lazy(() => import('./pages/Policies').then((module) => ({ default: module.Privacy })))

const screens: Record<string, ReactNode> = {
  '/': <Home />,
  '/products': <Products />,
  '/videos': <Videos />,
  '/reviews': <Reviews />,
  '/compare': <Compare />,
  '/recommend': <Recommend />,
  '/about': <><RouteView event="view_project" /><About /></>,
  '/affiliate-disclosure': <AffiliateDisclosure />,
  '/privacy': <Privacy />,
}

const path = resolvePath()
const metadata = pages.find((page) => page.path === path) ?? notFound

function HashOnLoad() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [])

  return null
}

function screen() {
  if (Object.hasOwn(screens, path)) return screens[path]
  const product = catalog.find((item) => productPath(item) === path)
  if (product) return <ProductDetail product={product} />
  const article = articles.find((item) => reviewPath(item) === path)
  if (article) return <Review article={article} />

  return (
    <div className="hub-wrap hub-page-heading">
      <h1>Không tìm thấy trang</h1>
      <p>Bạn có thể quay về trang chủ hoặc tìm trong danh mục sản phẩm.</p>
      <div className="hub-actions">
        <a className="hub-button hub-button--dark" href="/">Về trang chủ</a>
        <a className="hub-button hub-button--outline" href="/products">Khám phá sản phẩm</a>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    document.title = pageTitle(metadata)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', origin + metadata.path)
    const og = { title: pageTitle(metadata), description: metadata.description, url: origin + metadata.path, image: pageImage(metadata) }
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
    for (const [key, value] of Object.entries(og)) {
      document.querySelector(`meta[property="og:${key}"]`)?.setAttribute('content', value)
      document.querySelector(`meta[name="twitter:${key}"]`)?.setAttribute('content', value)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <SiteShell path={metadata === notFound ? '/' : path}>
        <Suspense fallback={<p className="hub-wrap hub-loading" role="status">Đang tải nội dung…</p>}>
          {screen()}
          <HashOnLoad />
        </Suspense>
      </SiteShell>
    </MotionConfig>
  )
}
