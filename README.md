# Hollowtips Verify

Premium QR product-verification web app for **Hollowtips** — luxury black-and-gold,
gothic streetwear aesthetic. This repository is **step 1**: the foundation, admin
authentication, and a polished, responsive branded admin shell.

> **Step 1** — foundation: full database schema (all models defined), admin
> login/logout, reusable admin shell (sidebar + topbar + theme toggle), dashboard.
>
> **Step 2** — **Products CRUD**: list / create / edit / delete / activate
> products, with **file uploads** for product image, artwork and video. Seeds the
> 10 real Hollowtips strains.
>
> **Step 3** — **Verification Codes**: bulk-generate codes per product, paginated
> list with product/status filters + search, flag/delete, CSV export, QR PNGs
> (single + ZIP), and a branded print-ready label sheet. (Scans, analytics, and
> the public verify page come next.)

---

## Tech Stack

| Concern        | Choice                                                   |
| -------------- | -------------------------------------------------------- |
| Framework      | Next.js 15 (App Router, TypeScript)                      |
| Styling        | Tailwind CSS v3 (CSS-variable theme tokens)              |
| Database / ORM | Prisma — **SQLite** for local dev, **Postgres**-ready    |
| Auth           | NextAuth v4 — Credentials provider, bcrypt, JWT sessions |
| Theming        | next-themes (dark/light, gold accent in both)            |
| Icons          | lucide-react                                             |
| Fonts          | Inter (UI) + UnifrakturCook (blackletter wordmark)       |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env
#    then set a real NEXTAUTH_SECRET:  openssl rand -base64 32

# 3. Create the database + run the migration
npx prisma migrate dev

# 4. Seed the admin user
npx prisma db seed

# 5. Run the dev server
npm run dev
```

Open <http://localhost:3000> → you'll be redirected to **/admin/login**.

### Admin login

```
Email:    admin@hollowtips.com
Password: ChangeMe123!
```

(Change this after first login.)

---

## Environment Variables

Defined in `.env` (see `.env.example`):

| Variable          | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`    | Prisma connection string. Local dev = `file:./dev.db` (SQLite).        |
| `NEXTAUTH_SECRET` | Secret used to sign JWT sessions. Generate: `openssl rand -base64 32`. |
| `NEXTAUTH_URL`    | App origin, e.g. `http://localhost:3000`.                              |

---

## Useful Scripts

| Script                | What it does                                |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Start the dev server                        |
| `npm run build`       | `prisma generate` + production build        |
| `npm run start`       | Run the production build                    |
| `npm run db:migrate`  | `prisma migrate dev`                        |
| `npm run db:seed`     | Seed the admin user                         |
| `npm run db:studio`   | Open Prisma Studio                          |

---

## Products & file uploads

- Manage products at **/admin/products** (list → create / edit / delete / toggle active).
- **Media** (product image, artwork, video) is uploaded via the admin UI and stored
  on local disk under `public/uploads/` (served at `/uploads/...`, git-ignored).
  - Images: PNG/JPG/WEBP/GIF ≤ 5 MB · Video: MP4/WEBM ≤ 50 MB.
  - The upload endpoint (`/api/admin/upload`) is session-guarded.
- **Storage is abstracted in [`src/lib/storage.ts`](src/lib/storage.ts)** — this is the
  single swap point. For serverless / multi-instance hosting (e.g. AWS), replace the
  body of `saveUpload`/`deleteUpload` with an S3 client; nothing else changes.
- `npx prisma db seed` seeds the admin user **and** the 10 real strains (idempotent).

## Verification Codes

- Manage codes at **/admin/codes** — paginated table with **product + status filters**
  and code search.
- **Generate** codes per product (1–1000 per batch) — unique `HT-XXXXXXXXXX` strings.
- **Flag / unflag** and **delete** individual codes.
- **Export CSV** (`code, verifyUrl, product, status, scanCount, createdAt`) for the
  current filter, and download **QR PNGs** — single per code or **all as a ZIP**.
- **Print labels**: `/admin/codes/print` renders a branded, print-ready label sheet
  (gold frame, Hollowtips bullet over each QR, code + product) → print or Save-PDF.
- QR codes encode `/<NEXTAUTH_URL>/verify/<code>` (the public verify page is a later
  module) and use error-correction level **H** so the centered logo still scans.
- Dashboard's **Total Codes / Verified / Flagged** stats reflect this data live.

## Switching to PostgreSQL (production)

1. In `prisma/schema.prisma`, change the datasource provider:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Set `DATABASE_URL` to your Postgres URL, e.g.
   `postgresql://user:pass@host:5432/hollowtips?schema=public`

3. Run `npx prisma migrate deploy` (or `migrate dev` locally).

> **Note on enums:** SQLite has no native enum/JSON types, so `VerificationCode.status`
> and `ScanEvent.deviceType` are stored as `String` (allowed values live in
> [`src/lib/enums.ts`](src/lib/enums.ts)), and `Product.socialLinks` is a JSON string.
> On Postgres you may convert these to native `enum`/`Json` if you prefer.

---

## Project Structure

```
prisma/
  schema.prisma          # all 5 models (AdminUser, Product, VerificationCode,
                         #   ScanEvent, EmailCapture)
  seed.ts                # seeds the admin user
src/
  app/
    layout.tsx           # root layout: fonts + providers
    globals.css          # Tailwind + theme tokens (gold / black gallery)
    page.tsx             # → redirects to /admin
    api/auth/[...nextauth]/route.ts
    admin/
      login/page.tsx     # branded login (MatrixRain backdrop, no shell)
      (shell)/           # route group → wraps pages in the admin shell
        layout.tsx       # session guard + <AdminShell>
        page.tsx         # dashboard (stat cards + recent-scans empty state)
  components/
    brand/
      HollowtipsLogo.tsx # gold-bullet mark + blackletter wordmark (variants)
      MatrixRain.tsx     # canvas code-rain (login hero backdrop)
    admin/
      AdminShell.tsx     # responsive frame (collapse + mobile drawer state)
      Sidebar.tsx        # nav, active gold highlight, collapse/drawer
      Topbar.tsx         # title + theme toggle + user menu + toggles
      ThemeToggle.tsx    # animated sun/moon
      UserMenu.tsx       # avatar dropdown + sign out
      StatCard.tsx       # premium gold/graffiti-accent stat card
      LoginForm.tsx      # credentials form (error + loading states)
      nav.ts             # nav config + page-title resolver
    providers/Providers.tsx  # ThemeProvider + SessionProvider
  lib/
    prisma.ts            # Prisma client singleton
    auth.ts              # NextAuth options (Credentials + bcrypt + JWT)
    enums.ts             # string-backed CodeStatus / DeviceType
  types/next-auth.d.ts   # session/JWT type augmentation (id, role)
  middleware.ts          # protects /admin/** → /admin/login
public/brand/            # curated brand assets (gold bullet PNG)
```

---

## Design Notes

- **Cinematic Black Gallery** aesthetic, drawn from the real product photography
  (gold bullet on pure black). Generous negative space, hairline gold rules,
  gold-gradient primary actions, soft gold glows.
- **Gold accent persists in both themes**; dark = near-black `#0A0A0A`, light =
  warm off-white `#FAFAF7`.
- **Graffiti accent palette** (pink/lime/orange from the strain art) is reserved
  for status/data highlights — used sparingly, like the sticker on the bullet.
- **Matrix code-rain** appears only on the login screen (gold-forward with green
  glints) and respects `prefers-reduced-motion`.
- `<HollowtipsLogo />` uses the real bullet PNG and can be swapped for the
  official SVG later without touching consumers.
