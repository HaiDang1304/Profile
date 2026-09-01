export default function Section({ scene, id, children, className = '' }) {
  return (
    <section
      data-scene={scene}
      id={id || scene}
      className={`portfolio-section ${scene}-section ${className}`}
    >
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}
