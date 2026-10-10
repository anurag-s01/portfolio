# Project: Anurag Singh — Portfolio

## What This Is
Personal portfolio of Anurag Singh (Senior Software Engineer, backend / distributed systems) at https://anuragsinghdev.vercel.app. Audience is recruiters and engineers; the site's job is to prove real backend work and invite contact. Deployed by Vercel on merge to `main`.

## Tech Stack
- Next.js 16 (App Router, Turbopack) + React 19, TypeScript, SCSS modules
- Once UI **v1, vendored** in `src/once-ui` (not the npm `@once-ui-system/core` v2 — its layout API and global tokens conflict)
- framer-motion (all motion), three.js (dot wave), @react-three/fiber + drei (gallery), @paper-design/shaders-react (hero liquid metal)
- next-intl with a single `en` locale, `localePrefix: 'as-needed'` (public URLs have no `/en`)
- Content: `src/app/resources/content.js`; case studies: MDX in `src/app/[locale]/work/projects/en/` read via gray-matter + next-mdx-remote

## Design System
- Liquid-glass, blue/black. Palette set in `src/app/resources/config.js` (`neutral: gray`, `brand: blue`, `accent: blue`, `solid: contrast`).
- `solid: contrast` remaps `--brand-solid-*` to black/white → use `--accent-solid-*` for any decorative blue.
- Use theme tokens (`var(--…)`) for every colour; WebGL/canvas code reads them via `cssVar()` + `useResolvedTheme()` from `src/components/ThemeToggle.tsx`.
- Light/dark/system theme: pre-paint `themeScript` in the layout sets `data-theme` on `<html>`.
- Font: Schibsted Grotesk only (code font for code blocks). Display type weight 560, tight tracking.
- Keep it non-generic: sentence-case labels, no all-caps eyebrows, no "A · B" meta strings, no gradient text, no "→" in link text, no identical card grids.
- Motion respects `prefers-reduced-motion`; one orchestrated moment per section, motion that answers user actions.

## Key Components
- `components/motion/ProjectVisual.tsx` — coded SVG animation per project (`visual:` key in MDX frontmatter). Diagrams must reflect the real architecture; ask the owner before inventing flows.
- `components/FloatingContact.tsx` — "Get in touch" pill: docks in home hero slot `[data-cta-slot]` (144×44), roams with scroll-scaled sine drift, edge-transits on nav, fade cycle 10s/10s/30s/3s, hidden on `/gallery` and over `#contact`.
- `components/about/SkillOrbit.tsx` — scroll-rotated orb ring; centre readout shows hovered skill.
- `components/home/OpenLane.tsx` — contact section (`#contact`), themed water ripples, swim-level certificates.
- `components/Kbar.tsx` — ⌘K command menu (native `<dialog>`), items built in the layout.
- `components/Lightbox.tsx` — shared native-dialog image viewer.

## Code Conventions
- Prefer native/platform features and existing deps over new packages; keep diffs small.
- Client components only where needed; pages stay server-rendered (no route guards that hide SSR content).
- Portals / `document` access only after mount (avoid hydration mismatches).
- Size things with CSS (`clamp`, `cqi`, `%`) rather than JS measurement; check 320px → 1920px.
- CSS-module selectors must include a local class (bare element selectors fail to build).
- Absolute URLs: `https://${baseURL}/path` with no locale prefix (sitemap, canonical, OG, JSON-LD).

## Boundaries
- Keep security headers in `next.config.mjs`; `/blog/*` redirects home (blog removed).
- Large images: resize before committing (gallery ≤2400px, avatar ≤512px).
- Personal facts (projects, metrics, awards) come from the owner's resume only — never fabricate numbers or dates.

## Commands
- `npm run dev` · `npm run build` (must pass before PR) · `npx tsc --noEmit -p .`
- No lint script (Next 16 removed `next lint`).

## Quick Reference
- Routes on/off + theme + baseURL: `src/app/resources/config.js`
- Copy, experience, skills, stats, awards: `src/app/resources/content.js`
- Layout, metadata, theme script, Kbar items: `src/app/[locale]/layout.tsx`
- Sitemap/robots: `src/app/sitemap.ts`, `src/app/robots.ts`
- Resume PDF: `public/docs/Resume_Anurag.pdf`; awards: `public/images/awards/`
