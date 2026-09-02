import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Code2, Globe2, Mail, MapPin,
  Menu, Moon, Music2, Pause, Play, Send, Sparkles, Sun, Users, Volume2, X, Zap,
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import VisitorBox from '../components/VisitorBox';
import ProjectReactions from '../components/ProjectReactions';
import BugSmasher from '../components/BugSmasher';
import StickyBoard from '../components/StickyBoard';
import HiddenTerminal from '../components/HiddenTerminal';
import SpotlightMode from '../components/SpotlightMode';
import PhysicsSkillCloud from '../components/PhysicsSkillCloud';

const copy = {
  vi: {
    nav: { home: 'Trang chủ', about: 'Về mình', projects: 'Dự án', blog: 'Bài viết', stack: 'Công nghệ', contact: 'Liên hệ' },
    controls: { theme: 'Đổi giao diện', language: 'Đổi ngôn ngữ', music: 'Nhạc nền', menu: 'Mở menu' },
    hero: {
      status: 'Sẵn sàng cho cơ hội mới', eyebrow: 'XIN CHÀO, MÌNH LÀ', name: 'LỮ HẢI ĐĂNG', role: 'FULL-STACK & IOT DEVELOPER',
      intro: 'Mình biến ý tưởng thành những sản phẩm số gọn gàng, dễ dùng — từ giao diện web đến hệ thống IoT thời gian thực.',
      projects: 'Xem dự án', contact: 'Nói chuyện với mình', scroll: 'CUỘN ĐỂ KHÁM PHÁ',
      stats: [['02+', 'Dự án nổi bật'], ['16+', 'Công nghệ'], ['100%', 'Tinh thần học hỏi']],
      cardTitle: 'PLAYER PROFILE', location: 'Vĩnh Long, Việt Nam', level: 'LV. 22', class: 'FULL-STACK DEV',
    },
    ticker: ['REACT', 'NODE.JS', 'TYPESCRIPT', 'IOT', 'FIREBASE', 'DOCKER', 'UI/UX'],
    about: {
      tag: '01 / VỀ MÌNH', title: 'CODE TỐT KHÔNG CHỈ CHẠY ĐƯỢC.', lead: 'Nó cần rõ ràng, có chủ đích và giải quyết đúng vấn đề.',
      body: 'Mình là một developer đến từ Vĩnh Long, tập trung vào web full-stack và IoT. Mình thích kết nối phần mềm, dữ liệu và phần cứng thành trải nghiệm liền mạch, dễ hiểu cho người dùng.',
      download: 'Yêu cầu CV', journey: 'HÀNH TRÌNH', journeyText: 'Học, xây dựng, thử nghiệm và luôn cải thiện qua từng phiên bản.',
      values: [['01', 'RÕ RÀNG', 'Kiến trúc và giao diện dễ hiểu, dễ tiếp tục phát triển.'], ['02', 'HỮU ÍCH', 'Ưu tiên bài toán thật và trải nghiệm thật của người dùng.'], ['03', 'BỀN VỮNG', 'Cân bằng hiệu năng, bảo trì và khả năng mở rộng.']],
    },
    projects: {
      tag: '02 / DỰ ÁN', title: 'MỘT VÀI THỨ MÌNH ĐÃ XÂY.', subtitle: 'Dự án thật, bài toán thật và rất nhiều lần commit.', view: 'Mở dự án', source: 'Mã nguồn', featured: 'NỔI BẬT',
      items: [
        { no: '01', title: 'SYSTEM FARM IOT', type: 'FULL-STACK · IOT', desc: 'Hệ thống nông trại thông minh để giám sát cảm biến và điều khiển thiết bị thời gian thực qua MQTT, Firebase, web và mobile.', tags: ['React', 'Firebase', 'HiveMQ', 'ESP32'], href: 'https://github.com/HaiDang1304/System-Farm-IoT', art: 'farm' },
        { no: '02', title: 'TEZ MOVIES', type: 'FRONTEND · WEB APP', desc: 'Ứng dụng khám phá phim với giao diện hiện đại, tìm kiếm nhanh và trải nghiệm duyệt nội dung mượt mà trên mọi thiết bị.', tags: ['React', 'REST API', 'Vercel'], href: 'https://tez-movies.vercel.app/', art: 'movie' },
      ],
    },
    blog: { tag: '03 / BÀI VIẾT', title: 'GHI CHÚ TỪ QUÁ TRÌNH XÂY DỰNG.', subtitle: 'Những điều mình học được về code, sản phẩm và công nghệ.', empty: 'Chưa có bài viết nào. Bài viết mới từ dashboard sẽ xuất hiện tại đây.', read: 'Đọc bài viết' },
    stack: { tag: '04 / CÔNG NGHỆ', title: 'BỘ CÔNG CỤ CỦA MÌNH.', subtitle: 'Chọn đúng công cụ cho từng bài toán — không chạy theo mọi xu hướng.', groups: [['FRONTEND', ['React', 'TypeScript', 'Tailwind', 'HTML / CSS']], ['BACKEND', ['Node.js', 'Express', 'REST API', 'MQTT']], ['DATA & CLOUD', ['Firebase', 'MySQL', 'PostgreSQL', 'Google Cloud']], ['TOOLS', ['Git', 'Docker', 'Figma', 'Linux']]] },
    process: { tag: '04 / CÁCH MÌNH LÀM VIỆC', title: 'TỪ Ý TƯỞNG ĐẾN SẢN PHẨM.', items: [['01', 'HIỂU', 'Làm rõ mục tiêu, người dùng và giới hạn.'], ['02', 'THIẾT KẾ', 'Tạo luồng trải nghiệm và kiến trúc hợp lý.'], ['03', 'XÂY DỰNG', 'Code theo từng phần nhỏ, kiểm thử liên tục.'], ['04', 'HOÀN THIỆN', 'Đo lường, tối ưu và bàn giao rõ ràng.']] },
    contact: {
      tag: '05 / LIÊN HỆ', title: 'CÓ Ý TƯỞNG HAY?', highlight: 'CÙNG XÂY NÓ.', body: 'Mình luôn sẵn sàng trao đổi về dự án, cơ hội làm việc hoặc một ý tưởng thú vị. Gửi mình vài dòng nhé!',
      emailLabel: 'EMAIL CHO MÌNH', locationLabel: 'ĐANG Ở', formTitle: 'NEW MESSAGE', name: 'Tên của bạn', email: 'Email', subject: 'Chủ đề', message: 'Kể mình nghe về ý tưởng...', send: 'Gửi tin nhắn', sending: 'Đang lưu...', success: 'Đã lưu tin nhắn vào hệ thống. Mình sẽ phản hồi sớm!', error: 'Vui lòng điền đầy đủ các trường.', serverError: 'Không thể kết nối máy chủ. Hãy thử lại sau.',
    },
    footer: 'ĐƯỢC THIẾT KẾ & CODE VỚI', rights: '© 2026 LỮ HẢI ĐĂNG', back: 'LÊN ĐẦU TRANG',
  },
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', blog: 'Journal', stack: 'Stack', contact: 'Contact' },
    controls: { theme: 'Switch theme', language: 'Switch language', music: 'Background music', menu: 'Open menu' },
    hero: {
      status: 'Available for new opportunities', eyebrow: "HELLO, I'M", name: 'LU HAI DANG', role: 'FULL-STACK & IOT DEVELOPER',
      intro: 'I turn ideas into thoughtful digital products — from polished web interfaces to real-time IoT systems.', projects: 'View projects', contact: "Let's talk", scroll: 'SCROLL TO EXPLORE',
      stats: [['02+', 'Featured projects'], ['16+', 'Technologies'], ['100%', 'Curious mindset']], cardTitle: 'PLAYER PROFILE', location: 'Vinh Long, Vietnam', level: 'LV. 22', class: 'FULL-STACK DEV',
    },
    ticker: ['REACT', 'NODE.JS', 'TYPESCRIPT', 'IOT', 'FIREBASE', 'DOCKER', 'UI/UX'],
    about: {
      tag: '01 / ABOUT', title: 'GOOD CODE DOES MORE THAN RUN.', lead: 'It should be clear, intentional, and solve the right problem.',
      body: 'I am a developer based in Vinh Long, focused on full-stack web and IoT. I enjoy connecting software, data, and hardware into seamless experiences that feel simple to use.',
      download: 'Request CV', journey: 'THE JOURNEY', journeyText: 'Learning, building, testing, and improving with every release.',
      values: [['01', 'CLARITY', 'Architecture and interfaces that are easy to understand and extend.'], ['02', 'USEFULNESS', 'Real problems and real user experiences come first.'], ['03', 'SUSTAINABILITY', 'Performance, maintainability, and growth in balance.']],
    },
    projects: {
      tag: '02 / PROJECTS', title: "A FEW THINGS I'VE BUILT.", subtitle: 'Real products, real problems, and plenty of commits.', view: 'Open project', source: 'Source code', featured: 'FEATURED',
      items: [
        { no: '01', title: 'SYSTEM FARM IOT', type: 'FULL-STACK · IOT', desc: 'A smart-farm system for monitoring sensors and controlling devices in real time across MQTT, Firebase, web, and mobile.', tags: ['React', 'Firebase', 'HiveMQ', 'ESP32'], href: 'https://github.com/HaiDang1304/System-Farm-IoT', art: 'farm' },
        { no: '02', title: 'TEZ MOVIES', type: 'FRONTEND · WEB APP', desc: 'A movie discovery app with a modern interface, fast search, and a smooth browsing experience on every device.', tags: ['React', 'REST API', 'Vercel'], href: 'https://tez-movies.vercel.app/', art: 'movie' },
      ],
    },
    blog: { tag: '03 / JOURNAL', title: 'NOTES FROM THE BUILD.', subtitle: 'Things I learn about code, products, and technology.', empty: 'No articles yet. New posts from the dashboard will appear here.', read: 'Read article' },
    stack: { tag: '04 / STACK', title: 'MY TOOLKIT.', subtitle: 'The right tool for each problem — not every trend.', groups: [['FRONTEND', ['React', 'TypeScript', 'Tailwind', 'HTML / CSS']], ['BACKEND', ['Node.js', 'Express', 'REST API', 'MQTT']], ['DATA & CLOUD', ['Firebase', 'MySQL', 'PostgreSQL', 'Google Cloud']], ['TOOLS', ['Git', 'Docker', 'Figma', 'Linux']]] },
    process: { tag: '04 / HOW I WORK', title: 'FROM IDEA TO PRODUCT.', items: [['01', 'UNDERSTAND', 'Clarify the goal, users, and constraints.'], ['02', 'DESIGN', 'Shape the experience and a sound architecture.'], ['03', 'BUILD', 'Ship in small pieces and test continuously.'], ['04', 'REFINE', 'Measure, optimize, and hand off clearly.']] },
    contact: { tag: '05 / CONTACT', title: 'GOT A GOOD IDEA?', highlight: "LET'S BUILD IT.", body: "I'm always open to projects, opportunities, or an interesting idea. Drop me a line!", emailLabel: 'EMAIL ME', locationLabel: 'BASED IN', formTitle: 'NEW MESSAGE', name: 'Your name', email: 'Email address', subject: 'Subject', message: 'Tell me about your idea...', send: 'Send message', sending: 'Saving...', success: 'Your message is saved. I will get back to you soon!', error: 'Please complete all fields.', serverError: 'Could not connect to the server. Please try again.' },
    footer: 'DESIGNED & CODED WITH', rights: '© 2026 LU HAI DANG', back: 'BACK TO TOP',
  },
};

const navIds = ['home', 'about', 'projects', 'blog', 'stack', 'contact'];

function useChiptune() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.16);
  const engine = useRef({ context: null, timer: null, step: 0 });
  useEffect(() => { if (engine.current.context) engine.current.context._portfolioVolume = volume; }, [volume]);
  useEffect(() => () => { window.clearInterval(engine.current.timer); engine.current.context?.close(); }, []);
  const toggle = async () => {
    if (playing) { window.clearInterval(engine.current.timer); engine.current.timer = null; setPlaying(false); return; }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!engine.current.context || engine.current.context.state === 'closed') engine.current.context = new AudioContext();
    const ctx = engine.current.context; ctx._portfolioVolume = volume; await ctx.resume();
    const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23, 329.63, 392, 493.88, 392, 293.66, 349.23, 440, 523.25];
    const bass = [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 146.83, 146.83];
    const tick = () => {
      const now = ctx.currentTime;
      const note = (frequency, gainValue, duration, type = 'square') => {
        const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.type = type; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(Math.max(0.001, ctx._portfolioVolume * gainValue), now + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        oscillator.connect(gain).connect(ctx.destination); oscillator.start(now); oscillator.stop(now + duration + 0.02);
      };
      note(melody[engine.current.step % melody.length], 0.45, 0.16);
      if (engine.current.step % 2 === 0) note(bass[Math.floor(engine.current.step / 2) % bass.length], 0.3, 0.3, 'triangle');
      engine.current.step += 1;
    };
    tick(); engine.current.timer = window.setInterval(tick, 220); setPlaying(true);
  };
  return { playing, volume, setVolume, toggle };
}

function PixelArt({ type }) {
  return <div className={`project-art project-art--${type}`} aria-hidden="true"><div className="project-art__bar"><i /><i /><i /></div>{type === 'farm' ? <div className="farm-ui"><div className="farm-ui__sun" /><div className="farm-ui__cloud" /><div className="farm-ui__field"><i /><i /><i /><i /><i /></div><div className="farm-ui__panel"><span>28°C</span><span>68%</span><b>ONLINE</b></div></div> : <div className="movie-ui"><div className="movie-ui__poster"><span>TEZ</span><b>MOVIES</b><i>▶</i></div><div className="movie-ui__rail"><i /><i /><i /><i /></div></div>}</div>;
}

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem('portfolio-lang') || 'vi');
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [content, setContent] = useState({ profile: null, projects: null, posts: [] });
  const { playing, volume, setVolume, toggle } = useChiptune();
  const t = copy[lang];
  const profile = content.profile;
  const displayName = profile?.[lang === 'vi' ? 'name_vi' : 'name_en'] || t.hero.name;
  const displayLocation = profile?.[lang === 'vi' ? 'location_vi' : 'location_en'] || t.hero.location;
  const projectItems = content.projects?.map((project, index) => ({
    no: String(index + 1).padStart(2, '0'), title: project.title, type: project.category,
    desc: project[lang === 'vi' ? 'description_vi' : 'description_en'], tags: project.tags || [],
    href: project.project_url || project.source_url || '#', art: index % 2 ? 'movie' : 'farm', featured: project.featured,
  })) || t.projects.items;
  const socialLinks = [
    { name: 'GitHub', href: profile?.github || 'https://github.com/HaiDang1304', icon: <Code2 size={17} /> },
    { name: 'LinkedIn', href: profile?.linkedin || '#', icon: <BriefcaseBusiness size={17} /> },
    { name: 'Facebook', href: profile?.facebook || '#', icon: <Users size={17} /> },
  ];

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('portfolio-theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.lang = lang; localStorage.setItem('portfolio-lang', lang); }, [lang]);
  useEffect(() => {
    Promise.all([apiRequest('/profile'), apiRequest('/projects'), apiRequest('/posts')])
      .then(([nextProfile, projects, posts]) => setContent({ profile: nextProfile, projects, posts }))
      .catch(() => { /* Portfolio vẫn hiển thị dữ liệu dự phòng khi API đang tắt. */ });
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); if (navIds.includes(entry.target.id)) setActive(entry.target.id); } }), { threshold: 0.08, rootMargin: '-8% 0px -8%' });
    document.querySelectorAll('.reveal, main > section').forEach((item) => observer.observe(item)); return () => observer.disconnect();
  }, [lang, content.posts.length]);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  const submit = async (event) => {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) { setFormStatus('error'); return; }
    setFormStatus('submitting');
    try {
      await apiRequest('/messages', { method: 'POST', body: JSON.stringify(form) });
      setFormStatus('success'); setForm({ name: '', email: '', subject: '', message: '' });
    } catch { setFormStatus('serverError'); }
  };

  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#home">Skip to content</a><div className="pixel-decor" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <header className="site-header"><nav className="nav-wrap" aria-label="Primary navigation">
        <button className="brand" onClick={() => go('home')} aria-label="Hai Dang — home"><span>HD</span><b>HAIDANG.DEV</b></button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>{navIds.map((id, index) => <button key={id} aria-current={active === id ? 'page' : undefined} className={active === id ? 'is-active' : ''} onClick={() => go(id)}><span>0{index + 1}.</span>{t.nav[id]}</button>)}</div>
        <div className="nav-tools"><button className="icon-button" onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} aria-label={t.controls.language}><Globe2 size={16} /><span>{lang.toUpperCase()}</span></button><button className="icon-button icon-button--square" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t.controls.theme}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button><button className={`menu-button ${menuOpen ? 'is-active' : ''}`} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} aria-label={t.controls.menu}>{menuOpen ? <X /> : <Menu />}</button></div>
      </nav></header>

      <main>
        <section id="home" className="hero-section"><div className="section-grid hero-grid">
          <div className="hero-copy reveal"><div className="status-pill"><i />{profile?.availability === 0 ? 'BUSY MODE' : t.hero.status}</div><p className="eyebrow">{t.hero.eyebrow}</p><h1>{displayName.toUpperCase()}</h1><div className="role-line"><span>&lt;</span>{profile?.role?.toUpperCase() || t.hero.role}<span>/&gt;</span></div><p className="hero-intro">{t.hero.intro}</p><div className="hero-actions"><button className="pixel-button pixel-button--primary" onClick={() => go('projects')}>{t.hero.projects}<ArrowDownRight size={18} /></button><button className="pixel-button" onClick={() => go('contact')}>{t.hero.contact}<Mail size={17} /></button></div><div className="hero-socials">{socialLinks.filter((item) => item.href !== '#').map(({ name, href, icon }) => <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}>{icon}{name}</a>)}</div></div>
          <div className="profile-console reveal"><div className="window-bar"><span>{t.hero.cardTitle}</span><div><i /><i /><i /></div></div><div className="profile-console__body"><div className="avatar-frame"><img src={profile?.avatar_url || '/avatar.jpg'} alt={displayName} /><span className="avatar-corner avatar-corner--1" /><span className="avatar-corner avatar-corner--2" /><span className="avatar-corner avatar-corner--3" /><span className="avatar-corner avatar-corner--4" /></div><div className="profile-data"><span>{t.hero.level}</span><h2>{displayName}</h2><p>{profile?.role?.toUpperCase() || t.hero.class}</p><div className="xp"><i /></div><small>EXP 78 / 100</small><div className="location"><MapPin size={14} />{displayLocation}</div></div></div><div className="console-line"><span>CURRENT_QUEST</span><b>BUILD SOMETHING USEFUL</b><em>● ACTIVE</em></div><span className="console-shadow" /></div>
        </div><div className="hero-bottom section-grid"><div className="scroll-hint"><span>{t.hero.scroll}</span><i /></div><div className="hero-stats">{t.hero.stats.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div></div></section>
        <div className="tech-ticker" aria-label="Technology list"><div>{[...t.ticker, ...t.ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div></div>

        <section id="about" className="content-section about-section"><div className="section-grid"><div className="section-heading reveal"><span className="section-tag">{t.about.tag}</span><h2>{t.about.title}</h2><p>{t.about.lead}</p></div><div className="about-layout"><div className="about-story pixel-window reveal"><div className="window-bar"><span>ABOUT_ME.TXT</span><div><i /><i /><i /></div></div><p>{profile?.[lang === 'vi' ? 'bio_vi' : 'bio_en'] || t.about.body}</p><div className="signature">{displayName}<span>_</span></div><a className="pixel-button" href={`mailto:${profile?.email || 'haidanglu2004@gmail.com'}?subject=CV%20request`}>{t.about.download}<ArrowDownRight size={17} /></a></div><div className="journey-card reveal"><Sparkles size={22} /><span>{t.about.journey}</span><p>{t.about.journeyText}</p><div className="journey-track"><i /><i /><i /><i /></div></div></div><div className="value-grid">{t.about.values.map(([number, title, text]) => <article className="value-card reveal" key={number}><span>{number}</span><Zap size={20} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section id="projects" className="content-section projects-section"><div className="section-grid"><div className="section-heading section-heading--row reveal"><div><span className="section-tag">{t.projects.tag}</span><h2>{t.projects.title}</h2></div><p>{t.projects.subtitle}</p></div><div className="projects-list">{projectItems.map((project, index) => <article className={`project-row reveal ${index % 2 ? 'project-row--reverse' : ''}`} key={project.title}><PixelArt type={project.art} /><div className="project-info"><div className="project-number">{project.no} <span>{project.featured || index === 0 ? t.projects.featured : 'WEB APP'}</span></div><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.desc}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><ProjectReactions projectId={index + 1} />{project.href !== '#' && <a className="pixel-button pixel-button--small" href={project.href} target="_blank" rel="noreferrer">{project.art === 'farm' ? t.projects.source : t.projects.view}<ArrowUpRight size={17} /></a>}</div></article>)}</div></div></section>

        <section id="blog" className="content-section blog-section"><div className="section-grid"><div className="section-heading section-heading--row reveal"><div><span className="section-tag">{t.blog.tag}</span><h2>{t.blog.title}</h2></div><p>{t.blog.subtitle}</p></div>{content.posts.length ? <div className="post-grid">{content.posts.map((post, index) => <article className="post-card reveal" key={post.id}><div className="post-card__meta"><span>{String(index + 1).padStart(2, '0')}</span><time>{new Date(post.created_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}</time></div>{post.image_url && <img src={post.image_url} alt="" />}<h3>{post.title}</h3><p>{post[lang === 'vi' ? 'excerpt_vi' : 'excerpt_en']}</p><details><summary>{t.blog.read} <ArrowDownRight size={15} /></summary><div>{post[lang === 'vi' ? 'content_vi' : 'content_en']}</div></details></article>)}</div> : <div className="blog-empty reveal">{t.blog.empty}</div>}</div></section>

        <section id="stack" className="content-section stack-section"><div className="section-grid"><div className="section-heading section-heading--center reveal"><span className="section-tag">{t.stack.tag}</span><h2>{t.stack.title}</h2><p>{t.stack.subtitle}</p></div><div className="stack-grid">{t.stack.groups.map(([group, items], groupIndex) => <article className="stack-card reveal" key={group}><div className="stack-card__top"><span>0{groupIndex + 1}</span><h3>{group}</h3></div><div>{items.map((item) => <span className="stack-chip" key={item}><i>{item.slice(0, 2).toUpperCase()}</i>{item}</span>)}</div></article>)}</div><PhysicsSkillCloud groups={t.stack.groups} /></div></section>
        <section className="content-section process-section"><div className="section-grid"><div className="section-heading reveal"><span className="section-tag">{t.process.tag}</span><h2>{t.process.title}</h2></div><div className="process-grid">{t.process.items.map(([number, title, text]) => <article className="process-card reveal" key={number}><div><span>{number}</span><i /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <StickyBoard />
        <VisitorBox />

        <section id="contact" className="content-section contact-section"><div className="section-grid contact-layout"><div className="contact-copy reveal"><span className="section-tag">{t.contact.tag}</span><h2>{t.contact.title}<br /><em>{t.contact.highlight}</em></h2><p>{t.contact.body}</p><div className="contact-details"><a href={`mailto:${profile?.email || 'haidanglu2004@gmail.com'}`}><Mail /><span><small>{t.contact.emailLabel}</small><b>{profile?.email || 'haidanglu2004@gmail.com'}</b></span></a><div><MapPin /><span><small>{t.contact.locationLabel}</small><b>{displayLocation}</b></span></div></div></div><form className="contact-form-new pixel-window reveal" onSubmit={submit}><div className="window-bar"><span>{t.contact.formTitle}</span><div><i /><i /><i /></div></div><div className="form-grid"><label><span>NAME *</span><input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.name} /></label><label><span>EMAIL *</span><input required autoComplete="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.email} /></label><label className="form-full"><span>SUBJECT *</span><input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t.contact.subject} /></label><label className="form-full"><span>MESSAGE *</span><textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.message} rows="5" /></label></div>{formStatus !== 'idle' && <p className={`form-status form-status--${formStatus}`} role="status">{t.contact[formStatus]}</p>}<button disabled={formStatus === 'submitting'} className="pixel-button pixel-button--primary form-submit" type="submit">{formStatus === 'submitting' ? t.contact.sending : t.contact.send}<Send size={17} /></button></form></div></section>
        <BugSmasher />
        <HiddenTerminal />
        <SpotlightMode />
      </main>

      <footer><div className="section-grid footer-inner"><div className="brand"><span>HD</span><b>HAIDANG.DEV</b></div><p>{t.footer} <i>♥</i> + REACT</p><span>{t.rights}</span><a href="/admin">ADMIN</a><button onClick={() => go('home')}>{t.back} ↑</button></div></footer>
      <aside className={`music-player ${playing ? 'is-playing' : ''}`} aria-label={t.controls.music}><button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={15} /> : <Play size={15} />}</button><Music2 size={15} /><div><span>{playing ? 'PIXEL DREAMS' : 'CHIPTUNE RADIO'}</span><i>{playing ? 'NOW PLAYING' : 'PRESS PLAY'}</i></div><Volume2 size={14} /><input aria-label="Volume" type="range" min="0.02" max="0.3" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} /></aside>
    </div>
  );
}
