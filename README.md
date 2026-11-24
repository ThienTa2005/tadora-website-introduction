# TADORA 2.0 · DBC 2026

TADORA kết hợp nội dung giới thiệu sản phẩm MAGIC với hồ sơ dự án của đội Quá tam ba bận. Trang chủ dẫn đến bộ sưu tập, thư viện video, cẩm nang, bảng so sánh và quiz. Trang `/about` lưu giữ thiết kế, hồ sơ thành viên, đề án, timeline và tài nguyên của website cũ.

Website dùng React, TypeScript và Vite. Tên miền chính là `tadora.id.vn`. Các giao dịch qua liên kết Affiliate được xử lý tại TikTok Shop.

## Chạy trên máy

Yêu cầu Node.js 22 và npm.

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thường là `http://localhost:5173`.

## Kiểm tra bản cập nhật

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run preview
```

Lần đầu chạy kiểm thử trình duyệt, cài Chromium bằng `npx playwright install chromium`. `npm test` kiểm tra bản build trên Vite Preview và chạy lại kiểm thử ảnh, video, cuộn trang của `/about`. Báo cáo và ảnh kiểm thử nằm trong thư mục `screenshots/`.

Vite tạo các file HTML có title, canonical, Open Graph và structured data riêng cho từng URL. Build cũng sinh `dist/sitemap.xml` từ danh mục và bài viết. Các mốc cũ dạng `/#team`, `/#proposal`, `/#journey` và `/#products` vẫn chuyển đến nội dung tương ứng.

## Cập nhật nội dung

| Nội dung | File |
| --- | --- |
| Ảnh, mã, danh mục và MP4 sản phẩm | `src/data/products.ts` |
| Đối tượng sử dụng, ghi chép trải nghiệm, thông số và nguồn ảnh | `src/data/product-notes.ts` |
| Nhóm nhu cầu | `src/data/needs.ts` |
| Bài review và cẩm nang | `src/data/reviews.ts` |
| Tài khoản TikTok và bài đăng | `src/data/creators.ts`, `src/data/videos.ts` |
| Liên kết TikTok Shop Affiliate | `src/data/affiliate.ts` |
| Hồ sơ thành viên, timeline, hình ảnh hoạt động và kết quả xác nhận | `src/data/team.ts`, `src/data/timeline.ts`, `src/data/project.ts` |
| Đề án và các kênh liên hệ | `src/data/site.ts` |

1. Thêm từng tài khoản vào `creators.ts` với ID ổn định. Đặt `official: true` cho các kênh Affiliate do đội xác nhận để hiển thị trong menu TikTok, footer và Video Hub.
2. Thêm bài đăng đã xác nhận vào `tiktokVideos` trong `videos.ts`. Dùng URL bài đăng đầy đủ có dạng `/@ten-tai-khoan/video/ID` để bật nhúng. Ghi creator, mã sản phẩm, thumbnail và ngày đăng ISO nếu có. Các MP4 hiện có vẫn xuất hiện dưới dạng video giới thiệu sản phẩm.
3. Thêm bản ghi vào `affiliateLinks` trong `affiliate.ts`. Điền mã và slug sản phẩm, thông tin creator, URL TikTok Shop gốc, campaign ID, ngày tạo và ngày hết hạn nếu có. Dùng ngày ISO 8601 có múi giờ cho thời điểm hết hạn, ví dụ `2026-12-05T23:59:59+07:00`. Đặt `status: 'active'` khi đã duyệt. Giữ nguyên toàn bộ URL và tham số tracking khi dán.
4. Gắn `videoId` hoặc `tiktokVideoUrl` nếu CTA dành riêng cho một bài đăng. CTA trong thẻ video ưu tiên liên kết của video, sau đó chọn liên kết chung cùng creator nếu có. CTA của sản phẩm ưu tiên bản ghi chung còn hiệu lực. Khi chưa có bản ghi hợp lệ, website hiển thị trạng thái cập nhật.
5. Bổ sung ảnh hoạt động có quyền sử dụng, ghi chép trải nghiệm, nguồn thông số, cột mốc và kết quả đã xác nhận. Số đơn, GMV và hoa hồng lấy từ báo cáo TikTok Affiliate Center hoặc báo cáo thực tế đã đối chiếu.

## Analytics

- Đặt `VITE_GA_MEASUREMENT_ID` bằng Measurement ID GA4 ở môi trường tương ứng. GA4 ghi lượt xem trang và các sự kiện xem sản phẩm, bài viết, dự án, video, phát video, nhấp creator, nhấp Affiliate, so sánh, hoàn tất quiz và chia sẻ.
- Bật Web Analytics trên dự án Vercel. Đặt `VITE_VERCEL_ANALYTICS=true` nếu dự án cần cấu hình thủ công. Chỉ bật `VITE_VERCEL_CUSTOM_EVENTS=true` khi gói Vercel hỗ trợ custom events.
- Trong GA4, đăng ký các tham số sự kiện cần phân tích như `product_id`, `creator_id`, `video_id`, `source_page`, `button_position`, `campaign_id` và `traffic_source`. Để đo tỷ lệ phiên có nhấp Affiliate, dùng số phiên có sự kiện `affiliate_click` chia cho tổng số phiên trong cùng kỳ. Dùng báo cáo TikTok Affiliate Center để đối chiếu số liệu bán hàng.
- Trang `/privacy` cho phép tắt phân tích trên trình duyệt đang sử dụng.

## Deploy Vercel

Commit và push nhánh `affiliate-v2` để dự án Vercel hiện có tạo Preview Deployment. Mở URL preview để kiểm tra các trang đích, kiểm tra tracking trong GA4 DebugView hoặc Vercel Web Analytics và mở các liên kết do nhóm cung cấp. Sau khi duyệt preview, merge vào nhánh production hiện tại.

Vercel tiếp tục dùng Node.js 22, Vite, `npm ci`, `npm run build`, thư mục `dist` và `cleanUrls` từ cấu hình hiện có. [Hướng dẫn Vercel chi tiết](docs/DEPLOY_VERCEL.md).
