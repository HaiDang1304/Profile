import Section from '../components/layout/Section';
import PixelPanel from '../components/ui/PixelPanel';
import PixelButton from '../components/ui/PixelButton';
import TechStrip from '../components/ui/TechStrip';
import SceneInteractionButton from '../components/ui/SceneInteractionButton';
import { localizedContent } from '../data/profileData';
import { scrollToScene } from '../components/canvas/data/sceneLayout';

const PROJECT_META = {
  'System-Farm-IoT': { role: 'Full-stack & IoT', status: 'Mã nguồn công khai', action: 'Xem mã nguồn' },
  TezMovies: { role: 'Frontend', status: 'Đang hoạt động', action: 'Mở bản demo' },
};

const PROJECTS = localizedContent.vi.projects.map((project) => ({ ...project, ...PROJECT_META[project.title] }));

export default function ProjectsSection() {
  return (
    <Section scene="projects" id="projects">
      <div className="scene-grid scene-grid--left">
        <div className="scene-panel scene-panel--left select-text">
          <PixelPanel variant="warm" className="space-y-4">
            <div className="scene-kicker scene-kicker--amber">BẾN THUYỀN SÁNG TẠO · GIỮA TRƯA</div>
            <div>
              <h2 className="scene-title">DỰ ÁN NỔI BẬT</h2>
              <p className="scene-lead">Hai sản phẩm thật thể hiện cách mình kết hợp web, dữ liệu realtime và trải nghiệm responsive.</p>
            </div>

            <SceneInteractionButton sceneId="projects" />

            <div className="project-list">
              {PROJECTS.map((project) => (
                <article key={project.title} className="project-card">
                  <div className="project-card__top">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.role}</p>
                    </div>
                    <span className="project-status">{project.status}</span>
                  </div>
                  <p className="project-card__description">{project.description}</p>
                  <TechStrip tags={project.tags} />
                  <PixelButton variant="secondary" href={project.href} target="_blank" rel="noopener noreferrer">
                    {project.action} ↗
                  </PixelButton>
                </article>
              ))}
            </div>

            <div className="scene-next-row">
              <PixelButton variant="ghost" onClick={() => scrollToScene('technology')}>Đến góc công nghệ →</PixelButton>
              <span>04 / 06 kế tiếp</span>
            </div>
          </PixelPanel>
        </div>
        <div className="scene-art-space" aria-hidden="true" />
      </div>
    </Section>
  );
}
