'use client';
import { useEffect } from 'react';

// Fades in every element with the .rv class once it scrolls into view.
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
