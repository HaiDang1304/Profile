export default function PixelPanel({
  children,
  className = '',
  variant = 'default', // 'default' | 'warm' | 'highlight'
}) {
  const variantStyles = {
    default: 'bg-[#0e1622]/95 border-2 border-amber-600/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]',
    warm: 'bg-[#121b28]/95 border-2 border-[#b45309] shadow-[5px_5px_0px_0px_rgba(0,0,0,0.85)]',
    highlight: 'bg-[#0f172a]/95 border-2 border-amber-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)]',
  };

  return (
    <div
      className={`pixel-panel rounded-lg p-5 sm:p-7 text-slate-100 font-sans transition-all ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </div>
  );
}
