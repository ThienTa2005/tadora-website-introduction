import { ArrowUpRight, AtSign, Facebook, Instagram } from 'lucide-react'
import type { SVGProps } from 'react'
import { site } from '../data/site'

type Props = { className?: string; compact?: boolean }

function ShopeeMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} className="shopee-mark" viewBox="0 0 64 64">
      <path d="M11 22h42l-2.7 31.2A6.4 6.4 0 0 1 44 59H20a6.4 6.4 0 0 1-6.3-5.8L11 22Z" fill="currentColor" />
      <path d="M21 22v-5a11 11 0 0 1 22 0v5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M40.5 32.5a13.5 13.5 0 0 0-8.7-3.1c-4.1 0-7 2.1-7 5.2 0 7.7 15.3 3.4 15.3 12.1 0 4.7-3.7 7.7-9.2 7.7-3.7 0-7.4-1.3-9.7-3.6" fill="none" stroke="#ee4d2d" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  )
}

export function ChannelLinks({ className = '', compact = false }: Props) {
  if (!site.channels.length) return null

  const channelIcons = {
    shop: ShopeeMark,
    facebook: Facebook,
    instagram: Instagram,
    threads: AtSign,
  }

  return (
    <nav className={`channel-links ${compact ? 'channel-links--compact' : ''} ${className}`} aria-label="Kênh mua sắm và mạng xã hội của TADORA">
      {!compact && <span className="channel-links__eyebrow">Mua sắm · Kết nối</span>}
      <div className="channel-links__list">
        {site.channels.map((channel) => {
          const ChannelIcon = channelIcons[channel.kind]
          return (
            <a
              key={`${channel.label}-${channel.url}`}
              className={`channel-link channel-link--${channel.kind}`}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${channel.label}: ${channel.handle} — mở trong tab mới`}
            >
              <span className="channel-link__icon"><ChannelIcon aria-hidden="true" /></span>
              <span className="channel-link__copy">
                {!compact && <small>{channel.kind === 'shop' ? 'Mua ngay tại' : 'Theo dõi trên'}</small>}
                <strong>{channel.label}</strong>
              </span>
              <ArrowUpRight className="channel-link__arrow" aria-hidden="true" />
            </a>
          )
        })}
      </div>
    </nav>
  )
}
