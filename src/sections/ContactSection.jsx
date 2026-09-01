import Section from '../components/layout/Section';
import PixelPanel from '../components/ui/PixelPanel';
import PixelButton from '../components/ui/PixelButton';
import ContactForm from '../components/contact/ContactForm';
import ContactLinks from '../components/contact/ContactLinks';
import SceneInteractionButton from '../components/ui/SceneInteractionButton';
import { scrollToScene } from '../components/canvas/data/sceneLayout';

export default function ContactSection() {
  return (
    <Section scene="contact" id="contact">
      <div className="scene-grid scene-grid--right">
        <div className="scene-art-space" aria-hidden="true" />
        <div className="scene-panel scene-panel--right select-text">
          <PixelPanel variant="warm" className="space-y-4">
            <div className="contact-heading-row">
              <div className="scene-kicker scene-kicker--violet">BẾN SÔNG ĐÊM · SCENE 06</div>
              <div className="availability"><span />Sẵn sàng nhận dự án</div>
            </div>
            <div>
              <h2 className="scene-title">LIÊN HỆ</h2>
              <p className="scene-lead">Một lời chào bên bếp lửa có thể là khởi đầu cho sản phẩm tiếp theo.</p>
            </div>

            <SceneInteractionButton sceneId="contact" />

            <ContactForm />

            <div className="contact-links-block">
              <span className="scene-label">Kênh liên hệ trực tiếp</span>
              <ContactLinks />
            </div>

            <div className="contact-footer">
              <PixelButton variant="ghost" onClick={() => scrollToScene('hero')}>↑ Quay lại đầu trang</PixelButton>
              <p>© 2026 Lữ Hải Đăng · Xây dựng bằng Canvas 2D và React.</p>
            </div>
          </PixelPanel>
        </div>
      </div>
    </Section>
  );
}
