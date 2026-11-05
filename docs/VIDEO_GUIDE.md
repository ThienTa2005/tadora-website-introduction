# Hướng dẫn video TADORA

## 1. Tên và vị trí file

Tạo thư mục `public/videos/products/` nếu chưa có. Tên slug phải khớp một trong các giá trị:

`mpi-480`, `mc1200`, `mc870`, `mc650`, `mc570`, `mc500`, `a-014`, `a-028`, `b-02pro`, `b-26`.

Mỗi sản phẩm dùng:

- Video chính: `public/videos/products/<slug>.mp4` — 9:16, 720 × 1280, 6 giây, không tiếng, mục tiêu tối đa 2 MB.
- Poster: `public/videos/products/<slug>-poster.webp`.
- Preview tùy chọn: `public/videos/products/<slug>-preview.mp4` — 9:16, 480p, 3–4 giây, mục tiêu tối đa 500 KB. Muốn dùng preview, thêm thuộc tính `preview` trong helper tại `src/data/products.ts`; nếu không, thẻ hover dùng video chính.

Logo intro dùng:

- `public/videos/logo-intro.mp4` — 16:9.
- `public/videos/logo-intro-portrait.mp4` — 9:16.
- Có thể thêm hai file WebM cùng tên. Nền video là `#fffaf3`, không tiếng, dài khoảng 3 giây.

## 2. Lệnh ffmpeg tham khảo

Thay `INPUT` và `<slug>` bằng file/thông tin thật. Các lệnh dưới đây giữ trọn sản phẩm giữa khung, thêm nền kem khi cần và loại bỏ âm thanh.

### Video sản phẩm 720 × 1280

```bash
ffmpeg -i INPUT -t 6 -an -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/products/<slug>.mp4
```

Nếu file vượt 2 MB, tăng CRF từng bước nhỏ (29, 30) và xem lại chất lượng.

### Preview 4 giây, rộng 480px

```bash
ffmpeg -i INPUT -t 4 -an -vf "scale=480:854:force_original_aspect_ratio=decrease,pad=480:854:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 30 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/products/<slug>-preview.mp4
```

### Poster WebP

```bash
ffmpeg -ss 0.5 -i public/videos/products/<slug>.mp4 -frames:v 1 -vf "scale=720:-2" -c:v libwebp -q:v 78 -compression_level 4 public/videos/products/<slug>-poster.webp
```

### Logo ngang và dọc

```bash
ffmpeg -i LOGO_LANDSCAPE_INPUT -t 3 -an -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/logo-intro.mp4
ffmpeg -i LOGO_PORTRAIT_INPUT -t 3 -an -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/logo-intro-portrait.mp4
```

WebM là tùy chọn; đặt hai thuộc tính `webm` trong `src/data/site.ts` thành đường dẫn thật khi file tương ứng đã tồn tại.

## 3. Bật video trên website

1. Chép đủ MP4 và poster vào đúng vị trí.
2. Mở `src/data/videos.ts` và thêm slug vào `readyProductVideos`, ví dụ: `['a-028', 'b-26']`.
3. Nếu đã chép đủ video logo, đổi `logoVideoReady` trong `src/data/site.ts` thành `true`. Nếu có WebM, thay hai giá trị `webm: undefined` bằng đường dẫn file; nếu không, giữ nguyên `undefined` để trình duyệt không yêu cầu file thiếu.
4. Chạy `npm run typecheck`, sau đó `npm run build`.

Website không yêu cầu bất kỳ file video nào khi mảng readiness rỗng và `logoVideoReady` là `false`.

## 4. Ảnh responsive

Giữ nguyên ảnh gốc rồi chạy:

```bash
npm run images
```

Lệnh này sinh biến thể 480/960 cho ảnh sản phẩm và 600/1200 cho ảnh đội ngũ, không ghi đè ảnh nguồn.

## 5. Checklist trước khi deploy

- Tất cả slug, tên file và chữ hoa/thường khớp chính xác.
- Video sản phẩm là 9:16, không tiếng, sản phẩm nằm giữa, poster không có khung đen.
- MP4 dùng `yuv420p`, profile High và `faststart`; kiểm tra dung lượng theo giới hạn ở trên.
- Không bật slug hoặc logo readiness trước khi toàn bộ file liên quan đã tồn tại.
- Kiểm tra hover/focus trên máy tính, vuốt và modal trên điện thoại thật.
- Bật Reduce Motion và Data Saver để xác nhận không có autoplay.
- Trong Network: không có 404; thẻ nhỏ tải ảnh 480px; video chỉ tải khi đến gần viewport.
- Chạy `npm run typecheck && npm run build` trước khi deploy Vercel.
