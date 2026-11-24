import { useState } from 'react'
import { PageHeading, ProductCard, SearchField, SelectField, normalizeSearch } from '../components/Hub'
import { catalog, productCategories } from '../data/products'
import { needs } from '../data/needs'

export default function Products() {
  const initialNeed = new URLSearchParams(window.location.search).get('need') ?? ''
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [need, setNeed] = useState(needs.some((item) => item.id === initialNeed) ? initialNeed : '')
  const term = normalizeSearch(search)
  const currentNeed = needs.find((item) => item.id === need)
  const filtered = catalog.filter((product) =>
    (!category || product.category === category) &&
    (!currentNeed || currentNeed.codes.some((code) => code === product.code)) &&
    (!term || normalizeSearch(`${product.name} ${product.code} ${product.description} ${product.category}`).includes(term)),
  )

  return (
    <div className="hub-wrap">
      <PageHeading label="Danh mục MAGIC" title="Khám phá sản phẩm"
        description="Tìm sản phẩm theo nhu cầu, xem hình ảnh và nội dung giới thiệu trước khi lựa chọn." />
      <div className="hub-catalog-tools">
        <div className="hub-filter-grid">
          <SearchField label="Tìm sản phẩm" value={search} onChange={setSearch} placeholder="Tên hoặc mã sản phẩm" />
          <SelectField label="Danh mục" value={category} onChange={setCategory} placeholder="Tất cả danh mục"
            options={productCategories.map((item) => ({ value: item, label: item === 'Chăm sóc cá nhân' ? 'Chăm sóc răng miệng' : item }))} />
          <SelectField label="Nhu cầu" value={need} onChange={setNeed} placeholder="Tất cả nhu cầu"
            options={needs.map((item) => ({ value: item.id, label: item.name }))} />
        </div>
        <div className="hub-result-bar">
          <p className="hub-result-count" role="status">{filtered.length} sản phẩm</p>
          <div className="hub-actions">
            <a className="hub-text-link" href="/compare">So sánh sản phẩm</a>
            <a className="hub-text-link" href="/recommend">Gợi ý theo nhu cầu</a>
          </div>
        </div>
      </div>
      {!filtered.length && <p className="hub-empty">Chưa tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác hoặc thay đổi bộ lọc.</p>}
      <div className="hub-card-grid hub-list-grid">
        {filtered.map((product) => <ProductCard key={product.code} product={product} position="product_catalog" showFeatured />)}
      </div>
    </div>
  )
}
