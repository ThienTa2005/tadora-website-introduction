import { useCallback, useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { Modal } from './Modal'
import { AffiliateButton, ProductImage } from './Hub'
import { catalog } from '../data/products'
import { videos, type HubVideo } from '../data/videos'
import { creatorById, tiktokPostId, tiktokUrl } from '../lib/affiliate'
import { track } from '../lib/analytics'
import { imageVariant } from '../lib/images'
import { productPath } from '../lib/routes'

const videoProperties = (video: HubVideo) => ({
  video_id: video.id,
  video_type: video.category,
  creator_id: video.creatorId ?? '',
  product_id: video.productCodes[0] ?? '',
})

function VideoMedia({ video }: { video: HubVideo }) {
  const iframe = useRef<HTMLIFrameElement>(null)
  const played = useRef(false)
  const [embedError, setEmbedError] = useState(false)
  const postId = video.tiktokUrl ? tiktokPostId(video.tiktokUrl) : undefined
  const onPlay = useCallback(() => {
    if (played.current) return
    played.current = true
    track('play_video', videoProperties(video))
  }, [video])

  useEffect(() => {
    if (!postId) return
    const handlePlayer = (event: MessageEvent) => {
      if (event.origin !== 'https://www.tiktok.com' || event.source !== iframe.current?.contentWindow ||
          event.data?.['x-tiktok-player'] !== true) return
      if (event.data.type === 'onStateChange' && event.data.value === 1) onPlay()
      if (event.data.type === 'onPlayerError') setEmbedError(true)
    }
    window.addEventListener('message', handlePlayer)
    return () => window.removeEventListener('message', handlePlayer)
  }, [postId, onPlay])

  if (video.src) {
    return <video className="hub-player" src={video.src} poster={imageVariant(video.thumbnail, 480)} controls preload="none"
      playsInline onPlay={onPlay} aria-label={video.title} />
  }
  if (postId && !embedError) {
    return <iframe className="hub-player" ref={iframe} src={`https://www.tiktok.com/player/v1/${postId}`}
      title={video.title} allow="fullscreen" allowFullScreen onError={() => setEmbedError(true)} />
  }
  return <p className="hub-empty">Bạn có thể mở video bằng liên kết TikTok bên dưới.</p>
}

function VideoThumbnail({ video }: { video: HubVideo }) {
  if (video.src) return <ProductImage src={video.thumbnail} alt="" sizes="(max-width: 620px) 67vw, 285px" />
  return <img src={video.thumbnail} alt="" width={540} height={960} loading="lazy" decoding="async" />
}

function VideoLinks({ video, position }: { video: HubVideo; position: string }) {
  const creator = creatorById(video.creatorId)
  const products = catalog.filter((item) => video.productCodes.includes(item.code))

  return (
    <div className="hub-video-links">
      {creator && <a className="hub-text-link" href={creator.accountUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => track('creator_click', { ...videoProperties(video), button_position: position })}>{creator.name}</a>}
      {products.map((product) => <a key={product.code} className="hub-text-link" href={productPath(product)}>{product.name}</a>)}
    </div>
  )
}

function TikTokPostLink({ video }: { video: HubVideo }) {
  if (!video.tiktokUrl || !tiktokUrl(video.tiktokUrl)) return null
  return <a className="hub-button hub-button--outline" href={video.tiktokUrl} target="_blank" rel="noopener noreferrer"
    onClick={() => track('view_video', { ...videoProperties(video), action: 'open_tiktok' })}>Xem trên TikTok</a>
}

export function VideoCards({ items, initialId, swipe = false }: { items: HubVideo[]; initialId?: string; swipe?: boolean }) {
  const [selected, setSelected] = useState(() => videos.find((video) => video.id === initialId))
  const openedInitially = useRef(false)
  const close = useCallback(() => {
    setSelected(undefined)
    const url = new URL(window.location.href)
    if (url.searchParams.has('video')) {
      url.searchParams.delete('video')
      window.history.replaceState(null, '', url)
    }
  }, [])

  useEffect(() => {
    if (!initialId || openedInitially.current) return
    openedInitially.current = true
    const video = videos.find((item) => item.id === initialId)
    if (video) track('view_video', { ...videoProperties(video), action: 'open_player' })
  }, [initialId])

  const open = (video: HubVideo) => {
    setSelected(video)
    track('view_video', { ...videoProperties(video), action: 'open_player' })
  }

  return (
    <>
      <div className={`hub-video-grid ${swipe ? 'hub-video-grid--swipe' : ''}`}>
        {items.map((video) => {
          const product = catalog.find((item) => item.code === video.productCodes[0])
          return (
            <article className="hub-video-card" key={video.id}>
              <button className="hub-video-thumb" type="button" onClick={() => open(video)} aria-label={`Mở video: ${video.title}`}>
                <VideoThumbnail video={video} />
                <span className="hub-video-play"><Play size={20} fill="currentColor" aria-hidden="true" /></span>
              </button>
              <div className="hub-video-copy">
                <p className="hub-label">{video.src ? 'Video sản phẩm' : video.category}</p>
                <h3>{video.title}</h3>
                <VideoLinks video={video} position="video_card" />
                <div className="hub-video-links">
                  <TikTokPostLink video={video} />
                  {product && <AffiliateButton product={product} video={video} position="video_card" />}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <Modal open={Boolean(selected)} title={selected?.title ?? 'Video sản phẩm'} onClose={close}>
        {selected && (
          <div className="hub-video-modal">
            <VideoMedia video={selected} key={selected.id} />
            <div>
              <p className="hub-label">{selected.category}</p>
              <h2>{selected.title}</h2>
              <VideoLinks video={selected} position="video_player" />
              <div className="hub-actions"><TikTokPostLink video={selected} /></div>
              {catalog.filter((product) => selected.productCodes.includes(product.code)).map((product) => (
                <div key={product.code} className="hub-video-shop">
                  <AffiliateButton product={product} video={selected} position="video_player" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
