export const site = {
  name: "TADORA",
  domain: "tadora.id.vn",
  competition: "Sinh viên Kinh doanh số 2026",
  track: "Nội dung 1 — Bán hàng Online",
  school: "Học viện Công nghệ Bưu chính Viễn thông",
  message: "From Ideas to Digital Impact.",
  subMessage:
    "Từ ý tưởng trên giảng đường đến trải nghiệm kinh doanh số thực tế.",
  logoVideoReady: true,
  logoVideo: {
    landscape: {
      mp4: "/videos/logo-intro.mp4",
      webm: undefined as string | undefined,
    },
  },
  channels: [
    { label: "Shopee", handle: "Gian hàng chính hãng", kind: "shop", url: "https://shopee.vn/shop/1930130462" },
    { label: "Facebook", handle: "TADORA", kind: "facebook", url: "https://www.facebook.com/share/14uvw1JXRwp/" },
    { label: "Instagram", handle: "@tadora.vn", kind: "instagram", url: "https://www.instagram.com/tadora.vn?exln=djdqcXF3MG04dzB6" },
    { label: "Threads", handle: "@tadoraaaaaaaa", kind: "threads", url: "https://www.threads.com/@tadoraaaaaaaa" },
  ] as const,
};

export const navItems = [
  { id: "about", label: "Giới thiệu" },
  { id: "products", label: "Sản phẩm" },
  { id: "team", label: "Đội ngũ" },
  { id: "journey", label: "Hành trình" },
  { id: "about-us", label: "Về chúng tôi" },
];
