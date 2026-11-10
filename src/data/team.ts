export type Member = {
  name: string
  studentId: string
  className: string
  faculty: string
  role: string
  image: string
  imageWidth: number
  imageHeight: number
  imagePosition?: string
}

export const team: Member[] = [
  { name: 'Đỗ Văn Tiến', studentId: 'B23DCTM121', className: 'D23CQTM01-B', faculty: 'Khoa Quản trị kinh doanh', role: 'Thành viên · Quá tam ba bận', image: '/assets/team/do-van-tien.webp', imageWidth: 1132, imageHeight: 1600, imagePosition: '50% 54%' },
  { name: 'Nguyễn Hồng Nhung', studentId: 'B23DCTM097', className: 'D23CQTM01-B', faculty: 'Khoa Quản trị kinh doanh', role: 'Thành viên · Quá tam ba bận', image: '/assets/team/nguyen-hong-nhung.webp', imageWidth: 960, imageHeight: 960, imagePosition: '50% 34%' },
  { name: 'Phạm Thị Thu', studentId: 'B23DCTM121', className: 'D23CQTM03-B', faculty: 'Khoa Quản trị kinh doanh', role: 'Thành viên · Quá tam ba bận', image: '/assets/team/pham-thi-thu.webp', imageWidth: 1200, imageHeight: 1600, imagePosition: '50% 54%' },
  { name: 'Nguyễn Thị Vui', studentId: 'B23DCTM136', className: 'D23CQTM01-B', faculty: 'Khoa Quản trị kinh doanh', role: 'Thành viên · Quá tam ba bận', image: '/assets/team/nguyen-thi-vui.webp', imageWidth: 1200, imageHeight: 1600, imagePosition: '50% 52%' },
  { name: 'Tạ Thanh Thiên', studentId: 'B23DCCN783', className: 'D23CTPM01', faculty: 'Khoa Công nghệ thông tin', role: 'Thành viên · Quá tam ba bận', image: '/assets/team/ta-thanh-thien.webp', imageWidth: 1600, imageHeight: 1600, imagePosition: '50% 34%' },
]
