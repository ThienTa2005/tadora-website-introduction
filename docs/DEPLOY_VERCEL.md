# Hướng dẫn deploy TADORA lên Vercel

Tài liệu này áp dụng cho repository:

`https://github.com/ThienTa2005/tadora-website-introduction`

Tên miền production dự kiến: `tadora.id.vn`.

## 1. Kiểm tra trước khi deploy

Máy local nên dùng Node.js 22:

```bash
node --version
npm --version
npm ci
npm run typecheck
npm run build
```

Điều kiện đạt:

- `npm ci` hoàn tất không có lỗ hổng được npm báo cáo.
- TypeScript không báo lỗi.
- Vite tạo thành công thư mục `dist/`.
- Không commit `node_modules/`, `dist/`, `.vercel/` hoặc thông tin đăng nhập.

Website hiện không cần biến môi trường.

## 2. Import repository trên Vercel

1. Đăng nhập <https://vercel.com> bằng tài khoản có quyền đọc repository GitHub.
2. Chọn **Add New → Project**.
3. Import repository `ThienTa2005/tadora-website-introduction`.
4. Kiểm tra cấu hình:

   | Mục | Giá trị |
   | --- | --- |
   | Project Name | `tadora-website-introduction` hoặc tên viết thường tương đương |
   | Framework Preset | `Vite` |
   | Root Directory | `.` |
   | Install Command | `npm ci` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Node.js Version | `22.x` |
   | Environment Variables | để trống |

5. Chọn **Deploy**.

Các giá trị build đã nằm trong `vercel.json`; bảng trên dùng để đối chiếu, không cần bật override nếu Vercel đã đọc đúng.

Sau lần deploy đầu tiên, Vercel cấp một URL dạng `*.vercel.app`. Hãy kiểm tra URL này trước khi kết nối tên miền.

## 3. Checklist kiểm thử URL Vercel

- Trang chủ tải không có màn hình trắng hoặc lỗi 404.
- Logo navigation, hero và footer không chèn lên nội dung.
- Menu mobile mở/đóng và cuộn đúng section.
- Bộ lọc sản phẩm, modal thành viên và lightbox hoạt động.
- Font tiếng Việt hiển thị đủ dấu.
- Tab Console trong DevTools không có lỗi màu đỏ.
- `robots.txt`, `sitemap.xml` và `site.webmanifest` truy cập được.
- Refresh trang vẫn tải bình thường.

## 4. Kết nối `tadora.id.vn`

1. Trong dự án Vercel, mở **Settings → Domains**.
2. Thêm `tadora.id.vn`.
3. Vercel sẽ hiển thị chính xác bản ghi DNS cần tạo. Sao chép giá trị Vercel hiển thị thay vì dùng một địa chỉ IP lấy từ hướng dẫn cũ.
4. Mở trang quản lý DNS tại nhà đăng ký tên miền.
5. Vì `tadora.id.vn` là tên miền gốc của dự án, host thường được nhập là `@` hoặc để trống. Tạo bản ghi đúng loại và đúng giá trị Vercel yêu cầu.
6. Quay lại Vercel và chờ trạng thái chuyển sang **Valid Configuration**.
7. Sau khi DNS hợp lệ, Vercel tự cấp chứng chỉ SSL. Kiểm tra `https://tadora.id.vn`.

### Tránh xung đột với hosting cũ

Nếu trước đây đã tạo DNS cho bản ChatGPT Sites, hãy xóa **chỉ các bản ghi cũ của website** trước khi trỏ sang Vercel:

- A record trỏ tới `162.159.143.30` hoặc `172.66.3.26`.
- TXT `_openai-site-verification.tadora.id.vn`.
- TXT `_cf-custom-hostname.tadora.id.vn`.

Không xóa MX, TXT xác thực email, NS hoặc các bản ghi không liên quan. Nếu chưa từng tạo các bản ghi trên thì bỏ qua bước này.

### Tuỳ chọn `www`

Có thể thêm `www.tadora.id.vn` trong Vercel, tạo CNAME theo giá trị Vercel hiển thị và cấu hình redirect về `tadora.id.vn`. Không tự đoán CNAME nếu dashboard cung cấp giá trị riêng cho dự án.

## 5. Cơ chế deploy sau này

- Push hoặc merge vào `main`: Vercel tạo production deployment mới.
- Push lên nhánh khác hoặc mở pull request: Vercel tạo preview deployment.
- Chỉ merge vào `main` sau khi URL preview đã được kiểm tra.

Quy trình khuyến nghị:

```bash
git checkout -b update/noi-dung
git add .
git commit -m "Update TADORA content"
git push -u origin update/noi-dung
```

Tạo Pull Request trên GitHub, kiểm tra preview của Vercel rồi merge vào `main`.

## 6. Deploy bằng CLI — tùy chọn

Dashboard + GitHub là cách đơn giản nhất. Nếu cần CLI:

```bash
npx vercel link
npx vercel
npx vercel --prod
```

- `npx vercel`: tạo preview deployment.
- `npx vercel --prod`: deploy production.
- Không commit thư mục `.vercel/`; thư mục này chỉ chứa liên kết dự án local.

## 7. Rollback khi bản production có lỗi

Trên Vercel:

1. Mở **Deployments**.
2. Tìm production deployment hoạt động tốt gần nhất.
3. Mở menu dấu ba chấm và chọn **Instant Rollback**.
4. Kiểm tra lại tên miền production.

Gói Hobby thường chỉ rollback được về production deployment liền trước. Sau khi sửa lỗi, dùng **Promote** hoặc **Undo Rollback** để khôi phục cơ chế tự động đưa commit mới lên production.

## 8. Xử lý lỗi thường gặp

### Build failed

Kiểm tra Vercel đang dùng Node 22.x và chạy lại ở local:

```bash
npm ci
npm run build
```

Không sửa trực tiếp file trong `dist/`; phải sửa source rồi build lại.

### Output Directory not found

Output Directory phải là `dist`, không phải `build` hoặc `public`.

### Domain chờ xác minh quá lâu

- Mở **Settings → Domains** và xem bản ghi Vercel đang yêu cầu.
- Kiểm tra không còn A/CNAME cũ cùng host.
- Nếu DNS quản lý ở nhà cung cấp khác, thay đổi bản ghi tại nhà cung cấp đó.
- Không xóa các bản ghi email hoặc nameserver không liên quan.

### Deploy thành công nhưng giao diện cũ

- Xác nhận deployment mới đang ở trạng thái **Current**.
- Mở cửa sổ ẩn danh hoặc hard refresh.
- Kiểm tra commit SHA của deployment có trùng commit mới trên `main`.

## 9. Checklist sau khi lên production

- `https://tadora.id.vn` có HTTPS hợp lệ.
- URL HTTP tự chuyển sang HTTPS.
- Canonical URL và Open Graph trỏ tới `https://tadora.id.vn/`.
- Navigation, modal, bộ lọc và responsive hoạt động.
- Không có tài liệu nội bộ, token hoặc biến môi trường bị công khai.
- GitHub và Vercel đều theo dõi production branch `main`.
- Lưu URL production deployment gần nhất để có thể rollback nhanh.

## 10. Tài liệu Vercel chính thức

- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Deploying Git repositories](https://vercel.com/docs/git)
- [Project configuration với vercel.json](https://vercel.com/docs/project-configuration/vercel-json)
- [Thiết lập custom domain](https://vercel.com/docs/domains/set-up-custom-domain)
- [Instant Rollback](https://vercel.com/docs/instant-rollback)
