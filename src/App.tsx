import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Leaf,
  Menu,
  School,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogoLockup } from "./components/LogoLockup";
import { NavLogoMotion } from "./components/NavLogoMotion";
import { HeroProductVideo } from "./components/HeroProductVideo";
import { ChannelLinks } from "./components/ChannelLinks";
import { Modal } from "./components/Modal";
import { ProductCardMedia } from "./components/ProductCardMedia";
import { SectionHeading } from "./components/SectionHeading";
import { VideoPlayer } from "./components/VideoPlayer";
import { products, productCategories, type Product } from "./data/products";
import { navItems, site } from "./data/site";
import { team, type Member } from "./data/team";
import { timeline } from "./data/timeline";
import {
  imageVariant,
  markLazyImageLoaded,
  responsiveImage,
} from "./lib/images";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const journeyIcons = [Sparkles, School, Target, Zap, CalendarDays] as const;

const introFacts = [
  {
    Icon: School,
    label: "Đơn vị",
    value: "PTIT",
    detail: "Học viện Công nghệ Bưu chính Viễn thông",
    accent: false,
  },
  {
    Icon: Target,
    label: "Nội dung dự thi",
    value: "01",
    detail: "Bán hàng Online",
    accent: false,
  },
  {
    Icon: CalendarDays,
    label: "Hành trình",
    value: "2026",
    detail: "Từ 01.10 đến 05.12",
    accent: false,
  },
  {
    Icon: Zap,
    label: "Tinh thần",
    value: "Make it real.",
    detail: "Từ ý tưởng đến tác động số",
    accent: true,
  },
] as const;

function App() {
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("Tất cả");
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const heroPointerX = useMotionValue(0);
  const heroPointerY = useMotionValue(0);
  const heroX = useSpring(heroPointerX, { stiffness: 110, damping: 22 });
  const heroY = useSpring(heroPointerY, { stiffness: 110, damping: 22 });
  const heroLeftX = useTransform(heroX, (value) => value * -0.65);
  const heroLeftY = useTransform(heroY, (value) => value * 0.65);
  const heroRightX = useTransform(heroX, (value) => value * 0.78);
  const heroRightY = useTransform(heroY, (value) => value * -0.78);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 45%"],
  });

  const filteredProducts = useMemo(
    () =>
      category === "Tất cả"
        ? products
        : products.filter((product) => product.category === category),
    [category],
  );
  const heroProduct = useMemo(
    () => products.find((product) => product.code === "B-26"),
    [],
  );

  const moveHero = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      reduceMotion ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    heroPointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
    heroPointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 24);
  };

  const resetHero = () => {
    heroPointerX.set(0);
    heroPointerY.set(0);
  };

  useEffect(() => {
    let frame = 0;

    const syncActiveSection = () => {
      frame = 0;
      const marker = window.scrollY + window.innerHeight * 0.38;
      const sections = navItems
        .map(({ id }) => ({ id, element: document.getElementById(id) }))
        .filter(
          (section): section is { id: string; element: HTMLElement } =>
            !!section.element,
        );

      let currentId = sections[0]?.id ?? "about";
      sections.forEach(({ id, element }) => {
        if (element.offsetTop <= marker) currentId = id;
      });

      const atPageEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;
      if (atPageEnd && sections.length)
        currentId = sections[sections.length - 1].id;
      setActiveSection(currentId);
    };

    const scheduleSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncActiveSection);
    };

    syncActiveSection();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  return (
    <main>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollProgress }}
        aria-hidden="true"
      />
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="TADORA — Trang chủ">
          <NavLogoMotion />
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? "active" : ""}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="nav-cta" onClick={() => scrollTo("products")}>
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
                <button
                  key={item.id}
                  className={activeSection === item.id ? "active" : ""}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                  <ChevronRight size={18} />
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
              <span>
                <Sparkles size={15} /> DBC 2026
              </span>
              <span className="hero-kicker-line" />
              <span>Bán hàng online</span>
            </motion.div>
            <motion.p className="hero-overline" variants={fadeUp}>
              TADORA · Gian hàng chính hãng
            </motion.p>
            <motion.h1 variants={fadeUp}>
              Tiện ích trong tay.
              <br />
              <em>Chăm mình mỗi ngày.</em>
            </motion.h1>
            <motion.p className="hero-slogan" variants={fadeUp}>
              {site.message}
            </motion.p>
            <motion.p className="hero-lead" variants={fadeUp}>
              Hành trình kinh doanh số của sinh viên PTIT — nơi ý tưởng trẻ gặp
              những sản phẩm tiện ích được kể bằng một ngôn ngữ gần gũi, tươi
              mới.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <button
                className="button button-dark"
                onClick={() => scrollTo("products")}
              >
                Xem bộ sưu tập <ArrowDown size={18} />
              </button>
              <button className="text-link" onClick={() => scrollTo("team")}>
                Gặp đội ngũ <Users size={17} />
              </button>
            </motion.div>
          </motion.div>

          <div
            className="hero-visual"
            aria-label="Sản phẩm nổi bật của TADORA"
            onPointerMove={moveHero}
            onPointerLeave={resetHero}
          >
            <motion.div
              className="hero-sun"
              animate={
                reduceMotion ? {} : { scale: [1, 1.05, 1], rotate: [0, 3, 0] }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.figure
              className="hero-card hero-card-main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              style={{ x: heroX, y: heroY }}
            >
              <div className="hero-phone-island" aria-hidden="true" />
              <div className="hero-phone-screen">
                <img
                  className="hero-phone-poster"
                  src={
                    responsiveImage("/assets/products/78.webp", "product").src
                  }
                  srcSet={
                    responsiveImage("/assets/products/78.webp", "product")
                      .srcSet
                  }
                  sizes="(min-width: 1281px) 340px, (min-width: 1051px) 310px, (min-width: 721px) 320px, 240px"
                  alt="Bàn chải điện Magic B26"
                  width="720"
                  height="1280"
                  loading="eager"
                />
                <HeroProductVideo
                  product={heroProduct}
                  poster={imageVariant("/assets/products/78.webp", 960)}
                />
              </div>
            </motion.figure>
            <motion.figure
              className="hero-card hero-card-left"
              style={{ x: heroLeftX, y: heroLeftY }}
            >
              <img
                src={imageVariant("/assets/products/01.webp", 480)}
                srcSet={
                  responsiveImage("/assets/products/01.webp", "product").srcSet
                }
                sizes="210px"
                alt="Bình giữ nhiệt Magic MPI-480"
                width="480"
                height="480"
                loading="eager"
              />
            </motion.figure>
            <motion.figure
              className="hero-card hero-card-right"
              style={{ x: heroRightX, y: heroRightY }}
            >
              <img
                src={imageVariant("/assets/products/80.webp", 480)}
                srcSet={
                  responsiveImage("/assets/products/80.webp", "product").srcSet
                }
                sizes="220px"
                alt="Bàn chải điện Magic B26"
                width="480"
                height="480"
                loading="eager"
              />
            </motion.figure>
            <motion.div
              className="hero-seal"
              style={{ x: heroLeftX, y: heroLeftY }}
            >
              <Leaf />
              <span>
                Curated
                <br />
                for daily life
              </span>
            </motion.div>
          </div>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <div>
            <span>SMART LIVING</span>
            <i>✦</i>
            <span>YOUNG ENERGY</span>
            <i>✦</i>
            <span>DIGITAL COMMERCE</span>
            <i>✦</i>
            <span>TADORA 2026</span>
            <i>✦</i>
            <span>SMART LIVING</span>
            <i>✦</i>
            <span>YOUNG ENERGY</span>
            <i>✦</i>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="about">
        <span className="intro-ambient intro-ambient-one" aria-hidden="true" />
        <span className="intro-ambient intro-ambient-two" aria-hidden="true" />
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
              <h2>
                Một gian hàng.
                <br />
                Một hành trình <em>rất trẻ.</em>
              </h2>
              <div className="intro-sticky-foot">
                <Sparkles />
                <span>PTIT · DBC 2026</span>
              </div>
            </motion.div>
            <motion.div
              className="intro-content"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
            >
              <motion.p
                className="intro-big"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                TADORA là đội sinh viên Học viện Công nghệ Bưu chính Viễn thông
                tham gia Cuộc thi Sinh viên Kinh doanh số 2026.
              </motion.p>
              <p>
                Chúng mình đưa kiến thức trên giảng đường vào trải nghiệm kinh
                doanh thực tế: từ nghiên cứu sản phẩm, xây dựng nội dung đến vận
                hành một hệ sinh thái bán hàng số.
              </p>
              <div className="fact-grid">
                {introFacts.map(
                  ({ Icon, label, value, detail, ...fact }, index) => (
                    <motion.article
                      key={label}
                      className={fact.accent ? "fact-accent" : ""}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              y: 24,
                              rotate: index % 2 ? 1.5 : -1.5,
                            }
                      }
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { y: -9, rotate: index % 2 ? 1 : -1 }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    >
                      <span className="fact-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="fact-icon">
                        <Icon />
                      </span>
                      <span className="fact-label">{label}</span>
                      <strong>{value}</strong>
                      <small>{detail}</small>
                      <span className="fact-shine" aria-hidden="true" />
                    </motion.article>
                  ),
                )}
              </div>
            </motion.div>
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
                className={category === item ? "active" : ""}
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
                  className={
                    "product-card " +
                    (index === 0 ? "product-card-featured" : "")
                  }
                  onClick={() => setSelectedProduct(product)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <ProductCardMedia product={product} featured={index === 0} />
                  <div className="product-copy">
                    <small>{product.category}</small>
                    <h3>{product.name.replace("Magic ", "")}</h3>
                    <p>{product.description}</p>
                    <span className="product-arrow">
                      <ArrowRight size={19} />
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="story-band">
        <span className="story-orb story-orb-one" aria-hidden="true" />
        <span className="story-orb story-orb-two" aria-hidden="true" />
        <div className="container story-band-grid">
          <motion.div
            className="story-copy"
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <span className="eyebrow">KHÔNG CHỈ LÀ MỘT GIAN HÀNG</span>
            <h2>
              Học bằng cách
              <br />
              <em>thực sự bắt tay làm.</em>
            </h2>
            <p className="story-lead">
              Mỗi bước đều được thử nghiệm bằng công việc thật, dữ liệu thật và
              những lần điều chỉnh thật.
            </p>
            <div className="story-signal">
              <span />
              <strong>LEARN · BUILD · IMPROVE</strong>
            </div>
          </motion.div>
          <div className="story-steps">
            {[
              ["01", "Research", "Hiểu sản phẩm, thị trường và khách hàng."],
              [
                "02",
                "Strategy",
                "Định hình nội dung và trải nghiệm thương hiệu.",
              ],
              ["03", "Execution", "Triển khai kênh và vận hành bán hàng số."],
              ["04", "Measure", "Quan sát dữ liệu, học hỏi và cải tiến."],
            ].map(([number, title, description], index) => (
              <motion.article
                key={number}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                whileHover={reduceMotion ? undefined : { x: 10, scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <span className="story-step-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className="story-step-arrow">
                  <ArrowRight />
                </span>
              </motion.article>
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
                className={"member-card member-card-" + (index + 1)}
                onClick={() => setSelectedMember(member)}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
              >
                <img
                  src={responsiveImage(member.image, "team").src}
                  srcSet={responsiveImage(member.image, "team").srcSet}
                  sizes="(min-width: 721px) 58vw, calc(100vw - 28px)"
                  alt={"Chân dung " + member.name}
                  width={member.imageWidth}
                  height={member.imageHeight}
                  loading="lazy"
                  className="lazy-image"
                  onLoad={markLazyImageLoaded}
                  style={{ objectPosition: member.imagePosition }}
                />
                <div className="member-shade" />
                <span className="member-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="member-info">
                  <small>{member.role}</small>
                  <h3>{member.name}</h3>
                  <p>{member.className}</p>
                </div>
                <span className="member-open">
                  <ArrowRight size={18} />
                </span>
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
              <h2>
                Từng bước nhỏ.
                <br />
                Một hành trình <em>có thật.</em>
              </h2>
            </div>
            <p>
              Từ khởi động đến đo lường, mỗi cột mốc là một lần đội thử, học và
              tiến gần hơn đến cách làm kinh doanh số chuyên nghiệp.
            </p>
          </div>
          <motion.div
            className="journey-live"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <div className="journey-live-index" aria-hidden="true">
              <span>BƯỚC</span>
              <strong>{String(activeJourneyStep + 1).padStart(2, "0")}</strong>
              <small>/ {String(timeline.length).padStart(2, "0")}</small>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="journey-live-copy"
                key={timeline[activeJourneyStep].label}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                aria-live="polite"
              >
                <small>
                  {timeline[activeJourneyStep].state === "in-progress"
                    ? "ĐANG TRIỂN KHAI"
                    : "KẾ HOẠCH 2026"}
                </small>
                <h3>{timeline[activeJourneyStep].label}</h3>
                <p>{timeline[activeJourneyStep].detail}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div className="timeline" ref={timelineRef}>
            <motion.span
              className="timeline-progress"
              style={{ scaleY: timelineScroll }}
              aria-hidden="true"
            />
            {timeline.map((item, index) => {
              const JourneyIcon = journeyIcons[index];
              const isActive = activeJourneyStep === index;
              return (
                <motion.article
                  key={item.label}
                  className={`${isActive ? "is-active" : ""} ${index < activeJourneyStep ? "is-complete" : ""}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.07 }}
                  onPointerEnter={() => setActiveJourneyStep(index)}
                >
                  <motion.button
                    type="button"
                    className="timeline-step"
                    aria-pressed={isActive}
                    onClick={() => setActiveJourneyStep(index)}
                    onFocus={() => setActiveJourneyStep(index)}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  >
                    <span className={"timeline-node " + item.state}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="timeline-card">
                      <span className="timeline-card-top">
                        <small>
                          {item.state === "in-progress"
                            ? "ĐANG TRIỂN KHAI"
                            : "KẾ HOẠCH 2026"}
                        </small>
                        <span className="timeline-card-icon">
                          <JourneyIcon />
                        </span>
                      </span>
                      <strong>{item.label}</strong>
                      <span className="timeline-card-detail">
                        {item.detail}
                      </span>
                      <span className="timeline-card-cta">
                        Khám phá bước này <ArrowRight />
                      </span>
                    </span>
                  </motion.button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-shell">
          <div className="closing-art" aria-hidden="true">
            <span className="closing-orbit closing-orbit-one" />
            <span className="closing-orbit closing-orbit-two" />
            <motion.img
              className="closing-product closing-product-main lazy-image"
              src={responsiveImage("/assets/products/50.webp", "product").src}
              srcSet={
                responsiveImage("/assets/products/50.webp", "product").srcSet
              }
              sizes="(min-width: 721px) 360px, 225px"
              width="960"
              height="960"
              alt=""
              loading="lazy"
              onLoad={markLazyImageLoaded}
              animate={
                reduceMotion ? {} : { y: [0, -10, 0], rotate: [-5, -3, -5] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              className="closing-product closing-product-top lazy-image"
              src={responsiveImage("/assets/products/62.webp", "product").src}
              srcSet={
                responsiveImage("/assets/products/62.webp", "product").srcSet
              }
              sizes="(min-width: 721px) 225px, 135px"
              width="960"
              height="960"
              alt=""
              loading="lazy"
              onLoad={markLazyImageLoaded}
              animate={reduceMotion ? {} : { y: [0, 8, 0], rotate: [7, 5, 7] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              className="closing-product closing-product-bottom lazy-image"
              src={responsiveImage("/assets/products/76.webp", "product").src}
              srcSet={
                responsiveImage("/assets/products/76.webp", "product").srcSet
              }
              sizes="(min-width: 721px) 210px, 130px"
              width="960"
              height="960"
              alt=""
              loading="lazy"
              onLoad={markLazyImageLoaded}
              animate={reduceMotion ? {} : { y: [0, -7, 0], rotate: [4, 6, 4] }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="closing-badge">
              <Sparkles size={18} /> TADORA · 2026
            </div>
          </div>
          <div className="closing-copy">
            <span className="eyebrow">FROM IDEA TO IMPACT</span>
            <h2>
              Ý tưởng nhỏ.
              <br />
              <em>Dấu ấn thật.</em>
            </h2>
            <p>
              Mỗi sản phẩm là một cơ hội để đội ngũ TADORA thử nghiệm, học hỏi
              và biến kiến thức trên giảng đường thành trải nghiệm kinh doanh số
              thực tế.
            </p>
            <div className="closing-actions">
              <button
                className="button button-light"
                onClick={() => scrollTo("products")}
              >
                Xem bộ sưu tập <ArrowRight size={18} />
              </button>
              <button
                className="closing-top-link"
                onClick={() => scrollTo("top")}
              >
                Trở về đầu trang
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer id="about-us">
        <motion.div
          className="container footer-panel"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="footer-grid">
            <div className="footer-brand">
              <LogoLockup />
              <p>Một hành trình kinh doanh số của sinh viên PTIT.</p>
              <strong>{site.message}</strong>
            </div>
            <div className="footer-info">
              <span>VỀ CHÚNG TÔI</span>
              <strong>Sinh viên PTIT · DBC 2026</strong>
              <p>{site.subMessage}</p>
            </div>
            <div className="footer-info">
              <span>CUỘC THI</span>
              <strong>{site.competition}</strong>
              <p>{site.track}</p>
            </div>
            <div className="footer-visit">
              <span>WEBSITE</span>
              <strong>{site.domain}</strong>
              <button
                className="footer-link"
                onClick={() => scrollTo("products")}
              >
                Khám phá sản phẩm <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="footer-socials">
            <div>
              <span>KẾT NỐI VỚI TADORA</span>
              <p>Mua sắm và theo dõi hành trình của chúng mình.</p>
            </div>
            <ChannelLinks compact className="footer-channels" />
          </div>

          <div className="footer-bottom">
            <span>© 2026 TADORA</span>
            <button onClick={() => scrollTo("top")}>Trở về đầu trang</button>
            <p>
              TADORA là đội dự thi độc lập, không phải website chính thức của
              MAGIC hoặc Ban Tổ chức DBC.
            </p>
          </div>
        </motion.div>
      </footer>

      <Modal
        open={!!selectedMember}
        title="Thông tin thành viên"
        onClose={() => setSelectedMember(null)}
      >
        {selectedMember && (
          <div className="member-modal">
            <img
              src={responsiveImage(selectedMember.image, "team").src}
              srcSet={responsiveImage(selectedMember.image, "team").srcSet}
              sizes="(min-width: 721px) 420px, calc(100vw - 64px)"
              alt={"Chân dung " + selectedMember.name}
              width={selectedMember.imageWidth}
              height={selectedMember.imageHeight}
              style={{ objectPosition: selectedMember.imagePosition }}
            />
            <div>
              <span className="eyebrow">THÀNH VIÊN TADORA</span>
              <h2>{selectedMember.name}</h2>
              <p>{selectedMember.role}</p>
              <dl>
                <div>
                  <dt>Mã sinh viên</dt>
                  <dd>{selectedMember.studentId}</dd>
                </div>
                <div>
                  <dt>Lớp</dt>
                  <dd>{selectedMember.className}</dd>
                </div>
                <div>
                  <dt>Khoa</dt>
                  <dd>{selectedMember.faculty}</dd>
                </div>
                <div>
                  <dt>Trường</dt>
                  <dd>{site.school}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!selectedProduct}
        title="Ảnh & video sản phẩm"
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <div
            className={`product-modal ${selectedProduct.video ? "product-modal--video" : ""}`}
          >
            {selectedProduct.video && (
              <div className="product-modal-video">
                <VideoPlayer
                  src={selectedProduct.video.src}
                  poster={selectedProduct.video.poster}
                  ratio="9/16"
                  loop
                  autoPlayInView
                />
              </div>
            )}
            <div className="product-modal-content">
              <div className="product-modal-heading">
                <span className="eyebrow">
                  {selectedProduct.category} · {selectedProduct.code}
                </span>
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.description}</p>
                <ChannelLinks compact />
              </div>
              <div className="product-gallery">
                {selectedProduct.gallery.map((image, index) => (
                  <img
                    key={image}
                    src={imageVariant(image, 960)}
                    alt={selectedProduct.name + " — hình " + (index + 1)}
                    loading={index < 2 ? "eager" : "lazy"}
                    className={index < 2 ? undefined : "lazy-image"}
                    onLoad={index < 2 ? undefined : markLazyImageLoaded}
                    decoding="async"
                    width="960"
                    height="960"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

export default App;
