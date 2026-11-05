import { Play } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'

type Props = { product: Product }
type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } }

let activeCardVideo: HTMLVideoElement | null = null
const touchCandidates = new Map<HTMLVideoElement, { ratio: number; center: number }>()
let selectionFrame = 0

const pauseAndReset = (video: HTMLVideoElement) => {
  video.pause()
  try { video.currentTime = 0 } catch { /* The media metadata may not be loaded yet. */ }
}

const playOnly = async (video: HTMLVideoElement) => {
  if (activeCardVideo && activeCardVideo !== video) pauseAndReset(activeCardVideo)
  activeCardVideo = video
  try { await video.play() } catch { /* Autoplay can be rejected by battery-saving browsers. */ }
}

const selectTouchCandidate = () => {
  window.cancelAnimationFrame(selectionFrame)
  selectionFrame = window.requestAnimationFrame(() => {
    const next = [...touchCandidates.entries()]
      .filter(([, value]) => value.ratio >= 0.6)
      .sort((a, b) => a[1].center - b[1].center)[0]?.[0]
    if (next) void playOnly(next)
    else if (activeCardVideo && touchCandidates.has(activeCardVideo)) pauseAndReset(activeCardVideo)
  })
}

export function ProductCardMedia({ product }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    if (!root || !video || !product.video) return
    const card = root.closest<HTMLElement>('.product-card')
    if (!card) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const saveData = Boolean((navigator as NavigatorWithConnection).connection?.saveData)
    const canAutoPlay = !reduceMotion && !saveData

    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.load()
        preloadObserver.disconnect()
      }
    }, { rootMargin: '300px 0px', threshold: 0 })
    preloadObserver.observe(root)

    const start = () => { if (canAutoPlay) void playOnly(video) }
    const stop = () => {
      if (activeCardVideo === video) activeCardVideo = null
      pauseAndReset(video)
    }

    if (finePointer) {
      card.addEventListener('mouseenter', start)
      card.addEventListener('mouseleave', stop)
      card.addEventListener('focus', start)
      card.addEventListener('blur', stop)
    }

    let touchObserver: IntersectionObserver | undefined
    if (!finePointer && canAutoPlay) {
      touchObserver = new IntersectionObserver(([entry]) => {
        const rect = entry.boundingClientRect
        touchCandidates.set(video, {
          ratio: entry.intersectionRatio,
          center: Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2),
        })
        selectTouchCandidate()
      }, { threshold: [0, 0.6, 0.75, 1] })
      touchObserver.observe(root)
    }

    return () => {
      preloadObserver.disconnect()
      touchObserver?.disconnect()
      touchCandidates.delete(video)
      card.removeEventListener('mouseenter', start)
      card.removeEventListener('mouseleave', stop)
      card.removeEventListener('focus', start)
      card.removeEventListener('blur', stop)
      stop()
    }
  }, [product.video, reduceMotion])

  return (
    <div ref={rootRef} className="product-image">
      <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
      {product.video && !failed && (
        <>
          <video
            ref={videoRef}
            className={`product-card-video ${playing ? 'is-playing' : ''}`}
            muted
            loop
            playsInline
            preload="none"
            poster={product.video.poster}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          >
            <source src={product.video.preview ?? product.video.src} type="video/mp4" />
          </video>
          <span className="product-video-badge" aria-label="Có video"><Play size={14} fill="currentColor" /></span>
        </>
      )}
      <span className="product-code">{product.code}</span>
      <span className="product-view"><span aria-hidden="true">↗</span> Xem chi tiết</span>
    </div>
  )
}
