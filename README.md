# FreshBite — Frontend

Premium grocery / food-delivery storefront built with Next.js 16 (App Router),
React 19, Tailwind CSS 4, Redux Toolkit and Framer Motion. JavaScript only.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Copy `.env.example` to `.env.local` and adjust as needed:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used by SEO metadata |
| `NEXT_PUBLIC_CURRENCY` | ISO currency code for price formatting |
| `NEXT_PUBLIC_LOCALE` | Locale for number/date formatting |

## Architecture

```
src/
├── app/            App Router routes, grouped by concern
│   ├── (shop)/     Storefront — home, products, cart, checkout
│   ├── (auth)/     Login, register, password recovery
│   ├── (account)/  Profile and orders (auth-guarded)
│   └── admin/      Dashboard and CRUD (role-guarded)
├── components/     Presentational + shared UI
│   ├── ui/         Primitives: Button, Input, Modal, Skeleton…
│   ├── layout/     Navbar, Footer, Mobile menu
│   ├── product/    Product card, grid, gallery
│   ├── cart/       Cart drawer, line items
│   ├── admin/      Stats cards, charts, tables
│   └── providers/  Client boundaries (Redux, Toaster)
├── features/       Feature-scoped logic (auth, cart, wishlist, profile)
├── redux/          Store + slices
├── services/       API layer — one module per domain
├── hooks/          Reusable hooks
├── lib/            Framework-level setup (fonts)
├── constants/      Config, enums, route tables
└── utils/          Pure helpers (cn, formatters)
```

### Route groups

`(shop)`, `(auth)` and `(account)` are Next.js route groups — the parentheses
mean they do **not** add a URL segment. `(shop)/page.js` serves `/`,
`(auth)/login/page.js` serves `/login`, and so on. Each group owns a layout so
the storefront, auth screens and account area can have different shells.

### Design tokens

All theming lives in `src/app/globals.css` under `@theme`, using Tailwind 4's
CSS-first config. Tokens are exposed automatically as utilities — declaring
`--color-brand-500` yields `bg-brand-500`, `text-brand-500`, `border-brand-500`.
There is no `tailwind.config.js`.

Palette: `brand-*` (fresh green), `cream-*` (surfaces), `ink-*` (text), plus
`success` / `warning` / `danger`.

### Server vs Client Components

Pages are Server Components by default. The only root-level client boundary is
`components/providers/AppProviders.jsx`, which mounts Redux and the toaster.
Children passed through it stay server-rendered.

## Build order

| # | Feature | Status |
| --- | --- | --- |
| 1 | Scaffold, tokens, fonts, routing | ✅ Done |
| 2 | Axios client + service layer | Next |
| 3 | Redux slices + persistence | |
| 4 | UI primitives | |
| 5 | Navbar / Footer / Mobile menu | |
| 6 | Home page | |
| 7 | Products page | |
| 8 | Product details | |
| 9 | Cart + Wishlist | |
| 10 | Checkout | |
| 11 | Auth + route guards | |
| 12 | Profile | |
| 13 | Admin dashboard + CRUD | |
| 14 | 404, SEO, polish | |

## Notes

- `src/redux/store.js` currently holds a placeholder reducer so the provider
  tree boots. Feature 3 replaces it with the real slices.
- Route pages are placeholders that render their title; each is replaced in the
  feature noted in its file comment.
- Fonts use `next/font/google` (Inter + Plus Jakarta Sans) so no font files are
  required. To self-host a display face, swap the `displayFace` export in
  `src/lib/fonts.js` for `next/font/local` and keep the same CSS variable name.
