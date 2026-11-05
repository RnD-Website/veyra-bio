'use client';
import { useEffect, useRef } from 'react';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Page-wide scroll animation:
//  - a thin progress bar at the top of the page
//  - [data-par]   gentle parallax drift (element moves slower or faster than the page)
//  - [data-scrub] a 0..1 value (--sp) that follows the element through the viewport, used by CSS
export default function ScrollFX() {
  const bar = useRef(null);
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const par = [...document.querySelectorAll('[data-par]')], scrub = [...document.querySelectorAll('[data-scrub]')];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const H = innerHeight, max = Math.max(1, document.documentElement.scrollHeight - H);
      if (bar.current) bar.current.style.transform = `scaleX(${clamp(scrollY / max)})`;
      scrub.forEach(el => {
        const r = el.getBoundingClientRect();
        // default: 0 when the element enters at the bottom, 1 when it reaches mid-screen; "end": for elements at the very bottom of the page
        const v = el.dataset.scrub === 'end' ? clamp((H - r.top) / (r.height * 0.55)) : clamp((H * 0.92 - r.top) / (H * 0.5));
        el.style.setProperty('--sp', (reduce ? 1 : v).toFixed(3));
      });
      if (!reduce) par.forEach(el => {
        const pr = el.parentElement.getBoundingClientRect(), c = pr.top + pr.height / 2 - H / 2;
        el.style.translate = `0 ${(-c * parseFloat(el.dataset.par)).toFixed(1)}px`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="progress" ref={bar} aria-hidden="true" />;
}
