# 🏥 Murugan Physiotherapy Clinic (முருகன் பிசியோதெரபி கிளினிக்)

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest_36_Passed-success?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> A modern, full-stack, enterprise-grade healthcare web application and administrative portal engineered for **Murugan Physiotherapy Clinic** in Kilkodungalur, Vandavasi, Tamil Nadu. Led by **Dr. G. Murugan, M.P.T. (Ortho), B.P.T., MIAP**.

---

## 📑 Table of Contents

- [Overview & Clinic Information](#-overview--clinic-information)
- [Key Features](#-key-features)
  - [Patient Experience (Frontend)](#patient-experience-frontend)
  - [Administrative Portal (Backend & CMS)](#administrative-portal-backend--cms)
  - [Mobile Hero Half-Round Stream](#mobile-hero-half-round-stream)
  - [3D Coverflow Gallery](#3d-coverflow-gallery)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Seeding & Admin Setup](#database-seeding--admin-setup)
  - [Running the Application](#running-the-application)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [API Routes Reference](#-api-routes-reference)
- [SEO & Structured Data](#-seo--structured-data)
- [Security & Performance Engineering](#-security--performance-engineering)
- [Deployment](#-deployment)
- [Author & Credits](#-author--credits)

---

## 🏥 Overview & Clinic Information

**Murugan Physiotherapy Clinic** provides specialized orthopaedic physiotherapy, stroke & paralysis rehabilitation, joint mobilization, electrotherapy, and certified home visit healthcare.

- **Founder & Head Physiotherapist:** Dr. G. Murugan, M.P.T. (Orthopaedics), B.P.T., MIAP
- **Clinical Experience:** 10+ Years of Excellence in Orthopaedic Rehabilitation
- **Clinic Address:** No. 343, Badhur Road, Opposite Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Vandavasi Taluk, Tiruvannamalai District, Tamil Nadu
- **Consultation Hours:** Monday – Saturday: 5:30 PM – 8:30 PM (Sunday Holiday)
- **Home Visit Service:** Available for bedridden, elderly, and post-surgery patients across Vandavasi and surrounding areas
- **Phone / WhatsApp:** [+91 97863 14138](tel:+919786314138)
- **Official Email:** [senthilragunathan2004@gmail.com](mailto:senthilragunathan2004@gmail.com)

---

## ✨ Key Features

### Patient Experience (Frontend)

- **Bilingual Interface:** Full English & Tamil (தமிழ்) language switching throughout all pages, titles, descriptions, and buttons.
- **Intelligent Appointment Booking:**
  - Real-time time-slot availability engine (`/api/appointments/availability`).
  - Strict prevention of double-booking per doctor schedule.
  - Automated patient record management and visit reason tracking.
  - Instant email confirmations powered by Nodemailer.
  - One-tap WhatsApp chat confirmation.
- **Specialized Treatment Showcases:** Neck Pain, Back Pain & Sciatica, Frozen Shoulder, Knee Arthritis, Stroke & Paralysis Rehabilitation, Facial Palsy, and Post-Operative Care.
- **Interactive AI Physiotherapy Chatbot:** Integrated assistant helping patients understand symptoms, treatments, clinic timings, and booking directions.
- **Verified Patient Reviews:** Authenticated patient testimonials with star ratings and treatment feedback.
- **Educational Medical Blog:** Articles on orthopaedic wellness, ergonomic postures, and exercise therapy.

### Administrative Portal (Backend & CMS)

Access route: `/admin` (Secured via NextAuth.js credentials provider):

- **Dashboard Overview:** Metric cards for total appointments, patient count, revenue tracking, and weekly trends.
- **Appointments Management:** Filter, search, and change appointment statuses (`Pending`, `Confirmed`, `Completed`, `Cancelled`) with automated email triggers.
- **Electronic Health Records (Patients):** Full patient directory (`/admin/patients`) with profile views (`/admin/patients/[id]`), appointment history, notes, and direct email communication.
- **Doctor Schedule Management:** Manage doctor profiles, qualifications, consulting slots, and vacation toggles.
- **Service Catalog Manager:** Add, edit, or delete treatments with custom icons and service descriptions.
- **Testimonial Moderation:** Review and approve patient feedback before publishing.
- **Blog Publisher:** Rich blog creator with image uploads and SEO meta configurations.
- **Gallery Manager:** Manage clinical photos with direct ImageKit CDN upload.
- **Contact Inbox:** Message manager with one-click direct email reply modal.
- **Clinic Profile & Settings (`/admin/settings`):**
  - Branding: Logo, Favicon, and Desktop Hero Banner.
  - **Mobile Hero Scrolling Showcase Manager:** Dedicated tool to curate, order, and caption the half-round mobile stream.
  - Coordinates: Phone, WhatsApp, Maps URL, Working Hours, and Social Media links.
  - SEO Variables: Meta title, description, keywords, and OpenGraph image.

### Mobile Hero Half-Round Stream

- Specifically rendered on mobile devices (`lg:hidden`) in the hero section to replace blank vertical space.
- Architectural **half-round arch dome silhouette** (`rounded-t-[68px] rounded-b-[20px]`).
- Scaled and centered display with dedicated bottom clearance so graphics never hide behind captions.
- Continuous, hardware-accelerated infinite marquee loop (`animate-hero-scroll`) with pause-on-touch interaction.
- Managed entirely via the Admin Settings portal.

### 3D Coverflow Gallery

- Realistic coverflow carousel with 3D perspective (`rotateY`, `scale`, depth z-indexing).
- Responsive card sizing tuned across Mobile (310px–335px), Tablet (370px), Desktop (410px), and Large Desktop (440px).
- Full touch swipe and drag physics via Framer Motion, with circular wrap-around navigation and full-screen lightbox modal.

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
  User[Patient / Client] --> NextApp[Next.js 15 App Router]
  Admin[Clinic Administrator] --> AdminPanel[Secured /admin Dashboard]

  subgraph Frontend Layer
    NextApp --> Hero[Hero with Mobile Arch Marquee]
    NextApp --> Booking[Smart Booking Engine]
    NextApp --> Gallery[3D Coverflow Gallery]
    NextApp --> Chatbot[AI Clinic Chatbot]
  end

  subgraph API & Backend
    AdminPanel --> Auth[NextAuth.js Auth]
    Booking --> BookingAPI[/api/appointments]
    AdminPanel --> SettingsAPI[/api/settings]
    AdminPanel --> ImageKitAPI[/api/imagekit]
    BookingAPI --> RateLimit[Upstash Redis Rate Limiting]
    BookingAPI --> EmailService[Nodemailer SMTP]
  end

  subgraph Data & Cloud Services
    Auth --> MongoDB[(MongoDB Database)]
    BookingAPI --> MongoDB
    SettingsAPI --> MongoDB
    ImageKitAPI --> ImageKitCDN[(ImageKit Edge CDN)]
  end
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.0.3 (App Router) | Server components, ISR (300s), route handlers |
| **Language** | TypeScript 5.6 | Strict end-to-end type safety |
| **UI Styling** | Tailwind CSS 3.4 & CSS Variables | Responsive design system, glassmorphism, animations |
| **Animations** | Framer Motion 11 & GPU Marquee | 3D coverflow physics, touch gestures, infinite loop |
| **Database** | MongoDB & Mongoose 8.8 | Structured models for settings, appointments, doctors, patients |
| **Authentication** | NextAuth.js 4.24 & Bcrypt.js | JWT session strategy, password hashing |
| **Rate Limiting** | Upstash Redis (`@upstash/ratelimit`) | Anti-abuse protection on public booking and contact APIs |
| **Media Hosting** | ImageKit SDK | Client-side compression, automated WebP/AVIF delivery |
| **Validation** | Zod 3.23 | Strict request body parsing, mass-assignment guards |
| **Testing** | Vitest 2.1 & Playwright | Fast unit tests and end-to-end browser automation |

---

## 📁 Project Directory Structure

```text
├── public/                     # Static media assets (logo, fallback banner)
├── scripts/                    # Maintenance & migration scripts
│   ├── migrate-patients.mjs    # Patient history migration tool
│   ├── migrate-to-murugan-clinic.mjs # Database seeder for Dr. Murugan clinic
│   └── reset-admin.mjs         # Admin credential reset CLI
├── src/
│   ├── app/                    # Next.js 15 App Router pages & APIs
│   │   ├── (public)/           # Public views (page, services, gallery, blogs, contact, faqs)
│   │   ├── admin/              # Admin control panel (appointments, patients, settings, etc.)
│   │   ├── api/                # REST endpoints (appointments, settings, imagekit, reviews, etc.)
│   │   ├── globals.css         # Custom animations, color variables, typography
│   │   ├── layout.tsx          # Root layout with fonts, layout wrapper, and metadata
│   │   ├── robots.ts           # Dynamic robots.txt generator
│   │   └── sitemap.ts          # Dynamic XML sitemap generator
│   ├── components/             # Reusable UI components
│   │   ├── Hero.tsx            # Main hero with mobile half-round infinite marquee
│   │   ├── GalleryGrid.tsx     # 3D Coverflow gallery carousel with lightbox
│   │   ├── BookingForm.tsx     # Step-by-step smart booking component
│   │   ├── ImageUploader.tsx   # Canvas compressed ImageKit uploader
│   │   ├── Chatbot.tsx         # AI clinic assistant
│   │   └── ...                 # Doctors, Services, Testimonials, About, Navbar, Footer
│   ├── lib/                    # Core utilities & services
│   │   ├── api/                # Zod schemas, auth helpers, error handlers
│   │   ├── db.ts               # Cached MongoDB connection handler
│   │   ├── email.ts            # Nodemailer SMTP transporter
│   │   ├── rateLimit.ts        # Upstash Redis rate limiter
│   │   ├── seo.ts              # JSON-LD Schema.org structured data generators
│   │   └── translations.ts     # Complete English & Tamil i18n dictionaries
│   └── models/                 # Mongoose database schemas
│       ├── Appointment.ts      # Bookings with status and doctor links
│       ├── ClinicSettings.ts   # Clinic coordinates, branding, and mobile hero images
│       ├── Doctor.ts           # Doctor profiles and consultation hours
│       ├── Patient.ts          # Patient health records & appointment timeline
│       └── ...                 # BlogPost, Review, Service, FAQ, ContactMessage
└── tests/
    ├── e2e/                    # Playwright end-to-end test specs
    └── unit/                   # Vitest unit test suites (schemas, slots, ratelimit)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.18+ or v20+
- **npm** or **yarn** or **pnpm**
- **MongoDB:** Local database instance or MongoDB Atlas cluster URI
- **ImageKit Account:** Free or paid tier for cloud image hosting (optional for local dev)

### Installation

```bash
# Clone the repository
git clone https://github.com/senthilnathan-2004/muruganphysiotherapyclinic.git

# Navigate into the project directory
cd muruganphysiotherapyclinic

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory and configure the variables:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/murugan_clinic?retryWrites=true&w=majority

# NextAuth Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_generated_key_here

# Initial Admin Credentials
ADMIN_EMAIL=senthilragunathan2004@gmail.com
ADMIN_PASSWORD=your_secure_admin_password

# ImageKit (Media CDN)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_id

# SMTP Email Dispatch (Gmail / AWS SES / SendGrid)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Murugan Physiotherapy Clinic <noreply@muruganphysio.com>"

# Upstash Redis Rate Limiting (Optional - Falls back to in-memory)
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Public Clinic Metadata
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Seeding & Admin Setup

To seed the initial clinic settings, services, doctors, and setup the admin account:

```bash
# Seed initial clinic profile, doctor data, and treatments
node scripts/migrate-to-murugan-clinic.mjs

# Reset or create the initial Administrator account
npm run admin:reset
```

### Running the Application

```bash
# Start Next.js development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.  
Access the Admin Dashboard at **[http://localhost:3000/admin](http://localhost:3000/admin)**.

---

## 🧪 Testing & Quality Assurance

The codebase includes comprehensive unit testing via **Vitest** and end-to-end testing via **Playwright**:

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run Playwright end-to-end suite
npm run test:e2e
```

### Test Coverage Highlights:
- **`schemas.test.ts`:** Validates Zod schemas against mass-assignment attacks, strips unwanted keys, and checks object/string flexibility for `heroMobileImages`.
- **`slots.test.ts`:** Validates clinic schedule intervals, holiday exclusions, and overlapping appointment collision checks.
- **`ratelimit.test.ts`:** Verifies rate-limit sliding windows and blocking behavior.
- **`validation.test.ts` & `errors.test.ts`:** Tests API error handling formats and sanitized error logs.

---

## 🌐 API Routes Reference

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | Public | Fetches clinic profile, contact, hours, and mobile hero cards |
| `PUT` | `/api/settings` | Admin | Updates clinic profile, SEO, branding, and mobile showcase |
| `GET` | `/api/appointments/availability` | Public | Queries open consultation slots for a doctor on a specific date |
| `POST` | `/api/appointments` | Rate Limited | Books a new appointment, creates patient record, sends email |
| `GET` | `/api/doctors` | Public | Lists all active clinical specialists and consultation hours |
| `POST` | `/api/doctors` | Admin | Creates a new doctor profile |
| `GET` | `/api/services` | Public | Fetches treatment options with icons and descriptions |
| `POST` | `/api/gallery` | Admin | Adds photo to 3D gallery with category and caption |
| `POST` | `/api/imagekit` | Admin | Uploads canvas-compressed image to ImageKit CDN |
| `POST` | `/api/contact` | Rate Limited | Submits patient inquiry message |
| `POST` | `/api/contact/reply` | Admin | Sends email response directly from admin inbox |

---

## 🔍 SEO & Structured Data

Engineered with complete Schema.org JSON-LD structured data in [`src/lib/seo.ts`](src/lib/seo.ts):

- **MedicalClinic & Organization Schema:** Official address, telephone, opening hours, GeoCoordinates, and social links.
- **Physician Schema:** Declares Dr. G. Murugan as Chief Physiotherapist with M.P.T. (Ortho) qualifications and hospital affiliations.
- **FAQPage Schema:** Exposes rich FAQ snippets directly to Google search results.
- **Automated OpenGraph & Twitter Cards:** Dynamic metadata tags for Facebook, WhatsApp, and Twitter link previews.
- **Sitemap & Robots:** Automatically generated XML sitemap (`/sitemap.xml`) updated with dynamic blog slugs.

---

## 🛡️ Security & Performance Engineering

- **No Mass Assignment:** All update routes (`/api/settings`, `/api/doctors`, etc.) use strict Zod parsing to strip internal fields (`_id`, `__v`, `createdAt`, `role`).
- **Rate Limiting:** Protects `/api/appointments` and `/api/contact` against spam bots and brute-force attempts.
- **Input Sanitization & Focus Trapping:** WCAG 2.1 compliance with keyboard trapping (`useFocusTrap`) in all modals and lightbox galleries.
- **Canvas Image Compression:** All admin uploads are resized and compressed on the client before being dispatched to the CDN, saving bandwidth.
- **Zero-Shift 60 FPS Animations:** CSS keyframes use `translate3d` and `will-change: transform` to run on the GPU, avoiding main-thread layout thrashing.

---

## 🚢 Deployment

### Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Set the Framework Preset to **Next.js**.
4. Configure all environment variables from `.env`.
5. Deploy!

The repository includes a ready-to-use [`vercel.json`](vercel.json) configuring region routing and headers.

---

## 👨‍⚕️ Author & Credits

- **Chief Physiotherapist:** Dr. G. Murugan, M.P.T. (Ortho), B.P.T., MIAP
- **Engineering & Development:** Antigravity AI Engineering Team
- **Clinic:** Murugan Physiotherapy Clinic, Kilkodungalur, Tamil Nadu

---

<p align="center">
  <b>Restore Mobility • Relieve Pain • Revive Life</b><br>
  Murugan Physiotherapy Clinic © 2026. All Rights Reserved.
</p>
