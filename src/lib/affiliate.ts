import { affiliateLinks, type AffiliateLink } from '../data/affiliate'
import { creators } from '../data/creators'
import type { CatalogProduct } from '../data/products'
import { videos, type HubVideo } from '../data/videos'

export function tiktokUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && !url.username && !url.password && !url.port &&
        (url.hostname === 'tiktok.com' || url.hostname.endsWith('.tiktok.com'))) return url
  } catch {
    // Invalid URLs are omitted from the interface.
  }
}

export function tiktokPostId(value: string) {
  return tiktokUrl(value)?.pathname.match(/^\/@[^/]+\/video\/(\d+)\/?$/)?.[1]
}

export const validCreators = creators.filter((creator) => tiktokUrl(creator.accountUrl))
export const creatorById = (id?: string) => validCreators.find((creator) => creator.id === id)
export const officialCreators = validCreators.filter((creator) => creator.official)

function linkedVideo(link: AffiliateLink, video: HubVideo) {
  return link.videoId === video.id || Boolean(video.tiktokUrl && link.tiktokVideoUrl === video.tiktokUrl)
}

export function activeAffiliate(product: CatalogProduct, video?: HubVideo, now = Date.now()) {
  const active = affiliateLinks.filter((link) =>
    link.productId === product.code && link.productSlug === product.slug &&
    link.status === 'active' && Date.parse(link.createdAt) <= now &&
    (!link.expiresAt || Date.parse(link.expiresAt) > now) && tiktokUrl(link.affiliateUrl),
  ).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  const general = active.find((link) => !link.videoId && !link.tiktokVideoUrl && (!video?.creatorId || video.creatorId === link.creatorId))
  if (video) return active.find((link) => linkedVideo(link, video)) ?? general
  return general ?? active[0]
}

export function affiliateVideoId(link: AffiliateLink) {
  return link.videoId ?? videos.find((video) => linkedVideo(link, video))?.id ??
    (link.tiktokVideoUrl ? tiktokPostId(link.tiktokVideoUrl) : undefined)
}
