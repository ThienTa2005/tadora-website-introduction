import { Volume2, VolumeX } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster: string
  ratio: '9/16' | '16/9' | '1/1'
  loop?: boolean
  autoPlayInView?: boolean
  className?: string
}

type ActiveVideo = HTMLVideoElement | null
let activeVideo: ActiveVideo = null

const pauseOtherVideos = (next: HTMLVideoElement) => {
  if (activeVideo && activeVideo !== next) activeVideo.pause()
  activeVideo = next
}

export function VideoPlayer({
  src,
  poster,
  ratio,
  loop = false,
  autoPlayInView = false,
  className = '',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [nearViewport, setNearViewport] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [showPoster, setShowPoster] = useState(true)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video || failed) return
    pauseOtherVideos(video)
    try {
      await video.play()
    } catch {
      setPlaying(false)
      setShowPoster(true)
    }
  }, [failed])

  const togglePlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void play()
    else video.pause()
  }, [play])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) {
      setNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      setNearViewport(entry.isIntersecting)
    }, { rootMargin: '260px 0px', threshold: 0 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const root = rootRef.current
    if (!video || !root || !nearViewport) return
    video.load()
    if (!autoPlayInView || reduceMotion) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) void play()
      else video.pause()
    }, { threshold: [0, 0.6, 1] })
    observer.observe(root)
    return () => observer.disconnect()
  }, [autoPlayInView, nearViewport, play, reduceMotion])

  useEffect(() => {
    if (!autoPlayInView) videoRef.current?.pause()
  }, [autoPlayInView])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) videoRef.current?.pause()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => () => {
    const video = videoRef.current
    video?.pause()
    if (activeVideo === video) activeVideo = null
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      togglePlayback()
    }
  }

  if (failed) return null

  return (
    <div
      ref={rootRef}
      className={`video-player ${className}`}
      style={{ aspectRatio: ratio }}
      role="button"
      tabIndex={0}
      aria-label={playing ? 'Tạm dừng video' : 'Phát video'}
      onClick={togglePlayback}
      onKeyDown={onKeyDown}
    >
      <img
        className={`video-player__poster ${showPoster ? '' : 'is-hidden'}`}
        src={poster}
        alt=""
        width={ratio === '9/16' ? 720 : 1280}
        height={ratio === '9/16' ? 1280 : ratio === '16/9' ? 720 : 1280}
        loading="lazy"
        decoding="async"
      />
      {nearViewport && (
        <video
          ref={videoRef}
          className={`video-player__video ${playing ? 'is-playing' : ''}`}
          muted={muted}
          loop={loop}
          playsInline
          preload="none"
          poster={poster}
          onPlaying={() => {
            setPlaying(true)
            setShowPoster(false)
          }}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {!playing && (
        <span className="video-player__play" aria-hidden="true">
          <span>▶</span>
        </span>
      )}
      <button
        type="button"
        className="video-player__sound"
        aria-label={muted ? 'Bật tiếng video' : 'Tắt tiếng video'}
        onClick={(event) => {
          event.stopPropagation()
          setMuted((value) => !value)
        }}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  )
}
