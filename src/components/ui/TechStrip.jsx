export default function TechStrip({
  tags = ['React', 'Node.js', 'TypeScript', 'MQTT', 'ESP32', 'Canvas 2D'],
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 bg-slate-900/90 text-amber-300 font-mono text-[10px] font-semibold rounded border border-amber-500/30 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
