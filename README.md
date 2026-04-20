# Excellent Group — Investors Portfolio

Single-page RTL Hebrew portfolio reel for investor presentations. Full-viewport project slides with scroll-snap cross-fade transitions.

Live: https://investors.excl-group.com

## Stack
React 19 + Vite + Tailwind 4.2. No animation libraries — pure CSS scroll-snap + IntersectionObserver.

## Develop
```
npm install
npm run import-assets   # one-time: reads source folders, emits optimized WebPs into public/images/
npm run dev
```

## Deploy
Push to `main` — GitHub Action builds and rsyncs `dist/` to `/var/www/investors/dist` on the VPS.
