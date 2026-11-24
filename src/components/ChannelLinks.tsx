import { ArrowUpRight, AtSign, Facebook, Instagram } from 'lucide-react'
import { site } from '../data/site'

type Props = { className?: string; compact?: boolean }

export function ChannelLinks({ className = '', compact = false }: Props) {
  if (!site.channels.length) return null

  const channelIcons = {
    facebook: Facebook,
    instagram: Instagram,
    threads: AtSign,
  }

  return (
    <nav className={`channel-links ${compact ? 'channel-links--compact' : ''} ${className}`} aria-label="Mạng xã hội của TADORA">
      {!compact && <span className="channel-links__eyebrow">Kết nối với TADORA</span>}
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
                {!compact && <small>Theo dõi trên</small>}
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
