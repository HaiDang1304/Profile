export default function StatusChip({
  label = 'Sẵn sàng nhận dự án mới',
  className = '',
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/70 border border-emerald-500/60 rounded-full text-emerald-300 font-mono text-[11px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] select-none ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span>{label}</span>
    </div>
  );
}
