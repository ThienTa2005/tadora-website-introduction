import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Product } from '../data/products'
import { SectionHeading } from './SectionHeading'
import { VideoPlayer } from './VideoPlayer'

type Props = { products: Product[]; onSelect: (product: Product) => void }

export function Showreel({ products, onSelect }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const [active, setActive] = useState(0)

  if (!products.length) return null

  const findActive = () => {
    window.cancelAnimationFrame(frameRef.current)
    frameRef.current = window.requestAnimationFrame(() => {
      const rail = railRef.current
      if (!rail) return
      const center = rail.getBoundingClientRect().left + rail.clientWidth / 2
      const cards = [...rail.querySelectorAll<HTMLElement>('.showreel-card')]
      const index = cards
        .map((card, cardIndex) => ({ cardIndex, distance: Math.abs(card.getBoundingClientRect().left + card.clientWidth / 2 - center) }))
        .sort((a, b) => a.distance - b.distance)[0]?.cardIndex ?? 0
      setActive(index)
    })
  }

  const step = (direction: -1 | 1) => {
    const rail = railRef.current
    const card = rail?.querySelector<HTMLElement>('.showreel-card')
    if (!rail || !card) return
    rail.scrollBy({ left: direction * (card.offsetWidth + 18), behavior: 'smooth' })
  }

  return (
    <section className="section showreel-section" id="showreel">
      <div className="container">
        <div className="showreel-heading-row">
          <SectionHeading
            light
            eyebrow="VIDEO · SẢN PHẨM"
            title="Xem MAGIC chuyển động."
            description="Chạm, vuốt hoặc dùng phím để khám phá từng sản phẩm trong nhịp chuyển động của TADORA."
          />
          <div className="showreel-arrows" aria-label="Điều khiển showreel">
            <button type="button" onClick={() => step(-1)} aria-label="Video trước"><ArrowLeft /></button>
            <button type="button" onClick={() => step(1)} aria-label="Video tiếp theo"><ArrowRight /></button>
          </div>
        </div>
        <div ref={railRef} className="showreel-rail" onScroll={findActive}>
          {products.map((product, index) => (
            <article className="showreel-card" key={product.code}>
              <VideoPlayer
                src={product.video!.src}
                poster={product.video!.poster}
                ratio="9/16"
                loop
                autoPlayInView={index === active}
              />
              <div className="showreel-card__copy">
                <small>{product.category}</small>
                <h3>{product.name.replace('Magic ', '')}</h3>
                <button type="button" onClick={() => onSelect(product)}>Xem chi tiết <ArrowRight size={16} /></button>
              </div>
            </article>
          ))}
        </div>
        <div className="showreel-dots" aria-label={`Video ${active + 1} trên ${products.length}`}>
          {products.map((product, index) => <span key={product.code} className={index === active ? 'active' : ''} />)}
        </div>
      </div>
    </section>
  )
}
