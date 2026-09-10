# ✨ Blogora Frontend

[![Next.js](https://img.shields.io/badge/Next.js-v16.3.1-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19.2.8-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9.3-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2.12.0-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-v13.1.1-black.svg?logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

A sleek, responsive, and feature-rich frontend client for **Blogora** — a modern multi-author publishing and blogging community. Built with **Next.js 16 App Router (Turbopack), React 19, Tailwind CSS 4, and Redux Toolkit**, offering fluid user experiences, instant dark/light mode toggling, type-safe forms, and micro-interactions.

---

## 📑 Table of Contents
- [User Experience & Highlights](#-user-experience--highlights)
- [Tech Stack & Ecosystem](#-tech-stack--ecosystem)
- [Core Features](#-core-features)
- [Application Architecture](#-application-architecture)
- [Folder Structure](#-folder-structure)
- [State Management & RTK Query](#-state-management--rtk-query)
- [Form Validation & Type Safety](#-form-validation--type-safety)
- [Theme Engine (Dark / Light Mode)](#-theme-engine-dark--light-mode)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)

---

## 🎨 User Experience & Highlights

* **Next.js 16 Turbopack & React 19:** Ultra-fast page rendering, Server & Client component segregation, and sub-second Fast Refresh.
* **Fluid Framer Motion Micro-Interactions:** Smooth page transitions, stagger effects on article grids, and interactive button feedback.
* **Dark / Light Dynamic Theme:** Built using `next-themes` and Tailwind CSS 4, guaranteeing persistent theme memory without layout shifts or flashing.
* **Granular Route Protection:** Custom Next.js Route Groups `(auth)` and `(protected)` enforcing secure navigation guards for authenticated creators and administrators.
* **Responsive Across Devices:** Pixel-perfect adaptive layouts optimized for mobile smartphones, tablets, laptops, and ultra-wide displays.

---

## 🛠 Tech Stack & Ecosystem

| Layer | Library / Framework |
| :--- | :--- |
| **Framework & Engine** | Next.js 16.3.1 (App Router, Turbopack) |
| **UI Library** | React 19.2.8 & React-DOM 19 |
| **Language** | TypeScript v5.9.3 |
| **Styling** | Tailwind CSS v4.3.3 & PostCSS |
| **Global State & API** | Redux Toolkit (RTK Query), Redux Persist |
| **Animations** | Framer Motion v13.1.1 |
| **Form Handling** | React Hook Form v7.85 + Zod v4.4.3 |
| **Theming** | `next-themes` v0.4.6 |
| **Notifications & Icons** | React Hot Toast, React Icons |
| **Code Hygiene** | ESLint v9, Prettier, Husky, Commitlint |

---

## ⚡ Core Features

### 1. Reader & Exploration Suite
* **Interactive Landing Page:** Curated hero section, trending articles showcase, and topic highlights.
* **Story Reader (`/story/[slug]`):** Clean typography for long-form reading, reading time estimates, dynamic like counter, and author bio badges.
* **Exploration & Discovery:** Dynamic filtering across categories (`/category/[slug]`), tags (`/tag/[slug]`), and author portfolios (`/author/[id]`).
* **Nested Commenting & Discussion:** Real-time engagement threads allowing authenticated community members to comment and debate.

### 2. Creator Studio & Publishing Workflow
* **Article Publisher (`/publish`):** Rich article composer with cover image uploads, SEO slug generation, category selectors, and custom tag creation.
* **Draft & Live Toggle:** Instant publication status toggles allowing creators to save drafts or publish directly to the global feed.
* **Article Management (`/edit/[slug]`):** Real-time updating of story content, titles, and publication parameters.

### 3. Authentication & Account Management
* **Dual-Step Authentication:** Registration with automated 6-digit OTP verification.
* **Credential Recovery:** Forgot password workflow with timed OTP verification and password reset.
* **Author Profile Studio (`/editprofile`):** Update personal avatars, display name, bio, and social portfolio handles.
* **Activity Center (`/notifications`):** Live notification center tracking claps, likes, comments, and system announcements.

---

## 📐 Application Architecture

```
                       +----------------------------------+
                       |      Root Layout (App Router)    |
                       |   - ThemeProvider (next-themes)  |
                       |   - Redux Provider (RTK + Store) |
                       |   - Toast Notification Container |
                       +-----------------+----------------+
                                         |
            +----------------------------+----------------------------+
            |                                                         |
            v                                                         v
   +--------------------+                                   +--------------------+
   |   Public Routes    |                                   |  Protected Routes  |
   |  - / (Home)        |                                   |  - /publish        |
   |  - /story/[slug]   |                                   |  - /dashboard      |
   |  - /category/...   |                                   |  - /editprofile    |
   |  - /explore        |                                   |  - /notifications  |
   +--------------------+                                   |  - /admin          |
                                                            +---------+----------+
                                                                      |
                                                               (Token Guard)
                                                                      |
                                                                      v
                                                            +--------------------+
                                                            |  RTK Query Layer   |
                                                            |  - BaseQuery       |
                                                            |  - Token Refresh   |
                                                            |  - Cache Tagging   |
                                                            +--------------------+
```

---

## 📁 Folder Structure

```plaintext
blogora-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, Signup, OTP Verify, Reset Password
│   │   ├── (protected)/        # Dashboard, Publish, Edit, Notifications, Admin
│   │   ├── story/[slug]/       # Full article reader page
│   │   ├── category/[slug]/    # Category-filtered articles
│   │   ├── tag/[slug]/         # Tag-filtered articles
│   │   ├── author/[id]/        # Author profile view
│   │   ├── layout.tsx          # Master layout with providers
│   │   ├── providers.tsx       # Redux, PersistGate, NextThemes wrapper
│   │   └── globals.css         # Global design tokens & Tailwind 4 imports
│   ├── assets/                 # SVGs, webp banners, icons
│   ├── components/             # Reusable UI component library
│   │   ├── auth/               # Auth form cards & OTP inputs
│   │   ├── common/             # Navbar, Footer, Cards, Loaders
│   │   └── ui/                 # Buttons, Modals, Badges, Input fields
│   ├── constants/              # App constants, routes, navigation config
│   ├── hooks/                  # Custom React hooks
│   ├── redux/                  # State management store & RTK services
│   │   ├── features/           # Slices: authSlice, otpSlice, counterSlice
│   │   ├── services/           # RTK Query APIs (Auth, Blogs, Comments, etc.)
│   │   └── store.ts            # Configured Redux store with persistence
│   ├── types/                  # TypeScript domain models & DTOs
│   └── utils/                  # Cookie management, JWT parsers, formatters
├── public/                     # Static media & favicons
├── package.json
└── tsconfig.json
```

---

## 🔄 State Management & RTK Query

* **RTK Query API Slice:** Centralized network layer handling automatic caching, optimistic updates, and cache invalidation via tags (`['Blog', 'Comment', 'Notification', 'User']`).
* **Silent Token Refresher:** Built-in interceptor in `baseQuery.ts` detects expired `401 Unauthorized` responses, transparently dispatches a refresh request to `/api/auth/token-refresh`, and replays original requests seamlessly.
* **Persistent Sessions:** Redux Persist securely synchronizes user authentication state into browser storage with automated hydration.

---

## 📋 Form Validation & Type Safety

All forms across Blogora utilize **React Hook Form** paired with **Zod schema validation**:
```typescript
// Example: Strict typed validation
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
```
Benefits:
* Zero unnecessary component re-renders.
* Instant client-side validation feedback before hitting API endpoints.
* Automatic TypeScript type inference from schemas.

---

## 🌓 Theme Engine (Dark / Light Mode)

Blogora features an adaptive theme engine utilizing Tailwind CSS 4 CSS variables and `next-themes`:
* **System Preference Detection:** Automatically adheres to the user's OS dark/light mode preference.
* **Instant Manual Switcher:** Accessible theme toggler button in the navigation bar.
* **Zero Layout Shift / Flash:** Hydrated via client providers to ensure seamless SSR compatibility.

---

## 💻 Getting Started & Local Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (version 20.x or higher)
* Backend API running at `http://localhost:5000` (or configured API domain)

### 2. Clone & Install
```bash
cd blogora-frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of `blogora-frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application with Turbopack instant reloading.

---

## 🧪 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Launches Next.js dev server with Turbopack |
| **Production Build** | `npm run build` | Compiles and optimizes the web application |
| **Production Start** | `npm start` | Boots the optimized production build |
| **Linting** | `npm run lint` | Inspects code for syntax and style violations |

---

## 👨‍💻 Author
**Shayan Bukhari**  
* Full-Stack Software Engineer  
* GitHub: [@shayanbukhari](https://github.com/Shayan197/)
