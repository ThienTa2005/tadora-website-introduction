import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../data/site'

type Props = { onDone: () => void }
type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } }

const SESSION_KEY = 'tadora-logo-intro-seen'

const hasSaveData = () => Boolean((navigator as NavigatorWithConnection).connection?.saveData)

export function LogoIntro({ onDone }: Props) {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const finishedRef = useRef(false)
  const [visible, setVisible] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const [showStaticLogo, setShowStaticLogo] = useState(false)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Storage can be unavailable in private browsing; the intro still completes.
    }
    setShowStaticLogo(true)
    window.setTimeout(() => setVisible(false), 550)
    window.setTimeout(onDone, 950)
  }, [onDone])

  const skip = useCallback(() => {
    videoRef.current?.pause()
    finish()
  }, [finish])

  const abort = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    videoRef.current?.pause()
    setVisible(false)
    onDone()
  }, [onDone])

  useEffect(() => {
    if (!site.logoVideoReady || reduceMotion || hasSaveData()) {
      onDone()
      return
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        onDone()
        return
      }
    } catch {
      // Continue without session persistence.
    }

    setVisible(true)
    const skipTimer = window.setTimeout(() => setShowSkip(true), 400)
    const maximumTimer = window.setTimeout(finish, 3500)
    return () => {
      window.clearTimeout(skipTimer)
      window.clearTimeout(maximumTimer)
    }
  }, [finish, onDone, reduceMotion])

  useEffect(() => {
    if (!visible) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && skip()
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [skip, visible])

  if (!site.logoVideoReady) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="logo-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          role="dialog"
          aria-label="Giới thiệu TADORA"
        >
          <video
            ref={videoRef}
            className={`logo-intro__video ${showStaticLogo ? 'is-hidden' : ''}`}
            muted
            autoPlay
            playsInline
            preload="auto"
            onEnded={finish}
            onError={abort}
          >
            {site.logoVideo.portrait.webm && <source src={site.logoVideo.portrait.webm} type="video/webm" media="(orientation: portrait)" />}
            <source src={site.logoVideo.portrait.mp4} type="video/mp4" media="(orientation: portrait)" />
            {site.logoVideo.landscape.webm && <source src={site.logoVideo.landscape.webm} type="video/webm" />}
            <source src={site.logoVideo.landscape.mp4} type="video/mp4" />
          </video>
          <img
            className={`logo-intro__static ${showStaticLogo ? 'is-visible' : ''}`}
            src="/logo-tadora-black.png"
            alt="TADORA"
            width="2061"
            height="398"
          />
          {showSkip && !showStaticLogo && (
            <button type="button" className="logo-intro__skip" onClick={skip}>Bỏ qua</button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
