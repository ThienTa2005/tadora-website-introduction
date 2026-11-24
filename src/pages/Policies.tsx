import { PageHeading } from '../components/Hub'
import { affiliateDisclosure } from '../data/affiliate'
import { analyticsDisabled, setAnalyticsDisabled } from '../lib/analytics'

export function AffiliateDisclosure() {
  return (
    <article className="hub-wrap hub-reading hub-policy">
      <PageHeading title="Công bố tiếp thị liên kết" />
      <p>{affiliateDisclosure}</p>
      <h2>Liên kết trên TADORA</h2>
      <p>Nút “Xem giá trên TikTok Shop” mở liên kết do nhóm TADORA xác nhận. Nếu sản phẩm đang cập nhật liên kết, bạn vẫn có thể xem ảnh, video và bài viết của sản phẩm.</p>
      <h2>Thông tin giao dịch</h2>
      <p>Hãy xem giá, tình trạng sản phẩm, điều kiện giao hàng và chính sách đổi trả tại trang của nhà bán hàng. Lượt nhấp trên website được ghi nhận như một tương tác, còn dữ liệu giao dịch đến từ báo cáo TikTok Affiliate Center đã đối chiếu.</p>
      <a className="hub-text-link" href="/privacy">Chính sách bảo mật</a>
    </article>
  )
}

export function Privacy() {
  const disabled = analyticsDisabled()
  return (
    <article className="hub-wrap hub-reading hub-policy">
      <PageHeading title="Chính sách bảo mật" description="Cách TADORA xử lý dữ liệu khi bạn đọc nội dung, xem video và mở liên kết." />
      <h2>Dữ liệu truy cập</h2>
      <p>Khi được cấu hình, Google Analytics 4 và Vercel Web Analytics giúp nhóm đo lường lượt truy cập, nguồn giới thiệu và tương tác như xem bài, mở video, dùng quiz hoặc nhấp liên kết. Quiz dùng các lựa chọn về nhu cầu và ngân sách để gợi ý ngay trên thiết bị.</p>
      <h2>Lựa chọn phân tích</h2>
      <p>Cài đặt dưới đây áp dụng cho trình duyệt này. TADORA lưu trạng thái bạn chọn trên thiết bị. Trang sẽ tải lại để áp dụng lựa chọn.</p>
      <button className="hub-button hub-button--outline" type="button" onClick={() => setAnalyticsDisabled(!disabled)}>
        {disabled ? 'Bật lại phân tích truy cập' : 'Tắt phân tích truy cập'}
      </button>
      <h2>Dịch vụ bên ngoài</h2>
      <p>Trình phát TikTok có thể kết nối với TikTok khi bạn mở video nhúng. Khi mở TikTok Shop, Google Drive hoặc mạng xã hội, dịch vụ đích xử lý dữ liệu theo chính sách của họ. Nhà bán hàng và TikTok Shop xử lý thông tin đặt hàng và thanh toán.</p>
      <h2>Liên hệ</h2>
      <p>Bạn có thể gửi câu hỏi qua các kênh chính thức của TADORA ở cuối trang.</p>
    </article>
  )
}
