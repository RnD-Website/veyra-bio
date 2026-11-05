'use client';
import { useState } from 'react';

// One-click "copy email" button with clear feedback.
export default function CopyEmail({ email }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); } catch { /* clipboard unavailable: the address is shown next to the button anyway */ }
    setDone(true); setTimeout(() => setDone(false), 1800);
  };
  return (
    <button className="cx ghosty copy-btn" onClick={copy} aria-live="polite">
      <span className="copy-addr">{email}</span>
      <span className="copy-state">{done ? 'Copied ✓' : 'Copy'}</span>
    </button>
  );
}
