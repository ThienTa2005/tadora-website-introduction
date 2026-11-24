import { BadgeCheck, Clapperboard, Compass, Music2 } from 'lucide-react'
import { ArticleCard, Disclosure, HubSection, ProductCard, ProductImage, StickyAffiliate } from '../components/Hub'
import { LogoLockup } from '../components/LogoLockup'
import { VideoCards } from '../components/VideoHub'
import { RecommendQuiz } from '../components/RecommendQuiz'
import { needs } from '../data/needs'
import { catalog, featuredProducts } from '../data/products'
import { articles } from '../data/reviews'
import { team } from '../data/team'
import { videos } from '../data/videos'
import { activeAffiliate } from '../lib/affiliate'
import { responsiveImage } from '../lib/images'
import { homeHeroSizes, productPath, reviewPath } from '../lib/routes'

const homeVideos = [...videos].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 4)

export default function Home() {
  const affiliateProduct = featuredProducts.find((product) => activeAffiliate(product))
  return (
    <div className={`hub-home ${affiliateProduct ? 'hub-has-sticky' : ''}`}>
      <section className="hub-hero">
        <div className="hub-wrap hub-hero-inner">
          <div className="hub-hero-copy">
            <a className="hub-hero-project" href="/about">TADORA <span /> DBC 2026</a>
            <h1>Trải nghiệm thật – <em>Lựa chọn <span>thông minh</span></em></h1>
            <p>Cùng TADORA khám phá, trải nghiệm và lựa chọn những sản phẩm tiện ích phù hợp với cuộc sống mỗi ngày.</p>
            <div className="hub-actions">
              <a className="hub-button hub-button--light" href="/products">Khám phá sản phẩm</a>
              <a className="hub-button hub-button--hero" href="#video-review"><Clapperboard size={17} aria-hidden="true" /> Xem video trải nghiệm</a>
            </div>
          </div>
          <div className="hub-hero-bento" aria-label="Ba sản phẩm MAGIC nổi bật">
            {featuredProducts.map((product, index) => (
              <a className={`hub-hero-tile hub-hero-tile--${index + 1}`} key={product.code} href={productPath(product)}>
                <div className="hub-hero-picture">
                  <ProductImage src={product.image} alt="" priority={index === 0}
                    sizes={index === 0 ? homeHeroSizes : '(max-width: 740px) 34vw, 220px'} />
                </div>
                <span>{product.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <div className="hub-principles">
        <ul className="hub-wrap">
          <li><Clapperboard aria-hidden="true" /> Review thực tế</li>
          <li><BadgeCheck aria-hidden="true" /> Thông tin minh bạch</li>
          <li><Music2 aria-hidden="true" /> Mua hàng qua TikTok Shop</li>
        </ul>
      </div>
      <div className="hub-wrap">
        <HubSection id="san-pham-noi-bat" title="Khám phá những sản phẩm nổi bật"
          description="Hai lựa chọn chăm sóc răng miệng và một chiếc bình cho nhu cầu hằng ngày."
          action={<a className="hub-button hub-button--outline" href="/products">Xem tất cả sản phẩm</a>}>
          <div className="hub-card-grid">
            {featuredProducts.map((product) => <ProductCard key={product.code} product={product} position="home_featured" />)}
          </div>
        </HubSection>

        <HubSection id="video-review" title="Trải nghiệm thực tế cùng TADORA"
          description="Xem video dọc về sản phẩm, từ thiết kế đến cách sử dụng."
          action={<a className="hub-button hub-button--outline" href="/videos">Mở thư viện video</a>}>
          <VideoCards items={homeVideos} swipe />
        </HubSection>

        <HubSection title="Khám phá theo nhu cầu" action={<a className="hub-text-link" href="/compare">So sánh sản phẩm</a>}>
          <div className="hub-needs">
            {needs.map((need) => (
              <article key={need.id}>
                <a className="hub-need-picture" href={`/products?need=${need.id}`} aria-label={need.name}>
                  <ProductImage src={need.image} alt="" sizes="(max-width: 620px) 44vw, 240px" />
                </a>
                <div><h3><a href={`/products?need=${need.id}`}>{need.name}</a></h3>
                  <ul>{catalog.filter((product) => need.codes.some((code) => code === product.code)).map((product) => (
                    <li key={product.code}><a href={productPath(product)}>{product.code === 'B-02PRO' ? 'B-02 Pro' : product.code}</a></li>
                  ))}</ul>
                </div>
              </article>
            ))}
          </div>
        </HubSection>

        <HubSection title="Sản phẩm nào phù hợp với bạn?" id="goi-y" className="hub-quiz-section"
          description="Chọn nhu cầu, mục đích và tính năng bạn ưu tiên để tìm một sản phẩm đáng xem.">
          <RecommendQuiz />
        </HubSection>

        <HubSection title="Review & Cẩm nang" action={<a className="hub-button hub-button--outline" href="/reviews">Đọc tất cả bài viết</a>}>
          <div className="hub-card-grid">{articles.slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
          <ul className="hub-link-list">{articles.slice(3).map((article) => (
            <li key={article.slug}><a className="hub-text-link" href={reviewPath(article)}>{article.title}</a></li>
          ))}</ul>
        </HubSection>

        <section className="hub-section hub-story">
          <div className="hub-story-copy">
            <LogoLockup />
            <h2>Khám phá câu chuyện TADORA</h2>
            <p>TADORA không chỉ là nơi chia sẻ những trải nghiệm sản phẩm, mà còn là hành trình sáng tạo, ứng dụng công nghệ và phát triển năng lực kinh doanh của đội QUÁ TAM BA BẬN tại DBC 2026.</p>
            <a className="hub-button hub-button--dark" href="/about"><Compass size={17} aria-hidden="true" /> Khám phá hành trình của chúng tôi</a>
          </div>
          <div className="hub-portraits" aria-label="Đội Quá tam ba bận">
            {team.map((member) => (
              <a href="/about#team" key={member.name} aria-label={member.name}>
                <img {...responsiveImage(member.image, 'team')} alt={member.name} width={member.imageWidth} height={member.imageHeight}
                  sizes="(max-width: 620px) 30vw, 180px" loading="lazy" style={{ objectPosition: member.imagePosition }} />
              </a>
            ))}
          </div>
        </section>
        <Disclosure full />
      </div>
      {affiliateProduct && <StickyAffiliate product={affiliateProduct} />}
    </div>
  )
}
