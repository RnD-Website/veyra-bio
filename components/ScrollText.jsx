// Text whose words light up one after another as it scrolls into view.
// ScrollFX writes --sp (0..1) onto the element; each word reads it through its own --w position.
export default function ScrollText({ children, className = '', as: Tag = 'p' }) {
  const words = String(children).split(/\s+/).filter(Boolean);
  return (
    <Tag className={`st ${className}`} data-scrub>
      {words.map((w, i) => (
        <span key={i} style={{ '--w': (i / Math.max(1, words.length - 1)).toFixed(3) }}>{w}{' '}</span>
      ))}
    </Tag>
  );
}
