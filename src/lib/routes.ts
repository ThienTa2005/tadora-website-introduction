import { catalog, type CatalogProduct } from '../data/products'
import { articles, type Article } from '../data/reviews'
import { site } from '../data/site'

export const origin = `https://${site.domain}`
export const productPath = (product: CatalogProduct) => `/products/${product.slug}`
export const reviewPath = (article: Article) => `/reviews/${article.slug}`
export const videoPath = (id: string) => `/videos?video=${encodeURIComponent(id)}`
export const homeHeroSizes = '(max-width: 740px) 53vw, 380px'

export type PageMetadata = {
  path: string
  title: string
  description: string
  image?: string
  type?: 'article' | 'product'
}

export const pages: PageMetadata[] = [
  { path: '/', title: 'TADORA | Trải nghiệm thật, lựa chọn thông minh', description: 'Khám phá sản phẩm tiện ích MAGIC, xem video, đọc cẩm nang và tìm hiểu dự án TADORA tại DBC 2026.', image: '/assets/products/78-960.webp' },
  { path: '/products', title: 'Khám phá sản phẩm MAGIC', description: 'Tìm thiết bị chăm sóc răng miệng, bình giữ nhiệt và quạt sạc theo nhu cầu sử dụng.' },
  { path: '/videos', title: 'Video Review', description: 'Xem video giới thiệu, hướng dẫn và nội dung TikTok của TADORA theo sản phẩm, creator và chủ đề.' },
  { path: '/reviews', title: 'Review & Cẩm nang', description: 'Đọc góc nhìn sản phẩm MAGIC, cẩm nang lựa chọn, so sánh và hướng dẫn bảo quản.' },
  { path: '/compare', title: 'So sánh sản phẩm', description: 'Đặt các sản phẩm MAGIC cạnh nhau để đối chiếu công dụng, đối tượng phù hợp và thông tin đã công bố.' },
  { path: '/recommend', title: 'Gợi ý sản phẩm phù hợp', description: 'Trả lời ba câu hỏi về nhu cầu, mục đích và tính năng ưu tiên để nhận gợi ý từ TADORA.' },
  { path: '/about', title: 'Về dự án TADORA · DBC 2026', description: 'Tìm hiểu đề án TADORA, đội Quá tam ba bận, đối tác MAGIC và hành trình chuyển đổi sang TikTok Affiliate.' },
  { path: '/affiliate-disclosure', title: 'Công bố tiếp thị liên kết', description: 'Tìm hiểu cách TADORA sử dụng liên kết TikTok Shop Affiliate và vai trò của các bên trong giao dịch.' },
  { path: '/privacy', title: 'Chính sách bảo mật', description: 'Tìm hiểu cách TADORA xử lý dữ liệu truy cập, lựa chọn phân tích và dịch vụ nhúng.' },
  ...catalog.map((product) => ({ path: productPath(product), title: product.name, description: product.description, image: product.image, type: 'product' as const })),
  ...articles.map((article) => ({ path: reviewPath(article), title: article.title, description: article.summary, image: article.image, type: 'article' as const })),
]

export const notFound = { path: '/404', title: 'Không tìm thấy trang', description: 'Quay về trang chủ TADORA hoặc khám phá danh mục sản phẩm.' }

export const pageTitle = (page: PageMetadata) => page.path === '/' ? page.title : `${page.title} | TADORA`
export const pageImage = (page: PageMetadata) => origin + (page.image ?? '/assets/products/60.webp')

const legacyHashes: Record<string, string> = {
  '#top': '/about#top',
  '#about': '/about#about',
  '#proposal': '/about#proposal',
  '#products': '/products',
  '#team': '/about#team',
  '#journey': '/about#journey',
  '#about-us': '/about#about-us',
  '#showreel': '/videos',
}

export function resolvePath() {
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  const destination = path === '/' ? legacyHashes[window.location.hash] : undefined
  if (!destination) return path

  const [nextPath, nextHash] = destination.split('#')
  window.history.replaceState(null, '', nextPath + window.location.search + (nextHash ? `#${nextHash}` : ''))
  return nextPath
}
