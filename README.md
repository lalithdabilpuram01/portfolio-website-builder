<div align="center">

# 🎨 Portfolic

**Build a stunning, professional portfolio website in minutes — no code required.**

Pick a theme, fill in your details, and your portfolio goes live at `yoursite.com/your-username`.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Features

- **🎭 Three interactive themes** — *Classic*, *Minimal*, and *Bold*, with scroll animations, hover effects, mouse-reactive gradients, and animated skill bars. Switch instantly.
- **📝 Rich content sections** — Profile, Experience, Education, Certificates, Projects (drag-to-reorder), Skills, and Resume (PDF).
- **🔒 Per-field privacy controls** — Toggle the visibility of every social link, email, location, and resume.
- **👤 Custom URL** — Your portfolio lives at `/your-username`, server-rendered and theme-aware.
- **🛡️ Admin dashboard** — Stats, searchable user table, approval queue, per-user detail with audit log, role management, password resets, CSV export, and an editable landing page.
- **✅ Approval workflow** — New signups stay `pending` until an admin approves them.
- **🔑 Full auth** — Sign up, login, email confirmation, and forgot/reset password.
- **📨 Email** — Signup, approval, suspension, reinstatement, and contact-form messages via Resend.
- **📄 Secure uploads** — Avatars and resumes stored in Supabase Storage with RLS.
- **🧩 Pluggable theme system** — Add a new theme without touching user data.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database & Auth | [Supabase](https://supabase.com/) — Postgres, Auth, Storage, Row-Level Security |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Email | [Resend](https://resend.com/) |
| Icons | [Lucide](https://lucide.dev/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/lalithdabilpuram01/portfolic.git
cd portfolic
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com/).
2. In the **SQL Editor**, run the full schema from [`supabase/schema.sql`](supabase/schema.sql) — it creates all tables, enums, RLS policies, triggers, and storage policies.
3. In **Storage**, create two buckets:
   - `avatars` → **Public**
   - `resumes` → **Private**
4. In **Authentication → URL Configuration**, set the **Site URL** and add `http://localhost:3000/**` to the redirect URLs.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=you@example.com
```

> `NEXT_PUBLIC_*` keys are browser-safe. `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are server-side only.

### 4. Create the first admin

Sign up through the app, then run this in the Supabase SQL Editor (replace the email):

```sql
update user_roles set role = 'super_admin'
where user_id = (select id from auth.users where email = 'you@example.com');

update profiles set status = 'active'
where id = (select id from auth.users where email = 'you@example.com');
```

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📂 Project Structure

```
app/
  (auth)/                 login, signup, forgot/reset password
  (user)/dashboard/*      profile, experience, education, certificates, projects, skills, resume, theme, visibility
  (admin)/admin/*         users, pending queue, user/[id], settings
  [username]/             public portfolio (SSR, dynamic theme)
  api/                    uploads, contact, resume signed-URL, admin actions
  page.tsx                landing page
components/
  auth/                   auth forms
  user-dashboard/         dashboard editors
  admin-dashboard/        admin UI
  themes/classic|minimal|bold/   theme layouts
  themes/shared/          ContactForm, ResumeButton
lib/
  supabase/               browser + server + service clients
  themes.ts               theme registry
  resend.ts               email templates
  url.ts                  external-link helper
proxy.ts                  auth/route gating (renamed middleware)
supabase/schema.sql       full DB schema + policies
```

---

## 🎨 Adding a New Theme

1. Create `components/themes/<slug>/PortfolioLayout.tsx` following the `PortfolioData` props contract, respecting every `profile.show_*` flag.
2. Register the slug in [`lib/themes.ts`](lib/themes.ts).
3. Insert a row into the `themes` table (or add it from the admin Settings page).

No changes to user data or other code are needed.

---

## ☁️ Deployment

Deploy on [Vercel](https://vercel.com/):

1. Push the repo to GitHub and import it into Vercel.
2. Add the environment variables (point them at your **production** Supabase project).
3. After the first deploy, set `NEXT_PUBLIC_APP_URL` to your live URL and redeploy.
4. In Supabase → **Authentication → URL Configuration**, add your production URL and `https://yourapp.vercel.app/**` to the redirect URLs.

> This project runs on a newer Next.js where `params`/`cookies` are async and the route-gating file is `proxy.ts` (the renamed `middleware`).

---

## 🤝 Contributing

This is an **open source project and contributions are always welcome!** Whether it's a bug fix, a new theme, or a feature idea:

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-idea`)
3. Commit your changes
4. Open a Pull Request

Found a bug or have an idea? [Open an issue](../../issues) — let's connect!

---

## 📜 License

Released under the [MIT License](LICENSE). Feel free to use, modify, and share.

---

<div align="center">

Built with ❤️ by **Lalith Dabilpuram**

</div>
