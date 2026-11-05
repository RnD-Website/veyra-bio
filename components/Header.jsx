'use client';
import { useState } from 'react';

const links = [['#facts', 'Overview'], ['#process', 'Method'], ['#faq', 'FAQ'], ['#careers', 'Careers']];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip" href="#facts">Skip to content</a>
      <header className="top" id="top">
        <a className="brand" href="#hero" aria-label="Veyra Bio, back to start"><i></i>veyra<span style={{ opacity: .6 }}>/bio</span></a>
        <nav className="navwrap nav" id="nav" aria-label="Main">
          {links.map(([h, t]) => <a key={h} href={h}>{t}</a>)}
        </nav>
        <div className="right">
          <a className="cx" href="#contact">Contact us</a>
          <a className="cx sq" href="#contact" aria-label="Contact">→</a>
        </div>
        <button className="menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}></button>
      </header>
      <nav className={`drop${open ? ' open' : ''}`} aria-label="Mobile menu">
        {[...links, ['#contact', 'Contact']].map(([h, t]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
      </nav>
    </>
  );
}
