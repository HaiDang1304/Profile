import { profileConfig } from '../../config/profileConfig';

export default function SocialLinks({ className = '' }) {
  const links = [
    {
      id: 'github',
      label: 'GitHub',
      icon: '🐙',
      href: profileConfig.github || 'https://github.com/LuHaiDang',
    },
    {
      id: 'email',
      label: 'Email',
      icon: '✉️',
      href: profileConfig.email ? `mailto:${profileConfig.email}` : 'mailto:luhd.dev@gmail.com',
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.id === 'github' ? '_blank' : undefined}
          rel={item.id === 'github' ? 'noopener noreferrer' : undefined}
          className="px-3 py-1.5 min-h-[36px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.7)] hover:border-amber-400"
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
