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


## Arrow Arena multiplayer setup

Arrow Arena includes a live 1-vs-1 lobby powered by Supabase Realtime Presence and Broadcast. A browser-local IndexedDB store keeps the last five match results on that device.

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the project's URL and anon/public key.
4. In Supabase, enable Realtime for your project. The app uses private, ephemeral Realtime channels for lobby presence and duel events; it does not require a database table.
5. Add the same two variables in Vercel → Project Settings → Environment Variables, then redeploy.

Never put a Supabase service-role key in a Vite/browser environment variable. The anon/public key is intended for browser use.

Without these environment variables, the page remains usable in local practice mode. A local IndexedDB database is per-browser and cannot connect visitors on different devices; cross-device matchmaking requires the shared Supabase Realtime service.

**Security note:** this is a casual festival mini-game. Duel events are client-broadcast for responsiveness and are not server-authoritative; do not use this implementation for ranked play, prizes, or anything requiring cheat-resistant scoring.
