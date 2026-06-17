# Portfolio Builder

A full-stack, multi-user portfolio web app with dynamic, interactive themes, a user
dashboard, an admin approval workflow, and per-field visibility controls.

Built with **Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Resend · Framer Motion**.

---

## Features

- **Public portfolios** at `/<username>`, server-rendered and theme-aware.
- **3 interactive themes** (Classic, Minimal, Bold) with scroll animations, hover effects,
  mouse-reactive gradients, and animated skill bars. Users switch themes instantly.
- **User dashboard** — profile, photo upload, projects (drag-to-reorder), skills,
  resume (PDF), theme picker, and a master visibility page.
- **Admin dashboard** — stats, user table with search/filter, approval queue,
  per-user detail with audit log, role management, password resets, and CSV export.
- **Approval flow** — new signups are `pending` until an admin approves them.
- **Per-field visibility** — toggle each social link, email, location, and resume.
- **Email** via Resend for signup, approval, suspension, reinstatement, contact, and
  admin-created accounts.
- **Pluggable theme system** — add a new theme without touching user data.

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=you@example.com
```

- `NEXT_PUBLIC_*` keys are browser-safe.
- `SUPABASE_SERVICE_ROLE_KEY` is used **only** in `app/api/admin/*` and other server routes.
- `RESEND_API_KEY` is server-side only.

### 3. Database

In the Supabase SQL editor, run the entire [`supabase/schema.sql`](supabase/schema.sql).
It creates all tables, enums, RLS policies, triggers, and storage policies.

### 4. Storage buckets

In the Supabase Storage dashboard, create:

- `avatars` → **public**
- `resumes` → **private**

Then run the storage-policy section at the bottom of `schema.sql` (it's included in the file).

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000.

### 6. Promote your admin

Sign up with your `ADMIN_EMAIL`, then run in the SQL editor (also at the bottom of `schema.sql`):

```sql
update user_roles set role = 'super_admin'
where user_id = (select id from auth.users where email = 'you@example.com');

update profiles set status = 'active'
where id = (select id from auth.users where email = 'you@example.com');
```

Log in → you'll be routed to `/admin`.

---

## Adding a new theme

1. Create `components/themes/<slug>/PortfolioLayout.tsx` following the
   `PortfolioData` props contract (`{ profile, projects, skills }`).
   Respect every `profile.show_*` visibility flag.
2. Register the slug in [`lib/themes.ts`](lib/themes.ts).
3. Insert a row into the `themes` table (or add it via the admin Settings page).

No changes to user data or other code are needed.

---

## Project structure

```
app/
  (auth)/login, signup          Auth pages
  (user)/dashboard/*            User dashboard (profile, projects, skills, resume, theme, visibility)
  (admin)/admin/*               Admin dashboard (users, pending, user/[id], settings)
  [username]/                   Public portfolio (SSR, dynamic theme)
  pending/                      Awaiting-approval screen
  api/                          Upload, contact, resume signed-URL, and admin action routes
components/
  auth/ user-dashboard/ admin-dashboard/   UI
  themes/classic|minimal|bold/  Theme layouts
  themes/shared/                ContactForm, ResumeButton
  icons/                        Brand SVGs
lib/
  supabase/                     Browser + server + service clients
  themes.ts                     Theme registry
  resend.ts                     Email templates
  admin-auth.ts admin-data.ts   Admin helpers
proxy.ts                        Auth/route gating (formerly middleware)
supabase/schema.sql             Full DB schema + policies
```

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo on vercel.com.
3. Add all six env vars for Production, Preview, and Development.
4. Push to `main` to auto-deploy.

> Notes: this project runs on a newer Next.js where `params`/`cookies` are async and the
> route-gating file is `proxy.ts` (the renamed `middleware`). Brand icons are provided as
> local SVGs in `components/icons/Brand.tsx` since this `lucide-react` build omits them.
