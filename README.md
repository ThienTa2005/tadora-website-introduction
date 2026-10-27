# TADORA — DBC 2026

Website giới thiệu đội thi TADORA theo hướng team portfolio, digital business project showcase và interactive storytelling.

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thường là `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

Thư mục thành phẩm là `dist/`.

## Dữ liệu cần bổ sung

- Ảnh chân dung và vai trò/nhiệm vụ cụ thể của 5 thành viên.
- Bản tóm tắt đề án, mục tiêu, khách hàng và định hướng kinh doanh.
- Ảnh, mô tả và thông số đã xác minh của sản phẩm MAGIC.
- Link Facebook, Instagram và gian hàng Shopee.
- Ảnh bài đăng, video và hình ảnh hoạt động bản gốc.
- Kết quả, số liệu và bằng chứng tiến độ đã xác minh.

## Cập nhật nội dung

- Thành viên: `src/data/team.ts`
- Sản phẩm: `src/data/products.ts`
- Tiến độ: `src/data/timeline.ts`
- Thông tin chung: `src/data/site.ts`
- Giao diện: `src/App.tsx`
- Màu sắc và bố cục: `src/styles/index.css`

## Đưa lên GitHub và Vercel

1. Tạo repository GitHub mới và đẩy toàn bộ mã nguồn lên.
2. Trong Vercel, chọn **Add New Project** và import repository.
3. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Sau khi deploy, vào **Settings → Domains**, thêm `tadora.id.vn`.
5. Cập nhật bản ghi DNS theo giá trị Vercel cung cấp tại nhà đăng ký tên miền. Chỉ đổi DNS sau khi đối chiếu đúng tên miền và dự án.

## Lưu ý dữ liệu

Các nội dung chưa được xác nhận đều có nhãn “Đang cập nhật”. Không thêm doanh thu, đơn hàng, KPI, thông số sản phẩm hoặc thành tích nếu chưa có bằng chứng.
