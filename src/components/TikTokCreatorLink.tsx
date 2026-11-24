import type { ReactNode } from 'react'
import type { Creator } from '../data/creators'
import { track } from '../lib/analytics'

export function TikTokCreatorLink({ creator, position, children, className, onClick }: {
  creator: Creator
  position: 'navigation' | 'footer' | 'video_hub'
  children?: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <a className={className} href={creator.accountUrl} target="_blank" rel="noopener noreferrer"
      onClick={() => {
        track('creator_click', { creator_id: creator.id, button_position: position })
        onClick?.()
      }}>
      {children ?? creator.name}
    </a>
  )
}
