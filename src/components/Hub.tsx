import { useEffect, useId, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Music2, Play, Search } from 'lucide-react'
import { affiliateDisclosure } from '../data/affiliate'
import { needs } from '../data/needs'
import { featuredCodes, type CatalogProduct } from '../data/products'
import type { Article } from '../data/reviews'
import { videosFor, type HubVideo } from '../data/videos'
import { activeAffiliate, affiliateVideoId } from '../lib/affiliate'
import { track, trafficSource } from '../lib/analytics'
import { responsiveImage } from '../lib/images'
import { productPath, reviewPath, videoPath } from '../lib/routes'

export function ProductImage({ src, alt, sizes, priority = false, className }: {
  src: string; alt: string; sizes: string; priority?: boolean; className?: string
}) {
  return <img {...responsiveImage(src, 'product')} alt={alt} sizes={sizes} width={960} height={960}
    loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className={className} />
}

export function PageHeading({ label, title, description }: { label?: string; title: string; description?: string }) {
  return (
    <header className="hub-page-heading">
      {label && <p className="hub-label">{label}</p>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  )
}

export function HubSection({ title, description, action, children, id, className = '' }: {
  title: string; description?: string; action?: ReactNode; children: ReactNode; id?: string; className?: string
}) {
  const reduceMotion = useReducedMotion()
  return (
    <section className={`hub-section ${className}`} id={id}>
      <motion.header className="hub-heading" initial={reduceMotion ? false : { y: 12 }} whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.38 }}>
        <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
        {action}
      </motion.header>
      {children}
    </section>
  )
}

export function AffiliateButton({ product, video, position, prominent = false }: {
  product: CatalogProduct; video?: HubVideo; position: string; prominent?: boolean
}) {
  const link = activeAffiliate(product, video)
  if (!link) return <span className="hub-affiliate-state">Đang cập nhật liên kết TikTok Shop</span>

  return (
    <a className={`hub-button hub-button--${prominent ? 'dark' : 'outline'}`} href={link.affiliateUrl}
      target="_blank" rel="sponsored noopener noreferrer"
      onClick={() => track('affiliate_click', {
        product_id: product.code,
        product_name: product.name,
        creator_id: link.creatorId,
        video_id: affiliateVideoId(link) ?? video?.id ?? '',
        button_position: position,
        campaign_id: link.campaignId,
        traffic_source: trafficSource(),
      })}>
      <Music2 size={16} aria-hidden="true" /> Xem giá trên TikTok Shop
    </a>
  )
}

export function ProductCard({ product, position, showFeatured = false }: { product: CatalogProduct; position: string; showFeatured?: boolean }) {
  const video = videosFor(product)[0]
  const primaryNeed = needs.find((need) => need.codes.some((code) => code === product.code))
  return (
    <article className="hub-product">
      <a className="hub-card-image" href={productPath(product)} aria-label={product.name}>
        <ProductImage src={product.image} alt={product.name} sizes="(max-width: 620px) 92vw, (max-width: 900px) 48vw, 390px" />
      </a>
      <div className="hub-product-copy">
        <div className="hub-card-meta">
          <span>{primaryNeed?.name ?? product.category}</span>
          {showFeatured && featuredCodes.includes(product.code) && <span>Sản phẩm nổi bật</span>}
        </div>
        <h3><a href={productPath(product)}>{product.name}</a></h3>
        <p>{product.description}</p>
        <div className="hub-product-actions">
          <a className="hub-text-link" href={productPath(product)}>Xem đánh giá<span className="sr-only"> {product.name}</span></a>
          {video && <a className="hub-text-link" href={videoPath(video.id)}><Play size={14} aria-hidden="true" /> Video<span className="sr-only"> {product.name}</span></a>}
        </div>
        <AffiliateButton product={product} position={position} />
      </div>
    </article>
  )
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="hub-article">
      <a href={reviewPath(article)} className="hub-article-image" aria-label={article.title}>
        <ProductImage src={article.image} alt="" sizes="(max-width: 620px) 92vw, 390px" />
      </a>
      <div className="hub-article-copy">
        <p className="hub-label">{article.category}</p>
        <h3><a href={reviewPath(article)}>{article.title}</a></h3>
        <p>{article.summary}</p>
      </div>
    </article>
  )
}

export function Disclosure({ full = false }: { full?: boolean }) {
  return (
    <aside className="hub-disclosure" aria-label="Công bố tiếp thị liên kết">
      <strong>Công bố tiếp thị liên kết</strong>
      {full ? <p>{affiliateDisclosure}</p> : <p>TADORA có thể nhận hoa hồng từ giao dịch đủ điều kiện qua TikTok Shop.</p>}
      <a className="hub-text-link" href="/affiliate-disclosure">Đọc công bố đầy đủ</a>
    </aside>
  )
}

export function SearchField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (value: string) => void; placeholder: string
}) {
  return (
    <label className="hub-field">
      <span>{label}</span>
      <span className="hub-search-input">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      </span>
    </label>
  )
}

export function SelectField({ label, value, onChange, options, placeholder, required }: {
  label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder?: string; required?: boolean
}) {
  const labelId = useId()
  return (
    <label className="hub-field">
      <span id={labelId}>{label}</span>
      <span className="hub-select-input">
        <select value={value} aria-labelledby={labelId} required={required} onChange={(event) => onChange(event.target.value)}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown size={17} aria-hidden="true" />
      </span>
    </label>
  )
}

export function RouteView({ event, properties }: {
  event: 'view_product' | 'view_project' | 'view_review'; properties?: Record<string, string>
}) {
  const recorded = useRef(false)
  useEffect(() => {
    if (recorded.current) return
    recorded.current = true
    track(event, properties)
  }, [event, properties])
  return null
}

export function normalizeSearch(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '')
}

export function StickyAffiliate({ product, video }: { product: CatalogProduct; video?: HubVideo }) {
  return (
    <div className="hub-sticky-affiliate" aria-label="Liên kết sản phẩm">
      <AffiliateButton product={product} position="mobile_sticky" />
      {!activeAffiliate(product) && video && <a className="hub-text-link" href={videoPath(video.id)}>Xem video</a>}
    </div>
  )
}
