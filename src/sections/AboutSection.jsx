import Section from '../components/layout/Section';
import PixelPanel from '../components/ui/PixelPanel';
import PixelButton from '../components/ui/PixelButton';
import SceneInteractionButton from '../components/ui/SceneInteractionButton';
import { scrollToScene } from '../components/canvas/data/sceneLayout';

const VALUES = [
  { title: 'Rõ ràng', description: 'Kiến trúc và giao diện đều phải dễ hiểu, dễ tiếp tục phát triển.' },
  { title: 'Hữu ích', description: 'Ưu tiên vấn đề thật và trải nghiệm thật của người sử dụng.' },
  { title: 'Bền vững', description: 'Hiệu năng, khả năng bảo trì và vận hành được cân nhắc từ đầu.' },
];

const BADGES = ['Full-stack Web', 'IoT realtime', 'UI/UX', 'Vĩnh Long'];

export default function AboutSection() {
  return (
    <Section scene="about" id="about">
      <div className="scene-grid scene-grid--right">
        <div className="scene-art-space" aria-hidden="true" />
        <div className="scene-panel scene-panel--right select-text">
          <PixelPanel variant="warm" className="space-y-4">
            <div className="scene-kicker scene-kicker--emerald">CẦU KHỈ & MƯƠNG DỪA · BUỔI SÁNG</div>
            <div>
              <h2 className="scene-title">VỀ MÌNH</h2>
              <p className="scene-subtitle">Full-stack & IoT Developer</p>
            </div>

            <p className="scene-lead">
              Mình là <strong>Lữ Hải Đăng</strong>, một developer đến từ Vĩnh Long. Mình tập trung xây dựng ứng dụng web sạch, dễ mở rộng và các hệ thống IoT có dữ liệu thời gian thực.
            </p>

            <SceneInteractionButton sceneId="about" />

            <div>
              <h3 className="scene-label">Mục tiêu nghề nghiệp</h3>
              <p className="scene-copy">Kết nối kỹ thuật phần mềm, thiết kế giao diện và phần cứng thành những sản phẩm rõ ràng, hữu ích và vận hành tin cậy.</p>
            </div>

            <div className="value-list">
              {VALUES.map((value) => (
                <div key={value.title} className="value-item">
                  <span>{value.title}</span>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>

            <div className="quick-badges" aria-label="Thông tin nhanh">
              {BADGES.map((badge) => <span key={badge}>{badge}</span>)}
            </div>

            <div className="scene-next-row">
              <PixelButton variant="primary" onClick={() => scrollToScene('projects')}>Khám phá dự án →</PixelButton>
              <span>Bến xuồng kế tiếp</span>
            </div>
          </PixelPanel>
        </div>
      </div>
    </Section>
  );
}
