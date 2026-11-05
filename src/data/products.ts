export type Product = {
  name: string
  code: string
  category: string
  image: string
  gallery: string[]
  description: string
}

const asset = (number: number) => `/assets/products/${String(number).padStart(2, '0')}.webp`

export const products: Product[] = [
  { name: 'Bình giữ nhiệt Magic MPI-480', code: 'MPI-480', category: 'Bình giữ nhiệt', image: asset(1), gallery: [1, 2, 3, 4, 5, 6, 7, 8].map(asset), description: 'Thiết kế gọn trong tay, tiện cho nhịp sống mỗi ngày.' },
  { name: 'Bình giữ nhiệt Magic MC1200', code: 'MC1200', category: 'Bình giữ nhiệt', image: asset(9), gallery: [9, 10, 11, 12, 13, 14, 15, 16].map(asset), description: 'Dung tích lớn, dễ cầm mang theo trong nhiều hành trình.' },
  { name: 'Bình giữ nhiệt Magic MC870', code: 'MC870', category: 'Bình giữ nhiệt', image: asset(19), gallery: [19, 20, 21, 22, 23, 24, 25].map(asset), description: 'Phối màu trẻ trung và nắp bật tiện lợi.' },
  { name: 'Bình giữ nhiệt Magic MC650', code: 'MC650', category: 'Bình giữ nhiệt', image: asset(26), gallery: [26, 27, 28, 29, 30, 31, 32, 33].map(asset), description: 'Dáng thể thao cùng dây xách linh hoạt.' },
  { name: 'Bình giữ nhiệt Magic MC570', code: 'MC570', category: 'Bình giữ nhiệt', image: asset(35), gallery: [asset(35)], description: 'Bảng màu tươi sáng, phù hợp sử dụng hằng ngày.' },
  { name: 'Bình giữ nhiệt Magic MC500', code: 'MC500', category: 'Bình giữ nhiệt', image: asset(62), gallery: [62, 63, 64, 65, 66, 67, 68, 69].map(asset), description: 'Một điểm nhấn đáng yêu cho bàn học và góc làm việc.' },
  { name: 'Quạt sạc cầm tay Magic A014', code: 'A-014', category: 'Quạt sạc', image: asset(43), gallery: [43, 44, 45, 46, 47, 48, 49, 50, 51].map(asset), description: 'Nhỏ gọn, linh hoạt và dễ dàng mang theo.' },
  { name: 'Quạt tích điện Magic A028', code: 'A-028', category: 'Quạt sạc', image: asset(52), gallery: [52, 53, 54, 55, 56, 57, 58, 59, 60].map(asset), description: 'Làm mát linh hoạt cho nhiều không gian trong ngày.' },
  { name: 'Tăm nước Magic B02 Pro', code: 'B-02PRO', category: 'Chăm sóc cá nhân', image: asset(71), gallery: [71, 72, 73, 74, 75, 76, 77].map(asset), description: 'Thiết kế nhỏ gọn cho thói quen chăm sóc răng miệng.' },
  { name: 'Bàn chải điện Magic B26', code: 'B-26', category: 'Chăm sóc cá nhân', image: asset(78), gallery: [78, 79, 80, 81, 82, 83, 84, 85, 86, 87].map(asset), description: 'Thiết kế tối giản với nhiều màu sắc trẻ trung.' },
]

export const productCategories = ['Tất cả', 'Bình giữ nhiệt', 'Quạt sạc', 'Chăm sóc cá nhân']
