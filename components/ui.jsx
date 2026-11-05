// Shared building blocks so every section's heading and paragraph are built the same way.
// The look comes from the type tokens in tailwind.config.js (text-h1, text-lead, text-label ...).

export function SectionHead({ eyebrow, title, accent, lead, center = false, par = '.05', className = '' }) {
  return (
    <div className={`rv mb-10 max-w-[46rem] md:mb-14 ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && <span className="mb-4 block text-label uppercase opacity-75">{eyebrow}</span>}
      <h2 data-par={par} className="mb-5 text-h1 text-head">
        {title}
        {accent && (<><br /><span className="font-light text-accent">{accent}</span></>)}
      </h2>
      {lead && <p className={`max-w-[30rem] text-lead text-copy ${center ? 'mx-auto' : ''}`}>{lead}</p>}
    </div>
  );
}
