import Section from '../components/layout/Section';
import PixelPanel from '../components/ui/PixelPanel';
import PixelButton from '../components/ui/PixelButton';
import SceneInteractionButton from '../components/ui/SceneInteractionButton';
import { scrollToScene } from '../components/canvas/data/sceneLayout';

const EXPERIMENTS = [
  { title: 'Pixel World Engine', description: 'Camera, parallax, atmosphere và pixel renderer vận hành portfolio này.', tags: ['Canvas 2D', 'Camera'], status: 'Đang chạy', href: '/art' },
  { title: 'Weather Lab', description: 'Thử nghiệm trình bày dữ liệu khí tượng theo thời gian thực.', tags: ['React', 'REST API'], status: 'Đang phát triển' },
  { title: 'Dino Runner', description: 'Mini game dùng game loop thuần và va chạm AABB.', tags: ['Canvas', 'Game Loop'], status: 'Đang phát triển' },
];

export default function PlaygroundSection() {
  return (
    <Section scene="playground" id="playground">
      <div className="scene-grid scene-grid--left">
        <div className="scene-panel scene-panel--left select-text">
          <PixelPanel variant="warm" className="space-y-4">
            <div className="scene-kicker scene-kicker--violet">KHOẢNG SÂN THỬ NGHIỆM · HOÀNG HÔN</div>
            <div>
              <h2 className="scene-title">PLAYGROUND</h2>
              <p className="scene-lead">Nơi mình thử ý tưởng nhỏ trước khi đưa chúng thành một sản phẩm hoàn chỉnh.</p>
            </div>

            <SceneInteractionButton sceneId="playground" />

            <div className="experiment-list">
              {EXPERIMENTS.map((item) => (
                <article key={item.title} className="experiment-card">
                  <div className="experiment-card__top">
                    <h3>{item.title}</h3>
                    <span>{item.status}</span>
                  </div>
                  <p>{item.description}</p>
                  <div className="experiment-card__footer">
                    <div className="quick-badges">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    {item.href && <PixelButton variant="secondary" href={item.href}>Mở demo →</PixelButton>}
                  </div>
                </article>
              ))}
            </div>

            <div className="scene-next-row">
              <PixelButton variant="ghost" onClick={() => scrollToScene('contact')}>Theo đèn về bến sông →</PixelButton>
              <span>Đoạn kết ban đêm</span>
            </div>
          </PixelPanel>
        </div>
        <div className="scene-art-space" aria-hidden="true" />
      </div>
    </Section>
  );
}
