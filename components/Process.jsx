'use client';
import { useEffect, useState } from 'react';
import MethodStage from './MethodStage';

const steps = [
  { n: '01', t: 'Gather', view: 'Micro view · Assembly', scale: 'Molecules drawing together', d: 'Start with a sample and keep its structure intact, so nothing is lost before the work begins.', what: 'The sample is prepared and labelled.', get: 'A clean, trackable starting point.' },
  { n: '02', t: 'Unfold', view: 'Micro view · Structure', scale: 'A double strand, turning', d: 'Each chain is gently drawn out so every building block has room to be seen on its own.', what: 'Tangled chains are stretched into straight lines.', get: 'Space to look at one unit at a time.' },
  { n: '03', t: 'Read', view: 'Micro view · Reading', scale: 'One unit at a time', d: 'Light travels along each strand, one position at a time, listening for every unit in order.', what: 'Each position is read in sequence.', get: 'An ordered list of units for every strand.' },
  { n: '04', t: 'Align', view: 'Micro view · Lattice', scale: 'Units locking into a grid', d: 'The readings settle onto a tidy grid, ready to be compared, shared and understood.', what: 'Results are arranged side by side.', get: 'A clear, comparable summary.' },
];

export default function Process() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.getElementById('process');
    const onScroll = () => setP(Math.min(1, Math.max(0, (window.scrollY - el.offsetTop) / (el.offsetHeight - window.innerHeight))));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  const i = Math.min(3, Math.floor(p * 4)), frac = Math.min(1, p * 4 - i);
  const go = k => {
    const el = document.getElementById('process');
    window.scrollTo({ top: el.offsetTop + (el.offsetHeight - window.innerHeight) * ((k + 0.5) / 4), behavior: 'smooth' });
  };
  const cur = steps[i];
  return (
    <section id="process" className="dk" data-pose="1" aria-label="How the method works">
      <div className="pin">
        <MethodStage step={i} frac={frac} />
        <div className="note">How it works</div>
        <div className="jump" role="tablist" aria-label="Jump to step">
          {steps.map((s, k) => (
            <button key={s.n} role="tab" aria-selected={k === i} className={`cx ghosty${k === i ? ' on' : ''}${k < i ? ' done' : ''}`} style={{ '--f': k === i ? frac : k < i ? 1 : 0 }} onClick={() => go(k)}>
              <span className="tn">{s.n}</span>{s.t}
            </button>
          ))}
        </div>
        <div className="viewchip" aria-live="polite" key={cur.view}>
          <i></i>
          <span><b>{cur.view}</b><em>{cur.scale}</em></span>
        </div>
        {steps.map((s, k) => (
          <article key={s.n} className={`step${k === i ? ' on' : ''}`} aria-hidden={k !== i}>
            <span className="n">{s.n}</span>
            <h2 className="text-h1 text-head">{s.t}</h2>
            <p className="max-w-[26rem] text-lead text-copy">{s.d}</p>
            <dl className="facts">
              <div><dt>What happens</dt><dd>{s.what}</dd></div>
              <div><dt>What you get</dt><dd>{s.get}</dd></div>
            </dl>
          </article>
        ))}
        <a className="cx ghosty skip-method" href="#audience">Skip the method ↓</a>
        <div className="meter"><span>{`0${i + 1}/04`}</span><span className="bar"><b style={{ width: `${p * 100}%` }}></b></span></div>
      </div>
    </section>
  );
}
