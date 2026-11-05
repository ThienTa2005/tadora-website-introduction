import { readyProductVideos } from './videos'

export const site = {
  name: 'TADORA',
  domain: 'tadora.id.vn',
  competition: 'Sinh viên Kinh doanh số 2026',
  track: 'Nội dung 1 — Bán hàng Online',
  school: 'Học viện Công nghệ Bưu chính Viễn thông',
  message: 'From Ideas to Digital Impact.',
  subMessage: 'Từ ý tưởng trên giảng đường đến trải nghiệm kinh doanh số thực tế.',
  logoVideoReady: false,
  logoVideo: {
    landscape: {
      mp4: '/videos/logo-intro.mp4',
      webm: undefined as string | undefined,
    },
    portrait: {
      mp4: '/videos/logo-intro-portrait.mp4',
      webm: undefined as string | undefined,
    },
  },
  channels: [] as { label: string; url: string }[],
}

export const navItems = [
  { id: 'about', label: 'Giới thiệu' },
  { id: 'products', label: 'Sản phẩm' },
  ...(readyProductVideos.length ? [{ id: 'showreel', label: 'Video' }] : []),
  { id: 'team', label: 'Đội ngũ' },
  { id: 'journey', label: 'Hành trình' },
]
