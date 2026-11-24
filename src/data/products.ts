export type Product = {
  name: string
  code: string
  slug: string
  category: string
  image: string
  gallery: string[]
  description: string
  video?: {
    src: string
    poster: string
    preview?: string
  }
}

const productVideoSlugs: Record<string, string> = {
  'MPI-480': 'mpi-480',
  MC1200: 'mc1200',
  MC870: 'mc-870',
  MC650: 'mc-650',
  MC570: 'mc-570',
  MC500: 'mc-500',
  'A-014': 'a-014',
  'A-028': 'a-028',
  'B-02PRO': 'b-02',
  'B-26': 'b-26',
}

const asset = (number: number) => `/assets/products/${String(number).padStart(2, '0')}.webp`
const productVideo = (code: string, poster: string): Product['video'] => {
  const slug = productVideoSlugs[code]
  if (!slug) return undefined

  return {
    src: `/videos/products/${slug}.mp4`,
    poster,
  }
}

const productData: Product[] = [
  { name: 'Bình giữ nhiệt MAGIC MPI-480', code: 'MPI-480', slug: 'mpi-480', category: 'Bình giữ nhiệt', image: asset(1), gallery: [1, 2, 3, 4, 5, 6, 7, 8].map(asset), description: 'Thiết kế gọn trong tay, tiện cho nhịp sống mỗi ngày.' },
  { name: 'Bình giữ nhiệt MAGIC MC1200', code: 'MC1200', slug: 'mc1200', category: 'Bình giữ nhiệt', image: asset(9), gallery: [9, 10, 11, 12, 13, 14, 15, 16].map(asset), description: 'Dung tích lớn, dễ cầm mang theo trong nhiều hành trình.' },
  { name: 'Bình giữ nhiệt MAGIC MC870', code: 'MC870', slug: 'mc-870', category: 'Bình giữ nhiệt', image: asset(19), gallery: [19, 20, 21, 22, 23, 24, 25].map(asset), description: 'Phối màu trẻ trung và nắp bật tiện lợi.' },
  { name: 'Bình giữ nhiệt MAGIC MC650', code: 'MC650', slug: 'mc-650', category: 'Bình giữ nhiệt', image: asset(26), gallery: [26, 27, 28, 29, 30, 31, 32, 33].map(asset), description: 'Dáng thể thao cùng dây xách linh hoạt.' },
  { name: 'Bình giữ nhiệt MAGIC MC-570', code: 'MC570', slug: 'mc-570', category: 'Bình giữ nhiệt', image: asset(35), gallery: [asset(35)], description: 'Bảng màu tươi sáng, phù hợp sử dụng hằng ngày.' },
  { name: 'Bình giữ nhiệt MAGIC MC500', code: 'MC500', slug: 'mc-500', category: 'Bình giữ nhiệt', image: asset(62), gallery: [62, 63, 64, 65, 66, 67, 68, 69].map(asset), description: 'Một điểm nhấn đáng yêu cho bàn học và góc làm việc.' },
  { name: 'Quạt sạc cầm tay MAGIC A014', code: 'A-014', slug: 'a-014', category: 'Quạt sạc', image: asset(43), gallery: [43, 44, 45, 46, 47, 48, 49, 50, 51].map(asset), description: 'Nhỏ gọn, linh hoạt và dễ dàng mang theo.' },
  { name: 'Quạt tích điện MAGIC A028', code: 'A-028', slug: 'a-028', category: 'Quạt sạc', image: asset(52), gallery: [52, 53, 54, 55, 56, 57, 58, 59, 60].map(asset), description: 'Làm mát linh hoạt cho nhiều không gian trong ngày.' },
  { name: 'Máy tăm nước MAGIC B-02 Pro', code: 'B-02PRO', slug: 'b-02-pro', category: 'Chăm sóc cá nhân', image: asset(71), gallery: [71, 72, 73, 74, 75, 76, 77].map(asset), description: 'Thiết kế nhỏ gọn cho thói quen chăm sóc răng miệng.' },
  { name: 'Bàn chải điện MAGIC B-26', code: 'B-26', slug: 'b-26', category: 'Chăm sóc cá nhân', image: asset(78), gallery: [78, 79, 80, 81, 82, 83, 84, 85, 86, 87].map(asset), description: 'Thiết kế tối giản với nhiều màu sắc trẻ trung.' },
]

export const products = productData.map((product) => ({
  ...product,
  video: productVideo(product.code, product.image),
}))

export type CatalogProduct = (typeof products)[number]

export const productCategories = [...new Set(products.map((product) => product.category))]
export const featuredCodes = ['B-26', 'B-02PRO', 'MC570']
export const featuredProducts = featuredCodes.map((code) => products.find((product) => product.code === code)!)
export const catalog = [...featuredProducts, ...products.filter((product) => !featuredCodes.includes(product.code))]
