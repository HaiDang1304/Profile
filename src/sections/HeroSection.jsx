import Section from '../components/layout/Section';
import PixelPanel from '../components/ui/PixelPanel';
import PixelButton from '../components/ui/PixelButton';
import StatusChip from '../components/ui/StatusChip';
import SocialLinks from '../components/ui/SocialLinks';
import TechStrip from '../components/ui/TechStrip';
import ScrollIndicator from '../components/ui/ScrollIndicator';
import SceneInteractionButton from '../components/ui/SceneInteractionButton';
import { scrollToScene } from '../components/canvas/data/sceneLayout';

export default function HeroSection() {
  return (
    <Section scene="hero" id="hero">
      {/* Asymmetric 12-Column Desktop Grid: UI on Left (5 Cols), Landmark Pixel Art Framed on Right (7 Cols) */}
      <div className="scene-grid scene-grid--left">
        <div className="scene-panel scene-panel--left select-text">
          <PixelPanel variant="highlight" className="space-y-4 sm:space-y-5">
            {/* Header Row: Availability status and Scene badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusChip label="Sẵn sàng nhận dự án mới" />
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded border border-amber-500/30">
                BÌNH MINH MIỀN TÂY
              </span>
            </div>

            {/* Identity & Role */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🌾</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                  LỮ HẢI ĐĂNG
                </h1>
              </div>
              <p className="text-amber-400 font-mono text-xs sm:text-sm font-semibold">
                Full-stack & IoT Developer • Vĩnh Long, Việt Nam
              </p>
            </div>

            {/* Concise Bio */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Xây dựng ứng dụng web hiện đại, hệ thống nhúng IoT và những trải nghiệm tương tác số hiệu năng cao, lấy cảm hứng từ vẻ đẹp mộc mạc sông nước miền Tây Nam Bộ.
            </p>

            <SceneInteractionButton sceneId="hero" />

            {/* Core Tech Stack Strip */}
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1.5">Công nghệ trọng tâm:</span>
              <TechStrip tags={['React', 'Node.js', 'TypeScript', 'MQTT', 'ESP32', 'Canvas 2D']} />
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <PixelButton
                variant="primary"
                onClick={() => scrollToScene('projects')}
              >
                <span>Xem dự án</span>
                <span>→</span>
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => scrollToScene('contact')}
              >
                Liên hệ ngay
              </PixelButton>
            </div>

            {/* Social Links */}
            <div className="pt-2 border-t border-slate-700/60">
              <SocialLinks />
            </div>

            {/* Scroll Down Indicator */}
            <ScrollIndicator text="Cuộn xuống khám phá" hint="6 tầng sông nước" />
          </PixelPanel>
        </div>

        {/* Clear Unobstructed Canvas Frame for Traditional House & Lotus Pond */}
        <div className="scene-art-space" aria-hidden="true" />
      </div>
    </Section>
  );
}
