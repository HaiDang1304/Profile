import PixelWorldCanvas from '../components/canvas/PixelWorldCanvas';
import HtmlWorldAnchor from '../components/canvas/HtmlWorldAnchor';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ProjectsSection from '../sections/ProjectsSection';
import TechnologySection from '../sections/TechnologySection';
import PlaygroundSection from '../sections/PlaygroundSection';
import ContactSection from '../sections/ContactSection';
import { SCENE_BY_ID } from '../components/canvas/data/sceneLayout';
import SceneDebugger from '../components/canvas/debug/SceneDebugger';
import AtmosphereDebugger from '../components/canvas/debug/AtmosphereDebugger';
import CompositionDebugger from '../components/canvas/debug/CompositionDebugger';
import SeamInspector from '../components/canvas/debug/SeamInspector';

export default function Home() {
  const debugMode = (() => {
    if (!import.meta.env.DEV) return null;
    const params = new URLSearchParams(window.location.search);
    const debug = params.get('debug');
    if (debug === 'scene' || debug === 'transition') return 'scene';
    if (debug === 'atmosphere') return 'atmosphere';
    if (debug === 'composition') return 'composition';
    if (debug === 'seams' || debug === 'performance') return 'seams';
    if (debug === 'world') return 'world';
    return null;
  })();

  if (debugMode === 'scene') return <SceneDebugger />;
  if (debugMode === 'atmosphere') return <AtmosphereDebugger />;
  if (debugMode === 'composition') return <CompositionDebugger />;
  if (debugMode === 'seams') return <SeamInspector />;
  
  if (debugMode === 'world') {
    return (
      <div className="relative min-h-[1000vh] bg-slate-950 text-slate-100 overflow-x-clip">
        <PixelWorldCanvas renderMode="debug_world" />
        <Navbar />
      </div>
    );
  }

  return (
    <main className="relative min-h-[1000vh] bg-slate-950 text-slate-100 overflow-x-clip">
      <PixelWorldCanvas />
      <Navbar />
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <HtmlWorldAnchor sceneId="hero" wx={SCENE_BY_ID.hero.anchor.x} wy={SCENE_BY_ID.hero.anchor.y}><HeroSection /></HtmlWorldAnchor>
        <HtmlWorldAnchor sceneId="about" wx={SCENE_BY_ID.about.anchor.x} wy={SCENE_BY_ID.about.anchor.y}><AboutSection /></HtmlWorldAnchor>
        <HtmlWorldAnchor sceneId="projects" wx={SCENE_BY_ID.projects.anchor.x} wy={SCENE_BY_ID.projects.anchor.y}><ProjectsSection /></HtmlWorldAnchor>
        <HtmlWorldAnchor sceneId="technology" wx={SCENE_BY_ID.technology.anchor.x} wy={SCENE_BY_ID.technology.anchor.y}><TechnologySection /></HtmlWorldAnchor>
        <HtmlWorldAnchor sceneId="playground" wx={SCENE_BY_ID.playground.anchor.x} wy={SCENE_BY_ID.playground.anchor.y}><PlaygroundSection /></HtmlWorldAnchor>
        <HtmlWorldAnchor sceneId="contact" wx={SCENE_BY_ID.contact.anchor.x} wy={SCENE_BY_ID.contact.anchor.y}><ContactSection /></HtmlWorldAnchor>
      </div>
    </main>
  );
}
