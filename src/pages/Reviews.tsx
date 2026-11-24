import { ArticleCard, Disclosure, HubSection, PageHeading, ProductCard, ProductImage, RouteView } from '../components/Hub'
import { catalog } from '../data/products'
import { articles, type Article } from '../data/reviews'

export function Reviews() {
  return (
    <div className="hub-wrap">
      <PageHeading label="Cẩm nang TADORA" title="Review & Cẩm nang"
        description="Tìm hiểu thiết kế, chọn sản phẩm theo nhu cầu và chăm sóc những món đồ bạn dùng hằng ngày." />
      <div className="hub-card-grid hub-list-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
    </div>
  )
}

export function Review({ article }: { article: Article }) {
  const products = catalog.filter((product) => article.productCodes.includes(product.code))
  return (
    <div className="hub-wrap">
      <RouteView event="view_review" properties={{ review_id: article.slug, review_title: article.title }} />
      <article className="hub-reading">
        <nav className="hub-breadcrumb" aria-label="Đường dẫn"><a href="/reviews">Review & Cẩm nang</a><span aria-hidden="true">/</span><span>{article.category}</span></nav>
        <PageHeading label={article.category} title={article.title} description={article.summary} />
        <div className="hub-reading-image"><ProductImage src={article.image} alt="" sizes="(max-width: 740px) 94vw, 760px" priority /></div>
        {article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
        {article.category === 'So sánh' && <a className="hub-button hub-button--outline" href="/compare">Mở bảng so sánh</a>}
      </article>
      <HubSection title="Sản phẩm trong bài viết"><div className="hub-card-grid">{products.map((product) => (
        <ProductCard key={product.code} product={product} position="review_related" />
      ))}</div></HubSection>
      <Disclosure />
    </div>
  )
}
