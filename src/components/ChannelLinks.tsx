import { ExternalLink } from 'lucide-react'
import { site } from '../data/site'

type Props = { className?: string; compact?: boolean }

export function ChannelLinks({ className = '', compact = false }: Props) {
  if (!site.channels.length) return null
  return (
    <div className={`channel-links ${compact ? 'channel-links--compact' : ''} ${className}`} aria-label="Kênh bán hàng">
      {site.channels.map((channel) => (
        <a key={`${channel.label}-${channel.url}`} href={channel.url} target="_blank" rel="noreferrer">
          {compact ? channel.label : `Mua tại ${channel.label}`} <ExternalLink size={15} />
        </a>
      ))}
    </div>
  )
}
