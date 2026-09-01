import { profileConfig } from '../../config/profileConfig';

export default function ContactLinks() {
  const links = [
    {
      id: 'email',
      label: 'Email',
      value: profileConfig.email,
      href: profileConfig.email ? `mailto:${profileConfig.email}` : null,
      icon: '✉️',
    },
    {
      id: 'github',
      label: 'GitHub',
      value: profileConfig.github,
      href: profileConfig.github || null,
      icon: '🐙',
      external: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: profileConfig.linkedin,
      href: profileConfig.linkedin || null,
      icon: '💼',
      external: true,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      value: profileConfig.facebook,
      href: profileConfig.facebook || null,
      icon: '🌐',
      external: true,
    },
  ].filter((item) => Boolean(item.value && item.href));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className="px-3.5 py-2 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
        >
          <span>{link.icon}</span>
          <span>{link.label}: {link.value}</span>
        </a>
      ))}
    </div>
  );
}
