# Password Generator

A client-side password generator built with Next.js 16, React 19, and Tailwind CSS 4. Runs entirely in the browser — no passwords are ever sent to a server.

## Features

- **Random mode** — configurable length (6–64 chars) with toggles for uppercase, lowercase, numbers, and symbols
- **Memorable mode** — adjective-animal word combos (2–5 words) with optional capitalization and appended number
- Password strength indicator (Weak → Very Strong)
- One-click copy to clipboard
- Cryptographically secure generation via `crypto.getRandomValues`

## Stack

- [Next.js](https://nextjs.org) 16 (via [vinext](https://github.com/nicholasgasior/vinext) — Vite-based Next.js runner)
- React 19 with Server Components
- Tailwind CSS 4
- Deployed to Cloudflare via `@cloudflare/vite-plugin`

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun start` | Serve production build |
| `bun deploy` | Deploy to Cloudflare |
| `bun lint` | Run ESLint |
