export type Article = {
  slug: string
  title: string
  summary: string
  category: 'Góc nhìn sản phẩm' | 'Cẩm nang' | 'So sánh'
  image: string
  productCodes: string[]
  sections: { title: string; body: string }[]
}

export const articles: Article[] = [
  {
    slug: 'ban-chai-dien-magic-b-26',
    title: 'Review bàn chải điện MAGIC B-26',
    summary: 'Tìm hiểu thiết kế và những điểm nên kiểm tra nếu bạn đang chọn chiếc bàn chải điện đầu tiên.',
    category: 'Góc nhìn sản phẩm',
    image: '/assets/products/78.webp',
    productCodes: ['B-26'],
    sections: [
      { title: 'Quan sát thiết kế', body: 'Hình ảnh của B-26 cho thấy tay cầm dạng thẳng và các phiên bản màu sáng. Video giới thiệu giúp bạn quan sát hình dáng trước khi so sánh với chiếc bàn chải đang dùng.' },
      { title: 'Nên kiểm tra điều gì trước khi chọn?', body: 'Hãy xem loại đầu chải đi kèm, cách mua đầu thay thế và thao tác chuyển chế độ trong tài liệu của mẫu bạn định chọn. Cân nhắc chỗ đặt đế sạc và vị trí bảo quản đầu chải để sản phẩm tiện dùng hằng ngày.' },
      { title: 'Ghi chú trải nghiệm', body: 'Bài viết dựa trên bộ ảnh và video giới thiệu. TADORA sẽ cập nhật nhận xét về độ rung, tiếng ồn và thao tác sau khi có kết quả trải nghiệm được nhóm xác nhận.' },
    ],
  },
  {
    slug: 'may-tam-nuoc-magic-b-02-pro',
    title: 'Trải nghiệm máy tăm nước MAGIC B-02 Pro',
    summary: 'Xem thiết kế nhỏ gọn và chuẩn bị những câu hỏi thực tế trước khi chọn máy tăm nước.',
    category: 'Góc nhìn sản phẩm',
    image: '/assets/products/71.webp',
    productCodes: ['B-02PRO'],
    sections: [
      { title: 'Vì sao cân nhắc B-02 Pro?', body: 'B-02 Pro là lựa chọn để tìm hiểu nếu bạn muốn bổ sung một thiết bị chăm sóc răng miệng nhỏ gọn. Bộ ảnh cho thấy thân máy và các đầu tăm đi cùng.' },
      { title: 'Những thao tác nên làm quen', body: 'Trước khi dùng, đối chiếu hướng dẫn đi kèm để biết cách lắp đầu tăm, châm nước và chọn chế độ.' },
      { title: 'Ghi chú trải nghiệm', body: 'TADORA đang dùng ảnh và video giới thiệu để cung cấp góc nhìn ban đầu. Cảm nhận khi cầm, châm nước và sử dụng sẽ được bổ sung sau khi nhóm xác nhận.' },
    ],
  },
  {
    slug: 'cach-chon-binh-giu-nhiet',
    title: 'Cách lựa chọn bình giữ nhiệt',
    summary: 'Bắt đầu từ lượng nước bạn mang theo và nơi bạn sẽ sử dụng bình.',
    category: 'Cẩm nang',
    image: '/assets/products/35.webp',
    productCodes: ['MC570', 'MPI-480', 'MC1200'],
    sections: [
      { title: 'Chọn theo thói quen', body: 'Ghi lại một ngày bạn thường mang bao nhiêu nước, có thể châm thêm ở đâu và bình cần vừa ngăn nào của túi. Dung tích lớn hữu ích khi ít điểm châm nước, còn bình gọn giúp tiết kiệm chỗ.' },
      { title: 'Xem kỹ nắp và miệng bình', body: 'Cách mở nắp, miệng bình có đủ rộng để vệ sinh và khả năng tháo gioăng là những điểm nên kiểm tra. Hãy tham khảo tài liệu của đúng mẫu để biết loại đồ uống và cách vệ sinh phù hợp.' },
    ],
  },
  {
    slug: 'ban-chai-dien-va-tam-nuoc',
    title: 'Bàn chải điện và tăm nước có gì khác nhau?',
    summary: 'Hai thiết bị phục vụ những bước khác nhau trong quy trình chăm sóc răng miệng.',
    category: 'So sánh',
    image: '/assets/products/80.webp',
    productCodes: ['B-26', 'B-02PRO'],
    sections: [
      { title: 'Bàn chải điện để chải răng', body: 'Khi tìm hiểu sản phẩm, hãy để ý kích thước đầu chải, độ dễ cầm và cách thay đầu chải.' },
      { title: 'Máy tăm nước dùng tia nước', body: 'Thiết bị hướng tia nước vào các vị trí khó tiếp cận. Khi tìm hiểu sản phẩm, hãy xem cách lắp đầu tăm, châm nước và chọn chế độ.' },
    ],
  },
  {
    slug: 'su-dung-va-ve-sinh-san-pham',
    title: 'Hướng dẫn sử dụng và vệ sinh sản phẩm',
    summary: 'Một danh sách kiểm tra khi mở hộp, sử dụng và cất các thiết bị tiện ích.',
    category: 'Cẩm nang',
    image: '/assets/products/62.webp',
    productCodes: ['B-26', 'B-02PRO', 'MC570'],
    sections: [
      { title: 'Đọc hướng dẫn của đúng mẫu', body: 'Đối chiếu mã sản phẩm với tài liệu đi kèm trước khi sạc, lắp phụ kiện hoặc rửa. Xác định bộ phận nào có thể tháo và bộ phận nào nên giữ khô.' },
      { title: 'Vệ sinh sau khi sử dụng', body: 'Làm sạch các bộ phận tiếp xúc trực tiếp theo hướng dẫn của nhà sản xuất. Để các bộ phận được phép rửa ráo trước khi lắp lại và cất ở nơi phù hợp với hướng dẫn bảo quản.' },
    ],
  },
]
