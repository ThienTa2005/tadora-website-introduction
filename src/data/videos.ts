import { catalog, type CatalogProduct } from './products'

export const videoCategories = ['Video viral', 'Review sản phẩm', 'Test sản phẩm', 'Lifestyle', 'Hướng dẫn sử dụng', 'So sánh sản phẩm', 'Giới thiệu sản phẩm'] as const

type VideoBase = {
  id: string
  title: string
  creatorId?: string
  productCodes: string[]
  category: typeof videoCategories[number]
  thumbnail: string
  publishedAt?: string
  featured?: boolean
}

export type TikTokVideo = VideoBase & { tiktokUrl: string; src?: never }
export type HubVideo = TikTokVideo | (VideoBase & { tiktokUrl?: never; src: string })

// Add confirmed posts here. Keep the original public TikTok post URL.
export const tiktokVideos: TikTokVideo[] = []

const localClips = catalog.flatMap((product): HubVideo[] => product.video ? [{
  id: `clip-${product.slug}`,
  title: `Giới thiệu ${product.name}`,
  productCodes: [product.code],
  category: 'Giới thiệu sản phẩm',
  thumbnail: product.video.poster,
  src: product.video.src,
}] : [])

export const videos: HubVideo[] = [...tiktokVideos, ...localClips]

export const videosFor = (product: CatalogProduct) => videos.filter((video) => video.productCodes.includes(product.code))

