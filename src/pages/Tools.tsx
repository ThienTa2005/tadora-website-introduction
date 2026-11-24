import { useState, type FormEvent } from 'react'
import { AffiliateButton, PageHeading, ProductImage, SelectField } from '../components/Hub'
import { RecommendQuiz } from '../components/RecommendQuiz'
import { catalog, type CatalogProduct } from '../data/products'
import { getProductNotes } from '../data/product-notes'
import { track } from '../lib/analytics'
import { productPath } from '../lib/routes'

export function Recommend() {
  return (
    <div className="hub-wrap hub-tool-page">
      <PageHeading label="Gợi ý theo nhu cầu" title="Sản phẩm nào phù hợp với bạn?"
        description="Trả lời ba câu hỏi để nhận gợi ý từ danh mục MAGIC. Bạn có thể thêm ngân sách để tiện đối chiếu khi xem giá." />
      <RecommendQuiz />
    </div>
  )
}

const compareOptions = catalog.map(({ slug, name }) => ({ value: slug, label: name }))

export function Compare() {
  const requested = new URLSearchParams(window.location.search).get('first')
  const initial = catalog.find((product) => product.slug === requested) ?? catalog[0]
  const secondInitial = catalog.find((product) => product.code !== initial.code)!
  const [first, setFirst] = useState(initial.slug)
  const [second, setSecond] = useState(secondInitial.slug)
  const [pair, setPair] = useState([initial, secondInitial])
  const comparison = pair.map((product) => ({ product, notes: getProductNotes(product.code, product.category) }))
  const specLabels = [...new Set(comparison.flatMap(({ notes }) => notes.specs?.map((spec) => spec.label) ?? []))]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const choices = [first, second].map((slug) => catalog.find((product) => product.slug === slug))
    if (!choices[0] || !choices[1] || first === second) return
    setPair([choices[0], choices[1]])
    track('compare_product', { product_1_id: choices[0].code, product_2_id: choices[1].code })
  }

  const row = (label: string, value: (product: CatalogProduct) => string) => (
    <tr><th scope="row">{label}</th>{pair.map((product) => <td key={product.code}>{value(product)}</td>)}</tr>
  )

  return (
    <div className="hub-wrap hub-tool-page">
      <PageHeading label="Tư vấn lựa chọn" title="So sánh sản phẩm"
        description="Chọn hai mẫu để đối chiếu nhu cầu sử dụng, thiết kế và thông số đã có nguồn." />
      <form className="hub-filter-grid hub-filter-grid--compare" onSubmit={submit}>
        <SelectField label="Sản phẩm thứ nhất" value={first} onChange={setFirst} options={compareOptions.filter((item) => item.value !== second)} />
        <SelectField label="Sản phẩm thứ hai" value={second} onChange={setSecond} options={compareOptions.filter((item) => item.value !== first)} />
        <button className="hub-button hub-button--dark" type="submit">So sánh</button>
      </form>
      <p role="status" className="sr-only">Đang so sánh {pair[0].name} và {pair[1].name}</p>
      <div className="hub-table-wrap" role="region" tabIndex={0} aria-label="Bảng so sánh sản phẩm">
        <table className="hub-compare">
          <caption className="sr-only">Đối chiếu hai sản phẩm MAGIC</caption>
          <thead><tr><th scope="col">Tiêu chí</th>{pair.map((product) => (
            <th scope="col" key={product.code}>
              <ProductImage src={product.image} alt="" sizes="(max-width: 620px) 130px, 190px" />
              <a href={productPath(product)}>{product.name}</a>
            </th>
          ))}</tr></thead>
          <tbody>
            {row('Danh mục', (product) => product.category)}
            {row('Điểm nổi bật', (product) => product.description)}
            {row('Phù hợp với', (product) => getProductNotes(product.code, product.category).suitable)}
            {row('Điểm cần cân nhắc', (product) => getProductNotes(product.code, product.category).tradeoff)}
            {specLabels.map((label) => (
              <tr key={label}><th scope="row">{label}</th>{comparison.map(({ product, notes }) => {
                const spec = notes.specs?.find((item) => item.label === label)
                return <td key={product.code}>{spec ? <>{spec.value} <a href={spec.source}>Ảnh nguồn</a></> : 'Chưa có dữ liệu đối chiếu'}</td>
              })}</tr>
            ))}
            <tr><th scope="row">TikTok Shop</th>{pair.map((product) => (
              <td key={product.code}><AffiliateButton product={product} position="compare_table" /></td>
            ))}</tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
