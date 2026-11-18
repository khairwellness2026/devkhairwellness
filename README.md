# KHAIR INTERNATIONAL — Production-Grade Healthcare Website & CMS

Complete production-ready web platform for **KHAIR International** (Kottakkal Heritage Ayurveda and Integrated Rehabilitation), built with **Next.js 15 App Router**, **Supabase PostgreSQL & Auth**, **Cloudinary Media Storage**, **Tailwind CSS**, and full **English, Hindi, and Arabic (RTL)** multilingual support.

---

## 1. Executive Summary & Design System

The platform reproduces the approved **KHAIR International** visual identity:
- **Deep Forest Green**: `#073D2C`
- **Dark Green**: `#052C21`
- **Botanical Green**: `#426B4E`
- **Champagne Gold**: `#C9A34A`
- **Warm Ivory**: `#FAF7EF`
- **Soft Beige**: `#EEE6D7`
- **Charcoal**: `#20251F`
- **Typography**: Cormorant Garamond (Editorial Serif), Inter (Clean Sans-Serif), Amiri (Arabic Calligraphy & Devanagari)

---

## 2. Page Architecture & Routing

### Public Website
- `/[locale]` — **Home Page**: Hero with authentic Ayurveda still life photography, Features pill bar (`01 Home Page`), Comprehensive Care for Your Complete Wellbeing (Departments grid), Why Choose KHAIR (`Care You Can Trust`), Meet Our Experts (Doctors grid), Gallery Preview (`A Glimpse of Our Centre`), and Consultation CTA banner with WhatsApp integration. *(Note: Strictly follows specification rule: no dedicated About section on the homepage).*
- `/[locale]/about` — **About Us Page**: Authentic narrative, brand story, healthcare philosophy, mission, vision, foundational pillars, and clinical infrastructure checklist.
- `/[locale]/departments` — **Departments Listing**: Grid of 6 clinical specialties.
- `/[locale]/departments/[slug]` — **Department Detail Pages**: In-depth clinical approach, key treatments checklist, pre-selected consultation booking form, and related departments.
  1. `ayurveda-treatments`
  2. `physiotherapy-rehabilitation`
  3. `naturopathy-yoga`
  4. `lifestyle-clinic`
  5. `advanced-ano-rectal-clinic`
  6. `occupational-therapy`
- `/[locale]/doctors` & `/[locale]/doctors/[slug]` — **Doctors Directory & Profile**: Qualifications, clinical experience, biography, and consultation booking.
- `/[locale]/gallery` — **Visual Gallery**: Interactive category filtering (Facilities, Treatments, Activities, Centre Ambience) with responsive image lightbox.
- `/[locale]/contact` — **Contact & Location**: Official phone numbers, WhatsApp, hospital address, Google Maps link, and full appointment booking system.
- `/[locale]/privacy-policy` & `/[locale]/terms-of-service` — **Legal Information**.

### Admin Dashboard & CMS
- `/admin/login` — Administrator authentication via Supabase Auth.
- `/admin/dashboard` — Live database metrics (appointments, enquiries, departments, doctors, gallery assets).
- `/admin/homepage` — Homepage CMS (hero headline, subtitle, image, CTAs, visibility toggles).
- `/admin/pages` — Narrative pages CMS (About, Contact, legal pages in all 3 languages).
- `/admin/departments` — Department CRUD with localized names, descriptions, and treatment checklists.
- `/admin/doctors` — Doctor CRUD with qualifications, experience, and department links.
- `/admin/gallery` — Gallery asset manager (categorization, captions, alt text, live/hidden toggle).
- `/admin/appointments` — Live appointment enquiry management (search, department/status filters, status progression: `New` -> `Contacted` -> `Confirmed` -> `Completed` -> `Cancelled`, and CSV export).
- `/admin/enquiries` — General contact messages manager.
- `/admin/media` — Central Cloudinary media library with folder organization.
- `/admin/settings` — Global business settings (phones, emails, WhatsApp, Google Maps link, addresses).
- `/admin/seo` — Localized SEO metadata and Open Graph tags.
- `/admin/users` — Role-based access control (`SUPER_ADMIN`, `ADMIN`, `EDITOR`).
- `/admin/logs` — Immutable administrative audit trail.

---

## 3. Supabase Database Setup & Seed

The complete database schema, row-level security (RLS), triggers, and verified seed data are provided in:
`supabase/setup_and_seed.sql`

### How to execute in Supabase:
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and navigate to **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Copy the entire contents of [supabase/setup_and_seed.sql](file:///c:/Users/muham/OneDrive/Desktop/Antigravity/khair-wellness/supabase/setup_and_seed.sql).
5. Paste and click **Run**.
6. All 26 tables, security policies, triggers, indexes, and full multilingual content (English, Hindi, Arabic) will be created idempotently.

### Supabase Administrator Bootstrap
1. Go to **Authentication > Users** in the Supabase Dashboard.
2. Click **Add User** -> **Create User**.
3. Email: `admin@khair.in`
4. Password: `KhairAdmin2026!` (or your chosen secure password).
5. Under `public.user_roles` or `public.profiles`, ensure the role is set to `SUPER_ADMIN`.

---

## 4. Cloudinary Setup

1. Sign in to your [Cloudinary Console](https://cloudinary.com/console).
2. Obtain your **Cloud Name**, **API Key**, and **API Secret**.
3. Create an upload preset named `khair_uploads` (or configure server-side signed uploads).
4. Add these credentials to your `.env.local`:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
5. Server-side upload signing is implemented in `/src/app/api/cloudinary/sign` to prevent exposing API secrets to the client.

---

## 5. Local Development & Production Build

### Install Dependencies:
```bash
npm install
```

### Run Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.

### Production Build:
```bash
npm run build
npm run start
```

