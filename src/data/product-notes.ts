type ProductNotes = {
  suitable: string
  tradeoff: string
  use: string
  specs?: { label: string; value: string; source: string }[]
  experience?: string
}

const notes: Record<string, ProductNotes> = {
  'B-26': {
    suitable: 'Người muốn tìm hiểu bàn chải điện để dùng hằng ngày.',
    tradeoff: 'Cần đối chiếu loại đầu chải thay thế và cân nhắc cảm giác rung trước khi chọn.',
    use: 'Lắp đầu chải và làm quen với các nút điều khiển theo hướng dẫn đi kèm. Kiểm tra cách vệ sinh đầu chải và bảo quản phần sạc.',
    specs: [
      { label: 'Pin', value: '1.200 mAh', source: '/assets/products/78.webp' },
      { label: 'Cấp chống nước công bố', value: 'IPX7', source: '/assets/products/85.webp' },
    ],
  },
  'B-02PRO': {
    suitable: 'Người muốn tìm hiểu máy tăm nước nhỏ gọn để bổ sung vào thói quen chăm sóc răng miệng.',
    tradeoff: 'Cần châm nước và vệ sinh bình chứa sau khi sử dụng.',
    use: 'Lắp đầu tăm, châm nước và chọn chế độ theo hướng dẫn của mẫu máy. Xả phần nước còn lại và để bình ráo sau khi vệ sinh.',
    specs: [{ label: 'Cấp chống nước công bố', value: 'IPX7', source: '/assets/products/72.webp' }],
  },
  MC570: {
    suitable: 'Người cần bình nước cho bàn học, nơi làm việc hoặc quà tặng.',
    tradeoff: 'Đối chiếu kích thước với ngăn túi và kiểm tra cách đóng nắp trước khi mang bình đi.',
    use: 'Rửa bình trước lần đầu dùng. Đóng nắp theo hướng dẫn và để bình ráo sau khi vệ sinh.',
    specs: [{ label: 'Dung tích', value: '570 ml', source: '/assets/products/35.webp' }],
  },
}

const categoryNotes: Record<string, ProductNotes> = {
  'Bình giữ nhiệt': {
    suitable: 'Người mang theo nước khi đi học, đi làm hoặc di chuyển.',
    tradeoff: 'Cân nhắc dung tích, trọng lượng khi đầy và không gian trong túi.',
    use: 'Rửa bình trước lần đầu dùng. Tham khảo hướng dẫn kèm theo về loại đồ uống phù hợp và cách vệ sinh nắp.',
  },
  'Quạt sạc': {
    suitable: 'Người muốn có luồng gió cá nhân ở bàn làm việc hoặc khi di chuyển.',
    tradeoff: 'Đối chiếu kích thước, cách sạc và thời lượng sử dụng ở mức gió bạn cần.',
    use: 'Đọc hướng dẫn sạc và vệ sinh. Tắt nguồn trước khi vệ sinh và để thiết bị khô trước khi dùng lại.',
  },
}

export const getProductNotes = (code: string, category: string): ProductNotes => notes[code] ?? categoryNotes[category] ?? {
  suitable: 'Người muốn tìm hiểu sản phẩm cho thói quen hằng ngày.',
  tradeoff: 'Đối chiếu tính năng và phụ kiện theo tài liệu của đúng mã sản phẩm.',
  use: 'Tham khảo hướng dẫn sử dụng và vệ sinh đi kèm sản phẩm.',
}
