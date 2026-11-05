'use client';
import { useEffect, useRef } from 'react';
import Molecule from './Molecule';

const cards = [
  { k: '01 · What it is', h: 'A clearer view of molecules', p: 'Veyra Bio builds tools that read molecular chains carefully and present the results in plain language.', kind: 'ring', spin: 1 },
  { k: '02 · How it works', h: 'Four calm steps', p: "Gather, Unfold, Read, Align. Each step is explained next, with what happens and what you get.", kind: 'helix', spin: -1 },
  { k: '03 · Why it matters', h: 'Better questions, sooner', p: 'When results are easy to read, teams spend less time decoding and more time deciding what to ask next.', kind: 'branch', spin: 1 },
];

// Three cards that rise and tilt into place as the section scrolls into view.
// Each card publishes its own progress (data-p / --p) which its molecule reads too.
export default function OverviewCards() {
  const wrap = useRef(null);
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = [...wrap.current.querySelectorAll('.gcard')];
    const update = () => {
      const r = wrap.current.getBoundingClientRect(), H = innerHeight;
      const sec = reduce ? 1 : Math.min(1, Math.max(0, (H * 0.92 - r.top) / (H * 0.55)));
      els.forEach((el, i) => {
        const p = reduce ? 1 : Math.min(1, Math.max(0, sec * 1.6 - i * 0.3));
        el.dataset.p = p.toFixed(3); el.style.setProperty('--p', p.toFixed(3));
      });
    };
    update();
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);
  return (
    <div className="cards3" ref={wrap}>
      {cards.map(c => (
        <article key={c.k} className="gcard scroll" data-p="0">
          <span className="k">{c.k}</span>
          <div className="mol"><Molecule kind={c.kind} spin={c.spin} /></div>
          <h3 className="text-h3 text-head">{c.h}</h3>
          <p className="text-body text-copy">{c.p}</p>
        </article>
      ))}
    </div>
  );
}
