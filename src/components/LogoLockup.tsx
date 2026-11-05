type Props = {
  className?: string
  compact?: boolean
}

export function LogoLockup({ className = '', compact = false }: Props) {
  return (
    <span className={`logo-lockup ${compact ? 'logo-lockup--compact' : ''} ${className}`.trim()} aria-label="TADORA">
      <img className="logo-lockup__logo" src="/logo-tadora-black.png" alt="TADORA" width="2061" height="398" />
    </span>
  )
}
