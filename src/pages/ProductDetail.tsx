import { useState } from 'react'
import { Play, Share2 } from 'lucide-react'
import { AffiliateButton, Disclosure, HubSection, ProductCard, ProductImage, RouteView, StickyAffiliate } from '../components/Hub'
import { VideoCards } from '../components/VideoHub'
import { getProductNotes } from '../data/product-notes'
import { catalog, type CatalogProduct } from '../data/products'
import { articles } from '../data/reviews'
import { videosFor } from '../data/videos'
import { track } from '../lib/analytics'
import { origin, productPath, reviewPath, videoPath } from '../lib/routes'

export default function ProductDetail({ product }: { product: CatalogProduct }) {
  const [activeImage, setActiveImage] = useState(product.image)
  const [shareMessage, setShareMessage] = useState('')
  const notes = getProductNotes(product.code, product.category)
  const videos = videosFor(product)
  const reviews = articles.filter((article) => article.productCodes.includes(product.code))
  const related = catalog.filter((item) => item.code !== product.code)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 3)

  const share = async () => {
    const url = origin + productPath(product)
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
        setShareMessage('Đã chia sẻ liên kết.')
      } else {
        await navigator.clipboard.writeText(url)
        setShareMessage('Đã sao chép liên kết.')
      }
      track('share_product', { product_id: product.code, product_name: product.name })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setShareMessage(`Liên kết sản phẩm: ${url}`)
    }
  }

  return (
    <div className="hub-wrap hub-has-sticky">
      <RouteView event="view_product" properties={{ product_id: product.code, product_name: product.name }} />
      <nav className="hub-breadcrumb" aria-label="Đường dẫn"><a href="/products">Khám phá sản phẩm</a><span aria-hidden="true">/</span><span>{product.code}</span></nav>
      <div className="hub-detail">
        <div className="hub-gallery">
          <ProductImage className="hub-gallery-main" src={activeImage} alt={`${product.name} · ảnh ${product.gallery.indexOf(activeImage) + 1}`}
            sizes="(max-width: 740px) 94vw, 600px" priority />
          {product.gallery.length > 1 && (
            <div className="hub-gallery-controls" role="group" aria-label="Ảnh sản phẩm">
              {product.gallery.map((image, index) => (
                <button type="button" key={image} aria-pressed={image === activeImage}
                  aria-label={`Xem ảnh ${index + 1} của ${product.name}`} onClick={() => setActiveImage(image)}>
                  <ProductImage src={image} sizes="82px" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hub-detail-copy">
          <p className="hub-label">{product.category} · {product.code}</p>
          <h1>{product.name}</h1>
          <p className="hub-detail-lead">{product.description}</p>
          <p>{notes.suitable}</p>
          <div className="hub-actions">
            <AffiliateButton product={product} position="product_hero" prominent />
            {videos[0] && <a className="hub-button hub-button--outline" href={videoPath(videos[0].id)}><Play size={17} aria-hidden="true" /> Xem video</a>}
          </div>
          <div className="hub-actions">
            <a className="hub-text-link" href={`/compare?first=${product.slug}`}>So sánh sản phẩm</a>
            <button className="hub-text-link" type="button" onClick={() => void share()}><Share2 size={16} aria-hidden="true" /> Chia sẻ</button>
          </div>
          <p className="hub-share-status" role="status">{shareMessage}</p>
        </div>
      </div>

      <HubSection title="Đánh giá và cách sử dụng">
        <div className="hub-project-grid">
          <article><h3>Điểm nổi bật</h3><p>{product.description}</p></article>
          <article><h3>Điểm cần cân nhắc</h3><p>{notes.tradeoff}</p></article>
          <article><h3>Hướng dẫn sử dụng</h3><p>{notes.use}</p></article>
        </div>
        <p className="hub-experience"><strong>Trải nghiệm của nhóm.</strong> {notes.experience ?? 'TADORA sẽ bổ sung ghi chép sau khi hoàn tất và xác nhận trải nghiệm thực tế với mẫu này.'}</p>
        {reviews.length > 0 && <ul className="hub-link-list">{reviews.map((article) => (
          <li key={article.slug}><a className="hub-text-link" href={reviewPath(article)}>{article.title}</a></li>
        ))}</ul>}
      </HubSection>

      <HubSection title="Thông số sản phẩm">
        {notes.specs?.length ? (
          <dl className="hub-specs">{notes.specs.map((spec) => (
            <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value} <a href={spec.source} target="_blank" rel="noopener noreferrer">Xem ảnh nguồn</a></dd></div>
          ))}</dl>
        ) : <p>Thông số đã đối chiếu đang được cập nhật. Bạn có thể tham khảo bộ ảnh sản phẩm ở trên.</p>}
      </HubSection>

      {videos.length > 0 && <HubSection title="Video liên quan" action={<a className="hub-text-link" href={`/videos?product=${encodeURIComponent(product.code)}`}>Xem trong thư viện</a>}>
        <VideoCards items={videos} />
      </HubSection>}

      <HubSection title="Câu hỏi thường gặp">
        <div className="hub-faq">
          <details><summary>Mẫu này phù hợp với ai?</summary><p>{notes.suitable}</p></details>
          <details><summary>Tìm giá và điều kiện bảo hành ở đâu?</summary><p>Thông tin giá, giao hàng và bảo hành nằm trên trang của nhà bán hàng tại TikTok Shop khi liên kết có sẵn.</p></details>
          <details><summary>Cần xem gì trước khi dùng lần đầu?</summary><p>{notes.use}</p></details>
        </div>
      </HubSection>

      <HubSection title="Sản phẩm liên quan"><div className="hub-card-grid">{related.map((item) => <ProductCard key={item.code} product={item} position="related_product" />)}</div></HubSection>
      <Disclosure />
      <StickyAffiliate product={product} video={videos[0]} />
    </div>
  )
}
