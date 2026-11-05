import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { LogoLockup } from './LogoLockup'

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } }

const shouldSkipVideo = () => Boolean((navigator as NavigatorWithConnection).connection?.saveData)

export function NavLogoMotion() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [finished, setFinished] = useState(() => !site.logoVideoReady || shouldSkipVideo())
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (reduceMotion) setFinished(true)
  }, [reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video || finished || reduceMotion) return
    video.currentTime = 0
    void video.play().catch(() => setFinished(true))
  }, [finished, reduceMotion])

  return (
    <span className="nav-logo-motion" aria-hidden="true">
      <LogoLockup className={`nav-logo-motion__static ${finished || !playing ? 'is-visible' : ''}`} />
      {!finished && (
        <video
          ref={videoRef}
          className={`nav-logo-motion__video ${playing ? 'is-playing' : ''}`}
          muted
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          onEnded={() => setFinished(true)}
          onError={() => setFinished(true)}
        >
          {site.logoVideo.landscape.webm && <source src={site.logoVideo.landscape.webm} type="video/webm" />}
          <source src={site.logoVideo.landscape.mp4} type="video/mp4" />
        </video>
      )}
    </span>
  )
}
