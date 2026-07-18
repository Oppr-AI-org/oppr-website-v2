# Oppr Website

Marketing website for **Oppr** — operational intelligence software for European
manufacturing. Oppr captures the context operators observe in the field,
connects it with existing machine data on one timeline, and turns what works
into repeatable, verified action.

Built in the **"Shop-Floor Log"** visual direction: a measured, instrument-precise
system where hairline structure and a two-voice colour language (terracotta for
the human, teal for the machine, green for a verified result) carry the design.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Resend** for transactional email (booking + contact forms)
- Deployed on **Vercel**

## Getting started

Requires **Node 20.9+** (see `.nvmrc` → Node 22).

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable          | Required | Purpose                                                        |
| ----------------- | -------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`  | Yes      | Sends the booking (`/api/book`) and contact (`/api/contact`) emails via Resend. Without it the forms return a friendly "not configured" message instead of sending. |

Create a key at [resend.com](https://resend.com) and verify the `oppr.ai`
sending domain so mail from `noreply@oppr.ai` is delivered. Set the same
variable in the Vercel project (Production + Preview).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build         |
| `npm start`     | Serve the production build |
| `npm run lint`  | Run ESLint               |

## Project structure

```
src/
  app/
    layout.tsx            Fonts (Archivo + JetBrains Mono), metadata
    page.tsx              Landing page — assembles the home sections
    globals.css           The "Shop-Floor Log" design system
    about/                About page
    faq/                  FAQ page (accessible, native <details> accordion)
    book/                 Book-a-review page
    contact/              Contact page
    privacy/  terms/      Legal pages
    api/
      book/route.ts       Booking form handler (Resend)
      contact/route.ts    Contact form handler (Resend)
  components/
    layout/               Header, Footer
    home/                 Home sections, primitives, illustrations, film player
    book/  contact/       Form components (client)

public/
  films/                  Rendered homepage films (.webm + .mp4 + poster .jpg)
  img/                    Hero photography used by the site
  team/                   Team headshots

video/                    Remotion project that renders public/films/*
```

## Homepage films

The capture / connect / execute animations on the home page are rendered videos,
not runtime CSS. The source lives in `video/` (a self-contained Remotion project)
and the rendered output is committed to `public/films/`. `video/node_modules` and
`video/out` are not committed; see `video/SCRIPTS.md` to re-render.

## Deployment

Deployed on Vercel. Push to the default branch to trigger a production build;
pull requests get preview deployments. Set `RESEND_API_KEY` in the Vercel
project settings before the forms will send mail in production.

## License

Proprietary — © Oppr B.V. All rights reserved. See [LICENSE](./LICENSE).
