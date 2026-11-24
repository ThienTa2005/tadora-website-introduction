import { useRef, useState, type FormEvent } from 'react'
import { AffiliateButton, ProductImage, SelectField } from './Hub'
import { needs } from '../data/needs'
import { catalog, type CatalogProduct } from '../data/products'
import { videosFor } from '../data/videos'
import { track } from '../lib/analytics'
import { productPath, videoPath } from '../lib/routes'

const purposes = [
  { value: 'daily', label: 'Dùng hằng ngày' },
  { value: 'desk', label: 'Dùng ở bàn học hoặc nơi làm việc' },
  { value: 'travel', label: 'Mang theo khi di chuyển' },
  { value: 'gift', label: 'Tặng người khác' },
]
const budgets = [
  { value: 'under-300', label: 'Dưới 300.000 ₫' },
  { value: '300-700', label: '300.000–700.000 ₫' },
  { value: 'over-700', label: 'Trên 700.000 ₫' },
]
const priorities = [
  { value: 'portable', label: 'Nhỏ gọn, dễ mang theo', codes: ['B-02PRO', 'A-014', 'MPI-480', 'MC570'] },
  { value: 'brush', label: 'Dùng để chải răng', codes: ['B-26'] },
  { value: 'water', label: 'Dùng tia nước', codes: ['B-02PRO'] },
  { value: 'volume', label: 'Mang được nhiều nước', codes: ['MC1200', 'MC870'] },
  { value: 'cool', label: 'Làm mát cá nhân', codes: ['A-014', 'A-028'] },
  { value: 'daily', label: 'Thiết kế phù hợp dùng mỗi ngày', codes: ['B-26', 'MC570', 'MC500'] },
]

export function RecommendQuiz() {
  const [need, setNeed] = useState('')
  const [purpose, setPurpose] = useState('')
  const [priority, setPriority] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<{ product: CatalogProduct; budget: string; reason: string }>()
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const needOptions = needs.map(({ id, name }) => ({ value: id, label: name }))
  const candidates = needs.find((item) => item.id === need)?.codes
  const priorityOptions = priorities.filter((item) => !candidates || item.codes.some((code) => candidates.some((candidate) => code === candidate)))
  const invalidate = () => {
    setResult(undefined)
    setMessage('')
  }

  const complete = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const priorityOption = priorityOptions.find((item) => item.value === priority)
    if (!candidates || !purpose || !priorityOption) {
      setMessage('Hãy chọn nhu cầu, mục đích và tính năng ưu tiên.')
      return
    }

    const purposeCodes = needs.find((item) => item.id === ({
      desk: 'hoc-tap-lam-viec', travel: 'the-thao-di-chuyen', gift: 'qua-tang',
    } as Record<string, string>)[purpose])?.codes
    const score = (product: CatalogProduct) => Number(priorityOption.codes.includes(product.code)) * 4 +
      Number(Boolean(purposeCodes?.some((code) => code === product.code)))
    const product = catalog.filter((item) => candidates.some((code) => code === item.code)).sort((a, b) => score(b) - score(a))[0]
    if (!product) {
      setMessage('Chưa có sản phẩm phù hợp với lựa chọn này.')
      return
    }
    setMessage('')
    setResult({
      product,
      budget: budgets.find((item) => item.value === budget)?.label ?? '',
      reason: `${product.description} Mẫu này thuộc nhóm ${needs.find((item) => item.id === need)?.name.toLowerCase()} và phù hợp với tính năng bạn chọn: ${priorityOption.label.toLowerCase()}.`,
    })
    track('quiz_complete', { product_id: product.code, need, purpose, priority, budget })
    requestAnimationFrame(() => resultHeading.current?.focus())
  }

  const video = result && videosFor(result.product)[0]
  return (
    <div className="hub-quiz">
      <form onSubmit={complete}>
        <div className="hub-quiz-fields">
          <SelectField label="Bạn đang cần gì?" value={need} options={needOptions} placeholder="Chọn nhu cầu"
            onChange={(value) => { setNeed(value); setPriority(''); invalidate() }} required />
          <SelectField label="Bạn định dùng khi nào?" value={purpose} options={purposes} placeholder="Chọn mục đích"
            onChange={(value) => { setPurpose(value); invalidate() }} required />
          <SelectField label="Bạn ưu tiên tính năng nào?" value={priority} options={priorityOptions} placeholder="Chọn tính năng"
            onChange={(value) => { setPriority(value); invalidate() }} required />
          <SelectField label="Ngân sách dự kiến" value={budget} options={budgets} placeholder="Có thể bỏ qua"
            onChange={(value) => { setBudget(value); invalidate() }} />
        </div>
        <button className="hub-button hub-button--dark" type="submit">Xem gợi ý</button>
        {message && <p role="status">{message}</p>}
      </form>
      {result && (
        <article className="hub-quiz-result">
          <ProductImage src={result.product.image} alt={result.product.name} sizes="140px" />
          <div>
            <h3 ref={resultHeading} tabIndex={-1}>{result.product.name}</h3>
            <p>{result.reason}</p>
            {result.budget && <p>Ngân sách bạn chọn: {result.budget}. Hãy đối chiếu mức này với giá trên TikTok Shop khi liên kết có sẵn.</p>}
            <div className="hub-actions">
              <a className="hub-text-link" href={productPath(result.product)}>Xem đánh giá</a>
              {video && <a className="hub-text-link" href={videoPath(video.id)}>Xem video</a>}
            </div>
            <AffiliateButton product={result.product} position="quiz_result" />
          </div>
        </article>
      )}
    </div>
  )
}
