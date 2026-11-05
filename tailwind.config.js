const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // absolute paths so it works whichever folder the dev server is started from
  content: [path.join(__dirname, 'app/**/*.{js,jsx}'), path.join(__dirname, 'components/**/*.{js,jsx}')],
  // Utilities win over the older hand-written rules, so the type system below is always applied.
  important: true,
  // Keep the existing base styles; Tailwind adds utilities only.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        navy: '#0a2a73',
        cobalt: '#204287',
        ice: '#aee4ff',
        mist: '#c4d3ee',
        // follow the section's theme (set by .dk / .lt in globals.css)
        head: 'var(--head)',
        copy: 'var(--copy)',
        accent: 'var(--accent-tone)',
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      // One type scale for the whole site. Every heading and paragraph picks one of these.
      fontSize: {
        display: ['clamp(46px,6.4vw,104px)', { lineHeight: '0.9', letterSpacing: '-0.058em', fontWeight: '500' }],
        h1: ['clamp(36px,4.4vw,68px)', { lineHeight: '1.02', letterSpacing: '-0.055em', fontWeight: '500' }],
        h2: ['clamp(26px,3vw,46px)', { lineHeight: '1.02', letterSpacing: '-0.05em', fontWeight: '500' }],
        h3: ['clamp(22px,2.1vw,32px)', { lineHeight: '1.05', letterSpacing: '-0.045em', fontWeight: '500' }],
        lead: ['clamp(17px,1.5vw,22px)', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.55', letterSpacing: '-0.011em', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        label: ['11.5px', { lineHeight: '1.4', letterSpacing: '0.12em', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
