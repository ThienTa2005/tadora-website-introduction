# TADORA — DBC 2026

Website giới thiệu đội thi TADORA theo hướng **team portfolio + digital business project showcase + interactive storytelling**.

- Repository: <https://github.com/ThienTa2005/tadora-website-introduction>
- Tên miền dự kiến: <https://tadora.id.vn>
- Công nghệ: React, TypeScript, Vite, Tailwind CSS, Framer Motion và Lucide.

## Chạy trên máy

Yêu cầu Node.js 22 và npm.

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thường là `http://localhost:5173`.

## Kiểm tra production

```bash
npm run typecheck
npm run build
npm run preview
```

Thư mục thành phẩm là `dist/`. Dự án không cần biến môi trường hoặc backend.

## Deploy Vercel

Dự án đã có sẵn:

- `vercel.json`: framework, lệnh cài đặt/build, output và security headers.
- `.nvmrc` và `package.json#engines`: khóa Node.js 22.
- `.vercelignore`: loại bỏ file không cần thiết khi upload.
- `robots.txt`, `sitemap.xml`, web manifest, canonical URL và Open Graph metadata.

Hướng dẫn đầy đủ: [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md).

Cấu hình cần thấy trên Vercel:

| Mục | Giá trị |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `.` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 22.x |
| Production Branch | `main` |
| Environment Variables | Không có |

## Cập nhật nội dung

- Thành viên: `src/data/team.ts`
- Sản phẩm: `src/data/products.ts`
- Tiến độ: `src/data/timeline.ts`
- Thông tin chung: `src/data/site.ts`
- Giao diện: `src/App.tsx`
- Màu sắc và bố cục: `src/styles/index.css`

## Dữ liệu cần bổ sung

- Ảnh chân dung, vai trò và nhiệm vụ cụ thể của 5 thành viên.
- Bản tóm tắt đề án, mục tiêu, khách hàng và định hướng kinh doanh.
- Ảnh, mô tả và thông số đã xác minh của sản phẩm MAGIC.
- Link Facebook, Instagram và gian hàng Shopee.
- Ảnh bài đăng, video và hình ảnh hoạt động bản gốc.
- Kết quả, số liệu và bằng chứng tiến độ đã xác minh.

## Nguyên tắc dữ liệu

Nội dung chưa được xác nhận phải giữ nhãn “Đang cập nhật”. Không thêm doanh thu, đơn hàng, KPI, thông số sản phẩm hoặc thành tích khi chưa có bằng chứng.
