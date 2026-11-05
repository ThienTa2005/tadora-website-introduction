import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Leaf,
  Menu,
  MousePointer2,
  School,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LogoLockup } from './components/LogoLockup'
import { Modal } from './components/Modal'
import { SectionHeading } from './components/SectionHeading'
import { products, productCategories, type Product } from './data/products'
import { navItems, site } from './data/site'
import { team, type Member } from './data/team'
import { timeline } from './data/timeline'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const reduceMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState('about')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState('Tất cả')

  const filteredProducts = useMemo(
    () => category === 'Tất cả' ? products : products.filter((product) => product.category === category),
    [category],
  )

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-25% 0px -60%', threshold: [0.1, 0.35, 0.7] })

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
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
          <LogoLockup />
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="nav-cta" onClick={() => scrollTo('products')}>
          Khám phá <ArrowRight size={16} />
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)}>
                  {item.label}<ChevronRight size={18} />
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="hero" id="top">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-shell">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="hero-kicker" variants={fadeUp}>
              <span><Sparkles size={15} /> DBC 2026</span>
              <span className="hero-kicker-line" />
              <span>Bán hàng online</span>
            </motion.div>
            <motion.p className="hero-overline" variants={fadeUp}>TADORA · Gian hàng chính hãng</motion.p>
            <motion.h1 variants={fadeUp}>
              Tiện nghi hơn.<br />
              <em>Sống chất hơn.</em>
            </motion.h1>
            <motion.p className="hero-lead" variants={fadeUp}>
              Hành trình kinh doanh số của sinh viên PTIT — nơi ý tưởng trẻ gặp những sản phẩm
              tiện ích được kể bằng một ngôn ngữ gần gũi, tươi mới.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <button className="button button-dark" onClick={() => scrollTo('products')}>
                Xem bộ sưu tập <ArrowDown size={18} />
              </button>
              <button className="text-link" onClick={() => scrollTo('team')}>
                Gặp đội ngũ <Users size={17} />
              </button>
            </motion.div>
          </motion.div>

          <div className="hero-visual" aria-label="Sản phẩm nổi bật của TADORA">
            <motion.div
              className="hero-sun"
              animate={reduceMotion ? {} : { scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.figure
              className="hero-card hero-card-main"
              initial={{ opacity: 0, scale: 0.94, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 0.85, delay: 0.2 }}
            >
              <img src="/assets/products/60.webp" alt="Quạt tích điện Magic A028" />
              <figcaption><span>Sản phẩm nổi bật</span><strong>Magic A028</strong></figcaption>
            </motion.figure>
            <motion.figure
              className="hero-card hero-card-left"
              animate={reduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="/assets/products/01.webp" alt="Bình giữ nhiệt Magic MPI-480" />
            </motion.figure>
            <motion.figure
              className="hero-card hero-card-right"
              animate={reduceMotion ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="/assets/products/80.webp" alt="Bàn chải điện Magic B26" />
            </motion.figure>
            <div className="hero-seal"><Leaf /><span>Curated<br />for daily life</span></div>
          </div>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <div>
            <span>SMART LIVING</span><i>✦</i><span>YOUNG ENERGY</span><i>✦</i>
            <span>DIGITAL COMMERCE</span><i>✦</i><span>TADORA 2026</span><i>✦</i>
            <span>SMART LIVING</span><i>✦</i><span>YOUNG ENERGY</span><i>✦</i>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="about">
        <div className="container">
          <div className="intro-grid">
            <motion.div
              className="intro-sticky"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              <span className="eyebrow">01 · CÂU CHUYỆN TADORA</span>
              <h2>Một gian hàng.<br />Một hành trình <em>rất trẻ.</em></h2>
            </motion.div>
            <div className="intro-content">
              <p className="intro-big">
                TADORA là đội sinh viên Học viện Công nghệ Bưu chính Viễn thông tham gia
                Cuộc thi Sinh viên Kinh doanh số 2026.
              </p>
              <p>
                Chúng mình đưa kiến thức trên giảng đường vào trải nghiệm kinh doanh thực tế:
                từ nghiên cứu sản phẩm, xây dựng nội dung đến vận hành một hệ sinh thái bán hàng số.
              </p>
              <div className="fact-grid">
                <article><School /><span>Đơn vị</span><strong>PTIT</strong><small>Học viện Công nghệ Bưu chính Viễn thông</small></article>
                <article><Target /><span>Nội dung dự thi</span><strong>01</strong><small>Bán hàng Online</small></article>
                <article><CalendarDays /><span>Hành trình</span><strong>2026</strong><small>Từ 01.10 đến 05.12</small></article>
                <article className="fact-accent"><Zap /><span>Tinh thần</span><strong>Make it real.</strong><small>Từ ý tưởng đến tác động số</small></article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section products-section" id="products">
        <div className="container">
          <SectionHeading
            eyebrow="02 · BỘ SƯU TẬP MAGIC"
            title="Nhỏ gọn trong nhà. Tiện lợi ngoài phố."
            description="Những sản phẩm tiện ích được chọn cho nhịp sống học tập, làm việc và di chuyển mỗi ngày."
          />
          <div className="filters" role="group" aria-label="Lọc sản phẩm">
            {productCategories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={category === item ? 'active' : ''}
              >
                {item}
              </button>
            ))}
          </div>
          <motion.div className="products-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.button
                  layout
                  key={product.code}
                  className={'product-card ' + (index === 0 ? 'product-card-featured' : '')}
                  onClick={() => setSelectedProduct(product)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="product-code">{product.code}</span>
                    <span className="product-view"><MousePointer2 size={15} /> Xem chi tiết</span>
                  </div>
                  <div className="product-copy">
                    <small>{product.category}</small>
                    <h3>{product.name.replace('Magic ', '')}</h3>
                    <p>{product.description}</p>
                    <span className="product-arrow"><ArrowRight size={19} /></span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="story-band">
        <div className="container story-band-grid">
          <div>
            <span className="eyebrow">KHÔNG CHỈ LÀ MỘT GIAN HÀNG</span>
            <h2>Học bằng cách<br /><em>thực sự bắt tay làm.</em></h2>
          </div>
          <div className="story-steps">
            {[
              ['01', 'Research', 'Hiểu sản phẩm, thị trường và khách hàng.'],
              ['02', 'Strategy', 'Định hình nội dung và trải nghiệm thương hiệu.'],
              ['03', 'Execution', 'Triển khai kênh và vận hành bán hàng số.'],
              ['04', 'Measure', 'Quan sát dữ liệu, học hỏi và cải tiến.'],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span><div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section team-section" id="team">
        <div className="container">
          <SectionHeading
            eyebrow="03 · OUR PEOPLE"
            title="Năm cá tính. Một nhịp chung."
            description="TADORA được tạo nên bởi những góc nhìn khác nhau, cùng gặp nhau ở tinh thần học hỏi và dám biến ý tưởng thành hành động."
          />
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.button
                key={member.name}
                className={'member-card member-card-' + (index + 1)}
                onClick={() => setSelectedMember(member)}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
              >
                <img
                  src={member.image}
                  alt={'Chân dung ' + member.name}
                  loading="lazy"
                  style={{ objectPosition: member.imagePosition }}
                />
                <div className="member-shade" />
                <span className="member-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="member-info">
                  <small>{member.role}</small>
                  <h3>{member.name}</h3>
                  <p>{member.className}</p>
                </div>
                <span className="member-open"><ArrowRight size={18} /></span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="section journey-section" id="journey">
        <div className="container">
          <div className="journey-heading">
            <div>
              <span className="eyebrow">04 · OUR JOURNEY</span>
              <h2>Từng bước nhỏ.<br />Một hành trình <em>có thật.</em></h2>
            </div>
            <p>Từ khởi động đến đo lường, mỗi cột mốc là một lần đội thử, học và tiến gần hơn đến cách làm kinh doanh số chuyên nghiệp.</p>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.08 }}
              >
                <span className={'timeline-node ' + item.state}>{String(index + 1).padStart(2, '0')}</span>
                <div><small>{item.state === 'in-progress' ? 'ĐANG TRIỂN KHAI' : 'KẾ HOẠCH 2026'}</small><h3>{item.label}</h3><p>{item.detail}</p></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-shell">
          <div className="closing-art" aria-hidden="true">
            <span className="closing-orbit closing-orbit-one" />
            <span className="closing-orbit closing-orbit-two" />
            <motion.img
              className="closing-product closing-product-main"
              src="/assets/products/50.webp"
              alt=""
              loading="lazy"
              animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [-5, -3, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              className="closing-product closing-product-top"
              src="/assets/products/62.webp"
              alt=""
              loading="lazy"
              animate={reduceMotion ? {} : { y: [0, 8, 0], rotate: [7, 5, 7] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              className="closing-product closing-product-bottom"
              src="/assets/products/76.webp"
              alt=""
              loading="lazy"
              animate={reduceMotion ? {} : { y: [0, -7, 0], rotate: [4, 6, 4] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="closing-badge"><Sparkles size={18} /> TADORA · 2026</div>
          </div>
          <div className="closing-copy">
            <span className="eyebrow">FROM IDEA TO IMPACT</span>
            <h2>Ý tưởng nhỏ.<br /><em>Dấu ấn thật.</em></h2>
            <p>
              Mỗi sản phẩm là một cơ hội để đội ngũ TADORA thử nghiệm, học hỏi
              và biến kiến thức trên giảng đường thành trải nghiệm kinh doanh số thực tế.
            </p>
            <div className="closing-actions">
              <button className="button button-light" onClick={() => scrollTo('products')}>
                Xem bộ sưu tập <ArrowRight size={18} />
              </button>
              <button className="closing-top-link" onClick={() => scrollTo('top')}>
                Trở về đầu trang
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand"><LogoLockup /><p>Một hành trình kinh doanh số của sinh viên PTIT.</p></div>
          <div><span>CUỘC THI</span><strong>{site.competition}</strong><p>{site.track}</p></div>
          <div><span>WEBSITE</span><strong>{site.domain}</strong><p>From Ideas to Digital Impact.</p></div>
          <a className="footer-link" href="#products">Khám phá sản phẩm <ExternalLink size={18} /></a>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 TADORA</span>
          <p>TADORA là đội dự thi độc lập, không phải website chính thức của MAGIC hoặc Ban Tổ chức DBC.</p>
        </div>
      </footer>

      <Modal open={!!selectedMember} title="Thông tin thành viên" onClose={() => setSelectedMember(null)}>
        {selectedMember && (
          <div className="member-modal">
            <img
              src={selectedMember.image}
              alt={'Chân dung ' + selectedMember.name}
              style={{ objectPosition: selectedMember.imagePosition }}
            />
            <div>
              <span className="eyebrow">THÀNH VIÊN TADORA</span>
              <h2>{selectedMember.name}</h2>
              <p>{selectedMember.role}</p>
              <dl>
                <div><dt>Mã sinh viên</dt><dd>{selectedMember.studentId}</dd></div>
                <div><dt>Lớp</dt><dd>{selectedMember.className}</dd></div>
                <div><dt>Khoa</dt><dd>{selectedMember.faculty}</dd></div>
                <div><dt>Trường</dt><dd>{site.school}</dd></div>
              </dl>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!selectedProduct} title="Bộ ảnh sản phẩm" onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="product-modal">
            <div className="product-modal-heading">
              <span className="eyebrow">{selectedProduct.category} · {selectedProduct.code}</span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
            </div>
            <div className="product-gallery">
              {selectedProduct.gallery.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={selectedProduct.name + ' — hình ' + (index + 1)}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}

export default App
