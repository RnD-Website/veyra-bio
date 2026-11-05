'use client';
import { useEffect, useState } from 'react';

const items = [
  ['hero', 'Start'], ['facts', 'Overview'], ['process', 'Method'], ['audience', 'Who it\'s for'],
  ['statement', 'About'], ['faq', 'FAQ'], ['careers', 'Careers'], ['contact', 'Contact'],
];

// Right-hand section dots (where am I?) + a back-to-top button.
export default function SideNav() {
  const [active, setActive] = useState('hero');
  const [top, setTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let cur = 'hero';
      items.forEach(([id]) => { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
      setActive(cur); setTop(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <nav className="dots" aria-label="Page sections">
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-label={label} aria-current={active === id ? 'true' : undefined}><span>{label}</span></a>
        ))}
      </nav>
      <button className={`totop cx${top ? ' show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑ Top</button>
    </>
  );
}
