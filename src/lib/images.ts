import type { SyntheticEvent } from 'react'

type ImageKind = 'product' | 'team'

const variant = (src: string, width: number) => src.replace(/\.webp$/i, `-${width}.webp`)

export const imageVariant = variant

export const markLazyImageLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.classList.add('is-loaded')
}

export const responsiveImage = (src: string, kind: ImageKind) => {
  if (kind === 'product') {
    return {
      src: variant(src, 480),
      srcSet: `${variant(src, 480)} 480w, ${variant(src, 960)} 960w`,
    }
  }
  return {
    src: variant(src, 600),
    srcSet: `${variant(src, 600)} 600w, ${variant(src, 1200)} 1200w`,
  }
}
