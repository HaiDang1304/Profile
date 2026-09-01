import heroDawn from '../../../assets/pixel/scenes/generated/optimized/hero-dawn.webp';
import aboutMorning from '../../../assets/pixel/scenes/generated/optimized/about-morning.webp';
import projectsMidday from '../../../assets/pixel/scenes/generated/optimized/projects-midday.webp';
import technologyAfternoon from '../../../assets/pixel/scenes/generated/optimized/technology-afternoon.webp';
import playgroundSunset from '../../../assets/pixel/scenes/generated/optimized/playground-sunset.webp';
import contactNight from '../../../assets/pixel/scenes/generated/optimized/contact-night.webp';

export const SCENE_BACKDROPS = [
  {
    id: 'hero',
    src: heroDawn,
    focalX: 0.62,
    waterLine: 0.63,
    interactionLabel: 'Đánh thức bình minh',
    interactionHint: 'Gọi đàn chim và cánh sen',
  },
  {
    id: 'about',
    src: aboutMorning,
    focalX: 0.36,
    waterLine: 0.64,
    interactionLabel: 'Gọi gió qua vườn',
    interactionHint: 'Làm lá và cánh hoa lay động',
  },
  {
    id: 'projects',
    src: projectsMidday,
    focalX: 0.62,
    waterLine: 0.49,
    interactionLabel: 'Khuấy sóng bến thuyền',
    interactionHint: 'Tạo một đợt sóng trên sông',
  },
  {
    id: 'technology',
    src: technologyAfternoon,
    focalX: 0.36,
    waterLine: 0.7,
    interactionLabel: 'Khởi động góc máy',
    interactionHint: 'Bật màn hình và luồng tín hiệu',
  },
  {
    id: 'playground',
    src: playgroundSunset,
    focalX: 0.64,
    waterLine: 0.66,
    interactionLabel: 'Thả thêm một cánh diều',
    interactionHint: 'Gửi cánh diều qua trời chiều',
  },
  {
    id: 'contact',
    src: contactNight,
    focalX: 0.38,
    waterLine: 0.55,
    interactionLabel: 'Nhóm bếp lửa',
    interactionHint: 'Thắp lửa và gọi đàn đom đóm',
  },
];

export const SCENE_BACKDROP_BY_ID = Object.fromEntries(
  SCENE_BACKDROPS.map((scene) => [scene.id, scene]),
);
