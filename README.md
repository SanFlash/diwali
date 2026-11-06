# AMWebtech — A Luminous Diwali

A five-page, responsive Diwali celebration experience for AM Webtech, built with React, Vite, TypeScript, GSAP and Lenis.

## Brand direction
The experience keeps AM Webtech's existing orange-and-blue brand character, translated into a royal midnight, champagne-gold and diya-amber festive palette. The official AM Webtech logo is loaded from the existing public brand asset in the AM Webtech experience repository, on a light plaque to preserve contrast against the dark festive header.

## Pages
- `/` — Cinematic home
- `/story` — The meaning and spirit of Diwali
- `/wishes` — Filterable greeting gallery with copy/share/download
- `/celebrate` — Interactive diya, rangoli canvas, fireworks and personal wish generator
- `/finale` — Grand closing celebration

## Requirements
- Node.js 20+
- npm 10+

## Local development
```bash
npm install
npm run dev
```
Open http://localhost:5173.

## Production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this project to a Git repository.
2. Import the repository into Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy. `vercel.json` includes SPA route rewrites so direct navigation to all five routes works.

No environment variables or backend are required for the current feature set.

## Brand asset
The header and footer use the official AM Webtech logo from the existing public brand asset in `SanFlash/amwebtech-experience`. The lockup links to https://amwebtech.com. If the logo is moved to a local asset, update the image source in `src/components/Brand.tsx`; do not substitute an unofficial logo.

## Notes
- Sound is optional and synthesized in-browser only after the visitor opts in; no autoplay.
- The fireworks and rangoli are drawn on canvas.
- Reduced-motion preferences are respected.
- Greeting download is generated locally in the browser.
