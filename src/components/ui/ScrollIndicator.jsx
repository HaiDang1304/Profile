export default function ScrollIndicator({
  text = 'Cuộn xuống khám phá',
  hint = '6 tầng miền Tây',
  className = '',
}) {
  return (
    <div
      className={`pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <span className="text-amber-400 font-bold">🌾</span>
        <span>{hint}</span>
      </span>
      <span className="text-amber-400 font-medium inline-flex items-center gap-1 animate-bounce">
        <span>{text}</span>
        <span>↓</span>
      </span>
    </div>
  );
}
