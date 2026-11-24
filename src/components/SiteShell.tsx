import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Menu, Music2, X } from 'lucide-react'
import { Analytics } from '@vercel/analytics/react'
import { ChannelLinks } from './ChannelLinks'
import { NavLogoMotion } from './NavLogoMotion'
import { LogoLockup } from './LogoLockup'
import { TikTokCreatorLink } from './TikTokCreatorLink'
import { site } from '../data/site'
import { officialCreators } from '../lib/affiliate'
import { analyticsDisabled, initAnalytics, trafficSource, vercelEnabled } from '../lib/analytics'

const primary = [
  { path: '/', label: 'Trang chủ' },
  { path: '/products', label: 'Khám phá sản phẩm' },
  { path: '/videos', label: 'Video Review' },
  { path: '/reviews', label: 'Cẩm nang' },
]

const project = [
  { hash: 'about', label: 'Về TADORA' },
  { hash: 'team', label: 'Đội ngũ thành viên' },
  { hash: 'magic', label: 'Đối tác MAGIC' },
  { hash: 'journey', label: 'Hành trình DBC 2026' },
  { hash: 'activities', label: 'Hoạt động và thành tựu' },
  { hash: 'proposal', label: 'Hồ sơ đề án' },
]

const tiktokButton = 'hub-button hub-button--dark hub-tiktok'
const tiktokLabel = <><Music2 size={17} aria-hidden="true" /> TikTok</>

function SiteFooter({ path }: { path: string }) {
  return (
    <footer id="about-us" className="hub-footer">
      <div className="hub-wrap">
        <div className="hub-footer-grid">
          <div>
            <a href="/" aria-label="TADORA, trang chủ"><LogoLockup /></a>
            <p>{site.message}</p>
            <p>Đội {site.teamName} · PTIT<br />{site.competition}<br />{site.track}</p>
          </div>
          <nav aria-label="Khám phá">
            <strong>Khám phá</strong>
            <a href="/products">Danh mục sản phẩm</a><a href="/videos">Video Review</a>
            <a href="/reviews">Cẩm nang</a><a href="/compare">So sánh sản phẩm</a><a href="/recommend">Gợi ý sản phẩm</a>
          </nav>
          <nav aria-label="Dự án và chính sách">
            <strong>Dự án và chính sách</strong>
            <a href="/about">Về dự án</a><a href="/about#proposal">Hồ sơ đề án</a>
            <a href="/privacy">Chính sách bảo mật</a><a href="/affiliate-disclosure">Công bố tiếp thị liên kết</a>
          </nav>
          <div>
            <strong>Liên hệ</strong>
            <p>Nhắn tin cho đội qua các kênh của TADORA.</p>
            <ChannelLinks compact />
            {officialCreators.length ? (
              <nav className="hub-tiktok-profiles" aria-label="Kênh TikTok">
                {officialCreators.map((creator) => <TikTokCreatorLink key={creator.id} creator={creator} position="footer" />)}
              </nav>
            ) : <a href="/videos#tiktok">{tiktokLabel}</a>}
          </div>
        </div>
        <div className="hub-footer-end">
          <span>© 2026 TADORA · {site.domain}</span>
          <span>TADORA là dự án độc lập của đội {site.teamName} tại DBC 2026.</span>
          <a href={`${path === '/' ? '/' : path}#bat-dau`}>Trở về đầu trang</a>
        </div>
      </div>
    </footer>
  )
}

export function SiteShell({ path, children }: { path: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const projectMenu = useRef<HTMLDetailsElement>(null)
  const tiktokMenu = useRef<HTMLDetailsElement>(null)
  const nav = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    trafficSource()
    initAnalytics()
  }, [])

  useEffect(() => {
    const menus = [projectMenu.current, tiktokMenu.current]
    const onClick = (event: PointerEvent) => {
      for (const menu of menus) {
        if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false
      }
      if (event.target instanceof Node && !nav.current?.contains(event.target) && !toggle.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const activeMenu = menus.find((menu) => menu?.open)
      if (activeMenu) {
        activeMenu.open = false
        activeMenu.querySelector('summary')?.focus()
      } else if (open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const closeNavigation = () => {
    setOpen(false)
    if (projectMenu.current) projectMenu.current.open = false
    if (tiktokMenu.current) tiktokMenu.current.open = false
  }

  return (
    <>
      <div id="bat-dau" />
      <a className="hub-skip" href="#noi-dung">Chuyển đến nội dung</a>
      <header className="hub-nav">
        <div className="hub-wrap hub-nav-inner">
          <a className="hub-brand" href="/" aria-label="TADORA, trang chủ">
            {path === '/about' ? <NavLogoMotion /> : <LogoLockup />}
          </a>
          <button className="hub-menu-toggle" type="button" ref={toggle} aria-expanded={open} aria-controls="dieu-huong"
            aria-label={open ? 'Đóng menu' : 'Mở menu'} onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="dieu-huong" ref={nav} className={`hub-nav-links ${open ? 'is-open' : ''}`} aria-label="Điều hướng chính">
            {primary.map((item) => (
              <a key={item.path} href={item.path} onClick={closeNavigation}
                aria-current={path === item.path ? 'page' : path.startsWith(item.path + '/') ? 'location' : undefined}>
                {item.label}
              </a>
            ))}
            <div className="hub-project-nav">
              <a href="/about" aria-current={path === '/about' ? 'page' : undefined} onClick={closeNavigation}>Về dự án</a>
              <details ref={projectMenu} onToggle={(event) => {
                if (event.currentTarget.open && tiktokMenu.current) tiktokMenu.current.open = false
              }}>
                <summary aria-label="Mở danh mục về dự án"><ChevronDown size={16} aria-hidden="true" /></summary>
                <ul className="hub-nav-menu-list">
                  {project.map((item) => <li key={item.hash}><a href={`/about#${item.hash}`} onClick={closeNavigation}>{item.label}</a></li>)}
                </ul>
              </details>
            </div>
            {officialCreators.length > 1 ? (
              <details className="hub-tiktok-menu" ref={tiktokMenu} onToggle={(event) => {
                if (event.currentTarget.open && projectMenu.current) projectMenu.current.open = false
              }}>
                <summary className={tiktokButton}>{tiktokLabel}<ChevronDown size={16} aria-hidden="true" /></summary>
                <ul className="hub-nav-menu-list">
                  {officialCreators.map((creator) => (
                    <li key={creator.id}><TikTokCreatorLink creator={creator} position="navigation" onClick={closeNavigation} /></li>
                  ))}
                </ul>
              </details>
            ) : officialCreators[0] ? (
              <TikTokCreatorLink className={tiktokButton} creator={officialCreators[0]} position="navigation" onClick={closeNavigation}>
                {tiktokLabel}
              </TikTokCreatorLink>
            ) : <a className={tiktokButton} href="/videos#tiktok" onClick={closeNavigation}>{tiktokLabel}</a>}
          </nav>
        </div>
      </header>
      <main id="noi-dung" tabIndex={-1}>{children}</main>
      <SiteFooter path={path} />
      {vercelEnabled && !analyticsDisabled() && <Analytics />}
    </>
  )
}
