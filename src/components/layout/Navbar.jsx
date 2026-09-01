import { useEffect, useState } from 'react';
import { getActiveSceneId, SCENE_LAYOUT, scrollToScene } from '../canvas/data/sceneLayout';

export default function Navbar() {
  const [activeScene, setActiveScene] = useState('hero');

  useEffect(() => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    setActiveScene(getActiveSceneId(window.scrollY / maxScroll));
    const handleSceneChange = (event) => setActiveScene(event.detail.sceneId);
    window.addEventListener('portfolio:scenechange', handleSceneChange);
    return () => window.removeEventListener('portfolio:scenechange', handleSceneChange);
  }, []);

  return (
    <header className="portfolio-nav">
      <nav className="portfolio-nav__inner" aria-label="Điều hướng sáu tầng portfolio">
        <button
          onClick={() => scrollToScene('hero')}
          className="portfolio-nav__brand"
          aria-label="Về Trang chủ"
        >
          <span>🌾</span>
          <span>Lữ Hải Đăng</span>
        </button>
        <div className="portfolio-nav__items">
          {SCENE_LAYOUT.map((item, index) => {
            const isActive = activeScene === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToScene(item.id)}
                className={`portfolio-nav__item ${isActive ? 'is-active' : ''}`}
                aria-label={`Đi đến ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="portfolio-nav__number">0{index + 1}</span>
                <span className="portfolio-nav__label">{item.label}</span>
                <span className="portfolio-nav__short">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
