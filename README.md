# veda.ng

Personal website of Vedang Vatsa — AI & Web3 thought leader, founder of Hashtag Web3, and Fellow of the Royal Society of Arts (FRSA).

Built with Next.js, React, TypeScript, and Tailwind CSS. The site publishes essays, research, free courses, and interactive tools on AI agents and Web3.

## Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — generate LLM files + default reports + production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks

## Project Structure

- `src/app/` — Next.js App Router pages
- `src/content/essays/` — MDX essay content
- `src/components/` — shared UI components
- `src/lib/` — utilities, data, and configurations
- `public/` — static assets, AI discovery manifests, and generated reports
- `scripts/` — build helpers, content generators, and social media tooling
