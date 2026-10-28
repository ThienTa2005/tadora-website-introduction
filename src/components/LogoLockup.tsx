type Props = {
  className?: string
  compact?: boolean
}

export function LogoLockup({ className = '', compact = false }: Props) {
  return (
    <span className={`logo-lockup ${compact ? 'logo-lockup--compact' : ''} ${className}`.trim()} aria-label="TADORA">
      <img className="logo-lockup__mark" src="/logo-tadora-mark.png" alt="" aria-hidden="true" />
      {!compact && <img className="logo-lockup__wordmark" src="/logo-tadora-wordmark.png" alt="" aria-hidden="true" />}
    </span>
  )
}
