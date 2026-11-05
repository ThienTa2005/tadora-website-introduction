import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'

type Props = { product?: Product; poster: string }
type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
type WindowWithIdle = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

export function HeroProductVideo({ product, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!product?.video || reduceMotion) return
    const connection = (navigator as NavigatorWithConnection).connection
    if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')) return

    let idleHandle: number | undefined
    let timerHandle: number | undefined
    const schedule = () => {
      const idleWindow = window as WindowWithIdle
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => setEnabled(true), { timeout: 1800 })
      } else {
        timerHandle = window.setTimeout(() => setEnabled(true), 350)
      }
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      if (idleHandle !== undefined) (window as WindowWithIdle).cancelIdleCallback?.(idleHandle)
      if (timerHandle !== undefined) window.clearTimeout(timerHandle)
    }
  }, [product, reduceMotion])

  useEffect(() => {
    if (!enabled || !videoRef.current) return
    videoRef.current.load()
    videoRef.current.play().catch(() => setPlaying(false))
  }, [enabled])

  if (!product?.video || !enabled || failed) return null
  return (
    <video
      ref={videoRef}
      className={`hero-product-video ${playing ? 'is-playing' : ''}`}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      onPlaying={() => setPlaying(true)}
      onError={() => setFailed(true)}
    >
      <source src={product.video.src} type="video/mp4" />
    </video>
  )
}
