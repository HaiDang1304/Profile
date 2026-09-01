import Section from '../components/layout/Section';
import PixelPanel from '../components/ui/PixelPanel';
import PixelButton from '../components/ui/PixelButton';
import SceneInteractionButton from '../components/ui/SceneInteractionButton';
import { localizedContent } from '../data/profileData';
import { scrollToScene } from '../components/canvas/data/sceneLayout';

const expertise = localizedContent.vi.expertise;
const GROUPS = [
  { name: 'Frontend', tone: 'tech-group--sky', items: ['React.js', 'TypeScript', 'Tailwind CSS', 'UI/UX Design'] },
  { name: 'Backend', tone: 'tech-group--amber', items: ['Node.js', 'Express'] },
  { name: 'Database', tone: 'tech-group--emerald', items: ['MongoDB', 'Firebase', 'MySQL', 'SQLServer', 'PostgreSQL'] },
  { name: 'DevOps / Cloud', tone: 'tech-group--violet', items: ['Google Cloud', 'Docker', 'Linux', 'Kali Linux'] },
  { name: 'Tools', tone: 'tech-group--rose', items: ['Figma'] },
].map((group) => ({ ...group, items: group.items.filter((item) => expertise.includes(item)) }))
  .filter((group) => group.items.length > 0);

export default function TechnologySection() {
  return (
    <Section scene="technology" id="technology">
      <div className="scene-grid scene-grid--right">
        <div className="scene-art-space" aria-hidden="true" />
        <div className="scene-panel scene-panel--right select-text">
          <PixelPanel variant="warm" className="space-y-4">
            <div className="scene-kicker scene-kicker--sky">GÓC LÀM VIỆC · BUỔI CHIỀU</div>
            <div>
              <h2 className="scene-title">CÔNG NGHỆ</h2>
              <p className="scene-lead">Những công cụ mình đang dùng để đưa ý tưởng web và IoT từ bản vẽ đến sản phẩm vận hành được.</p>
            </div>

            <SceneInteractionButton sceneId="technology" />

            <div className="tech-groups" aria-label="Các nhóm công nghệ">
              {GROUPS.map((group) => (
                <section key={group.name} className={`tech-group ${group.tone}`} aria-labelledby={`tech-${group.name}`}>
                  <h3 id={`tech-${group.name}`} className="tech-group__title">{group.name}</h3>
                  <div className="tech-group__badges">
                    {group.items.map((item) => <span key={item} className="tech-badge" title={`Công nghệ: ${item}`}>{item}</span>)}
                  </div>
                </section>
              ))}
            </div>

            <div className="scene-next-row">
              <PixelButton variant="ghost" onClick={() => scrollToScene('playground')}>Ra sân thử nghiệm →</PixelButton>
              <span>05 / 06 kế tiếp</span>
            </div>
          </PixelPanel>
        </div>
      </div>
    </Section>
  );
}
