export type AffiliateLink = {
  productId: string
  productSlug: string
  creatorId: string
  creatorName: string
  tiktokAccountUrl: string
  tiktokVideoUrl?: string
  videoId?: string
  affiliateUrl: string
  campaignId: string
  createdAt: string
  expiresAt?: string
  status: 'draft' | 'active' | 'paused' | 'expired'
}

// Only add URLs supplied and approved by the team. URLs are used verbatim.
export const affiliateLinks: AffiliateLink[] = []

export const affiliateDisclosure = 'TADORA là nền tảng chia sẻ nội dung và giới thiệu sản phẩm. Chúng tôi có thể nhận hoa hồng từ các giao dịch đủ điều kiện thông qua liên kết tiếp thị liên kết. Hoạt động đặt hàng, thanh toán, vận chuyển và bảo hành được thực hiện bởi nhà bán hàng và nền tảng TikTok Shop theo chính sách áp dụng.'
