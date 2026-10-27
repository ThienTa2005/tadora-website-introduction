import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp, Building2, CalendarDays, ChevronRight, ExternalLink, GraduationCap, Instagram, Menu, MousePointer2, Network, PackageOpen, Play, School, ShoppingBag, Sparkles, Target, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Modal } from './components/Modal'
import { SectionHeading } from './components/SectionHeading'
import { products, productCategories, type Product } from './data/products'
import { navItems, site } from './data/site'
import { team, type Member } from './data/team'
import { timeline } from './data/timeline'

const processes = [
  { number: '01', title: 'Research', text: 'Nghiên cứu thương hiệu, sản phẩm, thị trường và khách hàng.' },
  { number: '02', title: 'Strategy', text: 'Định hình kế hoạch kinh doanh, marketing và truyền thông.' },
  { number: '03', title: 'Execution', text: 'Triển khai kênh, nội dung, vận hành và chăm sóc khách hàng.' },
  { number: '04', title: 'Measurement', text: 'Theo dõi dữ liệu, đánh giá hiệu quả và cải tiến.' },
]

function App() {
  const reduceMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState('about')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState('Tất cả')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filteredProducts = useMemo(() => category === 'Tất cả' ? products : products.filter((item) => item.category === category), [category])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-30% 0px -55%', threshold: [0.1, 0.4, 0.7] })
    navItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main>
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="TADORA — Trang chủ">
          <img src="/logo-tadora.png" alt="Logo TADORA" />
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => scrollTo(item.id)}>{item.label}</button>)}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{navItems.map((item) => <button key={item.id} onClick={() => scrollTo(item.id)}>{item.label}<ChevronRight size={18} /></button>)}</motion.nav>}</AnimatePresence>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-orbit orbit-one" animate={reduceMotion ? {} : { rotate: 360 }} transition={{ duration: 24, ease: 'linear', repeat: Infinity }} />
        <motion.div className="hero-orbit orbit-two" animate={reduceMotion ? {} : { rotate: -360 }} transition={{ duration: 32, ease: 'linear', repeat: Infinity }} />
        <div className="hero-content">
          <motion.div className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }}><Sparkles size={16} /> DBC 2026 · BÁN HÀNG ONLINE</motion.div>
          <motion.img className="hero-logo" src="/logo-tadora.png" alt="TADORA" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8 }} />
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .7 }}>From Ideas to<br /><em>Digital Impact.</em></motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}>{site.subMessage}</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .58 }}>
            <button className="button button-primary" onClick={() => scrollTo('project')}>Khám phá dự án <ArrowDown size={18} /></button>
            <span className="domain-pill"><span /> {site.domain}</span>
          </motion.div>
        </div>
        <div className="hero-side-note">A DIGITAL COMMERCE JOURNEY · 2026</div>
      </section>

      <section className="section identity" id="about">
        <div className="container">
          <SectionHeading eyebrow="01 · NHẬN DIỆN" title="Một biểu tượng. Một hành trình đang mở." description="TADORA là đội sinh viên Học viện Công nghệ Bưu chính Viễn thông tham gia DBC 2026, nơi kiến thức được kiểm chứng bằng trải nghiệm kinh doanh số thực tế." />
          <div className="identity-layout">
            <motion.div className="identity-mark" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="/logo-tadora.png" alt="Bộ nhận diện logo TADORA" loading="lazy" />
              <span>Primary identity / 2026</span>
            </motion.div>
            <div className="identity-cards">
              <article><School /><span>Đơn vị học tập</span><strong>{site.school}</strong></article>
              <article><Target /><span>Nội dung dự thi</span><strong>{site.track}</strong></article>
              <article><CalendarDays /><span>Thời gian dự án</span><strong>01.10 — 05.12.2026</strong></article>
              <article className="accent-card"><Sparkles /><span>Tinh thần</span><strong>Creative · Youthful<br />Intelligent · Ambitious</strong></article>
            </div>
          </div>
        </div>
      </section>

      <section className="section team-section" id="team">
        <div className="container">
          <SectionHeading eyebrow="02 · OUR PEOPLE" title="Different minds. One vision." description="Năm góc nhìn, hai lĩnh vực chuyên môn, cùng hướng về một mục tiêu chung." />
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.button key={member.name} className={`member-card member-card--${member.accent}`} onClick={() => setSelectedMember(member)} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}>
                <div className="portrait-placeholder" aria-label="Ảnh thành viên sẽ cập nhật"><span>{String(index + 1).padStart(2, '0')}</span><div className="portrait-shape" /></div>
                <div className="member-info"><span>{member.role}</span><h3>{member.name}</h3><p>{member.className} · {member.faculty.replace('Khoa ', '')}</p></div>
                <span className="member-open"><MousePointer2 size={15} /> Xem hồ sơ</span>
              </motion.button>
            ))}
          </div>
          <p className="data-note">Ảnh cá nhân, vai trò và nhiệm vụ phụ trách sẽ được cập nhật khi đội xác nhận.</p>
        </div>
      </section>

      <section className="section project-section" id="project">
        <div className="container">
          <SectionHeading light eyebrow="03 · THE PROJECT" title="From classroom knowledge to real-world commerce." description="TADORA tiếp cận dự án theo một quy trình có thể quan sát, kiểm chứng và liên tục cải tiến." />
          <div className="process-grid">{processes.map((item, index) => <motion.article key={item.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}><span>{item.number}</span><div className="process-icon">{index === 0 ? <Target /> : index === 1 ? <Network /> : index === 2 ? <ShoppingBag /> : <Sparkles />}</div><h3>{item.title}</h3><p>{item.text}</p></motion.article>)}</div>
          <div className="project-pending">
            <div><span className="status-dot" /> Hồ sơ dự án</div>
            <h3>Bản tóm tắt đề án, mục tiêu và định hướng khách hàng đang được hoàn thiện.</h3>
            <p>Khu vực này đã được thiết kế sẵn để cập nhật nội dung chính thức mà không cần thay đổi cấu trúc website.</p>
          </div>
        </div>
      </section>

      <section className="section products-section">
        <div className="container">
          <SectionHeading eyebrow="04 · MAGIC COLLECTION" title="Everyday essentials. Smarter living." description="Danh mục sản phẩm trong dự án được trình bày như một phần của câu chuyện kinh doanh — không phải một gian hàng thương mại điện tử." />
          <div className="filters" role="group" aria-label="Lọc sản phẩm">{productCategories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? 'active' : ''}>{item}</button>)}</div>
          <motion.div className="products-grid" layout>{filteredProducts.map((product, index) => <motion.button layout key={product.code} className="product-card" onClick={() => setSelectedProduct(product)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={`product-visual visual-${index % 4}`}><PackageOpen /><span>Ảnh sản phẩm<br />đang cập nhật</span></div>
            <div className="product-meta"><small>{product.category} · {product.code}</small><h3>{product.name}</h3><span>Xem thông tin <ChevronRight size={16} /></span></div>
          </motion.button>)}</motion.div>
        </div>
      </section>

      <section className="section journey-section" id="journey">
        <div className="container">
          <SectionHeading eyebrow="05 · OUR JOURNEY" title="The journey is just beginning." description="Mỗi cột mốc là một bước tiến trong hành trình kinh doanh số của TADORA." />
          <div className="timeline">
            {timeline.map((item, index) => <motion.article key={item.label} initial={{ opacity: 0, x: index % 2 ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .5 }}>
              <div className={`timeline-node ${item.state}`}><span>{String(index + 1).padStart(2, '0')}</span></div>
              <div className="timeline-card"><div><span>{item.state === 'in-progress' ? 'ĐANG TRIỂN KHAI' : 'DỰ KIẾN'}</span><small>{index === 0 ? 'Giai đoạn hiện tại' : 'Chờ cập nhật tiến độ'}</small></div><h3>{item.label}</h3><p>{item.detail}</p></div>
            </motion.article>)}
          </div>
          <div className="results-panel"><div><span>BEYOND THE NUMBERS</span><h3>Kết quả sẽ được kể bằng dữ liệu đã xác minh.</h3></div><p>Doanh thu, đơn hàng, lượt tiếp cận và các bài học thực tế sẽ chỉ xuất hiện khi có bằng chứng từ quá trình triển khai.</p></div>
        </div>
      </section>

      <section className="section media-section" id="media">
        <div className="container">
          <SectionHeading light eyebrow="06 · DIGITAL ECOSYSTEM" title="Ideas in motion. Stories in action." description="Website là điểm kết nối giữa câu chuyện đội thi, nội dung truyền thông và các kênh bán hàng được phép triển khai." />
          <div className="ecosystem">
            <div className="eco-center"><img src="/logo-tadora.png" alt="TADORA" loading="lazy" /><span>WEBSITE HUB</span></div>
            <div className="eco-item eco-facebook">f <span>Facebook<small>Đang cập nhật link</small></span></div>
            <div className="eco-item eco-instagram"><Instagram /> <span>Instagram<small>Đang cập nhật link</small></span></div>
            <div className="eco-item eco-shopee"><ShoppingBag /> <span>Shopee<small>Đang cập nhật link</small></span></div>
          </div>
          <div className="media-heading"><div><span>BEHIND TADORA</span><h3>Một lát cắt của hành trình.</h3></div><p>Ảnh bài đăng, video và hình ảnh hoạt động sẽ được đưa vào gallery này khi tệp gốc được bổ sung.</p></div>
          <div className="media-grid">{[0, 1, 2, 3].map((item) => <button key={item} className={`media-tile media-tile-${item}`} onClick={() => setLightbox(item)}><div className="media-art"><span>{item === 0 ? 'TEAM' : item === 1 ? 'CONTENT' : item === 2 ? 'PROJECT' : 'BEHIND THE SCENES'}</span>{item === 1 && <Play />}</div><span>Khung hình chờ cập nhật · 0{item + 1}</span></button>)}</div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div><img src="/logo-tadora.png" alt="TADORA" /><p>Một hành trình kinh doanh số của sinh viên Học viện Công nghệ Bưu chính Viễn thông.</p></div>
          <div><span>CUỘC THI</span><strong>{site.competition}</strong><p>{site.track}</p></div>
          <div><span>KẾT NỐI</span><strong>{site.domain}</strong><p>Facebook · Instagram · Shopee<br />Đang cập nhật</p></div>
          <button className="footer-cta" onClick={() => scrollTo('project')}>Khám phá dự án <ExternalLink /></button>
        </div>
        <div className="container footer-bottom"><span>© 2026 TADORA</span><p>TADORA là đội dự thi độc lập, không phải website chính thức của MAGIC hoặc Ban Tổ chức DBC.</p></div>
      </footer>

      <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })} aria-label="Về đầu trang"><ArrowUp size={19} /></button>

      <Modal open={!!selectedMember} title="Thông tin thành viên" onClose={() => setSelectedMember(null)}>{selectedMember && <div className="member-modal"><div className={`portrait-placeholder member-card--${selectedMember.accent}`}><GraduationCap /></div><div><span className="eyebrow">THÀNH VIÊN TADORA</span><h2>{selectedMember.name}</h2><p>{selectedMember.role}</p><dl><div><dt>Mã sinh viên</dt><dd>{selectedMember.studentId}</dd></div><div><dt>Lớp</dt><dd>{selectedMember.className}</dd></div><div><dt>Khoa</dt><dd>{selectedMember.faculty}</dd></div><div><dt>Trường</dt><dd>{site.school}</dd></div></dl><small>Ảnh chân dung, vai trò và nhiệm vụ cụ thể sẽ được cập nhật sau khi xác nhận.</small></div></div>}</Modal>
      <Modal open={!!selectedProduct} title="Thông tin sản phẩm" onClose={() => setSelectedProduct(null)}>{selectedProduct && <div className="product-modal"><div className="product-modal-art"><PackageOpen /></div><div><span className="eyebrow">{selectedProduct.category} · {selectedProduct.code}</span><h2>{selectedProduct.name}</h2><p>Hình ảnh, mô tả công dụng và thông số sản phẩm đang chờ dữ liệu chính thức.</p><div className="notice"><Building2 size={18} /> Không hiển thị thông số chưa được xác minh.</div></div></div>}</Modal>
      <Modal open={lightbox !== null} title="Xem tư liệu" onClose={() => setLightbox(null)}>{lightbox !== null && <div className={`lightbox-art media-tile-${lightbox}`}><span>TƯ LIỆU ĐANG CẬP NHẬT</span><h2>{['Hoạt động đội thi', 'Sáng tạo nội dung', 'Triển khai dự án', 'Behind the scenes'][lightbox]}</h2><p>Khung này sẽ hiển thị ảnh hoặc video gốc khi đội bổ sung dữ liệu.</p></div>}</Modal>
    </main>
  )
}

export default App
