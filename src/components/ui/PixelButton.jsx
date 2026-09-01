export default function PixelButton({
  children,
  onClick,
  href,
  target,
  rel,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  className = '',
  type = 'button',
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded font-mono text-xs font-bold transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-x-[2px] active:translate-y-[2px]';

  const variants = {
    primary:
      'bg-amber-500 hover:bg-amber-400 text-slate-950 border-2 border-amber-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)]',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-slate-200 border-2 border-slate-700 hover:border-slate-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]',
    ghost:
      'bg-transparent hover:bg-slate-800/80 text-amber-300 hover:text-white border-2 border-transparent hover:border-slate-700',
  };

  const combinedClass = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={combinedClass}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClass}>
      {children}
    </button>
  );
}
