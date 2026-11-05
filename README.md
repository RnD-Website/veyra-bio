# Veyra Bio — Next.js

Marketing site for Veyra Bio, built with Next.js (App Router) and three.js.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

- `lib/site.js` — business details (contact email, name). **Set the real contact email here.**
- `app/page.jsx` — page content
- `components/Scene.jsx` — hero 3D scene; `MethodStage.jsx` — Method section 3D; `Molecule.jsx` — small molecule canvases
- `components/ScrollFX.jsx` — scroll progress bar, parallax and scroll-linked values
- `app/globals.css` — all styles; font is Inter Tight via `next/font`

The contact form checks the entries and then opens the visitor's email app with the message addressed to `site.email`.
