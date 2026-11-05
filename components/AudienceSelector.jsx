'use client';
import { useState } from 'react';
import Molecule from './Molecule';

const items = [
  { n: '01', name: 'Research teams', line: 'See your samples clearly', fit: 'You want results that are easy to read, share and repeat.', does: 'Prepare samples, then review ordered readings side by side.', kind: 'ring' },
  { n: '02', name: 'Clinical partners', line: 'Make results easy to discuss', fit: 'You need plain-language summaries you can talk through with others.', does: 'Compare aligned results and keep a clear record of each step.', kind: 'helix' },
  { n: '03', name: 'Technology partners', line: 'Build on a clear foundation', fit: 'You want tidy, structured output to connect to your own tools.', does: 'Plug the results into your systems and build on top of them.', kind: 'branch' },
];

// Who it's for: an interactive list instead of cards. Choose a row to see who it suits and what you'd do.
export default function AudienceSelector() {
  const [i, setI] = useState(0);
  const cur = items[i];
  const onKey = (e, k) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((k + 1) % items.length); e.currentTarget.parentElement.children[(k + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); const n = (k + items.length - 1) % items.length; setI(n); e.currentTarget.parentElement.children[n].focus(); }
  };
  return (
    <div className="aud" data-scrub>
      <div className="aud-list" role="tablist" aria-label="Who it's for" aria-orientation="vertical">
        {items.map((it, k) => (
          <button key={it.n} role="tab" id={`aud-${k}`} aria-selected={k === i} aria-controls="aud-panel" tabIndex={k === i ? 0 : -1}
            className={`aud-row${k === i ? ' on' : ''}`} style={{ '--i': k }} onClick={() => setI(k)} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onKeyDown={e => onKey(e, k)}>
            <span className="aud-n">{it.n}</span>
            <span className="aud-name text-h2">{it.name}</span>
            <span className="aud-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      <div className="aud-detail" id="aud-panel" role="tabpanel" aria-labelledby={`aud-${i}`} key={cur.n}>
        <div className="aud-mol"><Molecule kind={cur.kind} spin={i % 2 ? -1 : 1} zoom={{ ring: 1.2, helix: .8, branch: 1.05 }[cur.kind]} /></div>
        <h3 className="text-h3 text-head">{cur.line}</h3>
        <dl>
          <div><dt>Good fit if</dt><dd>{cur.fit}</dd></div>
          <div><dt>You'd do</dt><dd>{cur.does}</dd></div>
        </dl>
        <a className="cx solid" href="#contact">Talk to us about this →</a>
      </div>
    </div>
  );
}
