# Hướng dẫn video TADORA

## 1. Tên và vị trí file

Tạo thư mục `public/videos/products/` nếu chưa có. Tên slug phải khớp một trong các giá trị:

`mpi-480`, `mc1200`, `mc-870`, `mc-650`, `mc-570`, `mc-500`, `a-014`, `a-028`, `b-02`, `b-26`.

Mỗi sản phẩm dùng:

- Video chính: `public/videos/products/<slug>.mp4` — 9:16, 720 × 1280, 6 giây, không tiếng, mục tiêu tối đa 2 MB.
- Poster mặc định dùng ảnh chính của sản phẩm, không cần tạo file poster riêng.
- Preview tùy chọn: `public/videos/products/<slug>-preview.mp4` — 9:16, 480p, 3–4 giây, mục tiêu tối đa 500 KB. Muốn dùng preview, thêm thuộc tính `preview` trong helper tại `src/data/products.ts`; nếu không, thẻ hover dùng video chính.

Video nhận diện TADORA dùng:

- `public/videos/logo-intro.mp4` — 16:9, phát một lần trong vùng logo của thanh điều hướng mỗi khi tải hoặc tải lại trang.
- WebM là tùy chọn. Nền video là `#fffaf3`, không tiếng, dài khoảng 3 giây và file nên dưới 2 MB.
- Khi video kết thúc, giao diện chuyển sang ảnh logo tĩnh. Reduce Motion hoặc Data Saver sẽ bỏ qua video và hiển thị logo tĩnh ngay.

## 2. Lệnh ffmpeg tham khảo

Thay `INPUT` và `<slug>` bằng file/thông tin thật. Các lệnh dưới đây giữ trọn sản phẩm giữa khung, thêm nền kem khi cần và loại bỏ âm thanh.

### Video sản phẩm 720 × 1280

```bash
ffmpeg -i INPUT -t 6 -an -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/products/<slug>.mp4
```

Nếu file vượt 2 MB, tăng CRF từng bước nhỏ (29, 30) và xem lại chất lượng.

Để nén đồng loạt toàn bộ video đang có mà vẫn giữ nguyên thời lượng, chạy:

```bash
npm run videos
```

Lệnh cần `ffmpeg` trong PATH. Cũng có thể truyền đường dẫn trực tiếp tới executable: `npm run videos -- /path/to/ffmpeg`.

### Preview 4 giây, rộng 480px

```bash
ffmpeg -i INPUT -t 4 -an -vf "scale=480:854:force_original_aspect_ratio=decrease,pad=480:854:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 30 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/products/<slug>-preview.mp4
```

### Poster WebP

```bash
ffmpeg -ss 0.5 -i public/videos/products/<slug>.mp4 -frames:v 1 -vf "scale=720:-2" -c:v libwebp -q:v 78 -compression_level 4 public/videos/products/<slug>-poster.webp
```

### Video nhận diện

```bash
ffmpeg -i LOGO_LANDSCAPE_INPUT -t 4 -an -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xfffaf3,setsar=1" -c:v libx264 -preset medium -crf 29 -pix_fmt yuv420p -profile:v high -movflags +faststart public/videos/logo-intro.mp4
```

WebM là tùy chọn; đặt thuộc tính `landscape.webm` trong `src/data/site.ts` thành đường dẫn thật khi file tương ứng đã tồn tại.

## 3. Bật video trên website

1. Chép MP4 vào đúng vị trí.
2. Mở `src/data/videos.ts` và thêm cặp mã sản phẩm → slug vào `productVideoSlugs`, ví dụ: `'A-028': 'a-028'`.
3. Nếu đã chép video nhận diện, đổi `logoVideoReady` trong `src/data/site.ts` thành `true`. Nếu có WebM, thay `landscape.webm: undefined` bằng đường dẫn file; nếu không, giữ nguyên `undefined` để trình duyệt không yêu cầu file thiếu.
4. Chạy `npm run typecheck`, sau đó `npm run build`.

Website không yêu cầu video sản phẩm nào khi `productVideoSlugs` rỗng, và không yêu cầu video logo khi `logoVideoReady` là `false`.

## 4. Ảnh responsive

Giữ nguyên ảnh gốc rồi chạy:

```bash
npm run images
```

Lệnh này sinh biến thể 480/960 cho ảnh sản phẩm và 600/1200 cho ảnh đội ngũ, không ghi đè ảnh nguồn.

Giữ thuộc tính `width` và `height` trên mọi thẻ `<img>` để trình duyệt dành sẵn không gian và tránh nhảy bố cục. Mỗi rule CSS của ảnh phải đồng thời đặt `height: auto` khi ảnh co theo chiều rộng, hoặc đặt một chiều cao tường minh (chẳng hạn `height: 100%` hay chiều cao cố định) khi bố cục cần crop ảnh.

## 5. Checklist trước khi deploy

- Tất cả slug, tên file và chữ hoa/thường khớp chính xác.
- Video sản phẩm là 9:16, không tiếng và sản phẩm nằm giữa.
- MP4 dùng `yuv420p`, profile High và `faststart`; kiểm tra dung lượng theo giới hạn ở trên.
- Không bật slug hoặc logo readiness trước khi toàn bộ file liên quan đã tồn tại.
- Kiểm tra hover/focus trên máy tính, vuốt và modal trên điện thoại thật.
- Bật Reduce Motion và Data Saver để xác nhận không có autoplay.
- Trong Network: không có 404; thẻ nhỏ tải ảnh 480px; video chỉ tải khi đến gần viewport.
- Chạy `npm run typecheck && npm run build` trước khi deploy Vercel.
