# Blogora Frontend — Agent Command Reference

A concise, professional cheatsheet and command reference for autonomous agents and developers working on the Blogora Frontend application.

---

## 🛠️ Essential Commands

### Development & Execution
```bash
# Start development server with Turbopack
npm run dev

# Compile Next.js production build
npm run build

# Start production server
npm start
```

### Code Quality & Validation
```bash
# Run ESLint validation
npm run lint

# Format codebase with Prettier
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"

# Check TypeScript types
npx tsc --noEmit
```

---

## 🧭 Super Admin Governance Console Architecture

- **Path**: `/admin` (Protected Route: `src/app/(protected)/admin/page.tsx`)
- **Access Guard**: Requires `currentUser?.role?.slug === 'super-admin'` or `'admin'`.
- **Sidebar Mechanism**:
  - Chrome-style hover rail (72px collapsed ➔ 260px expanded).
  - Pinned/Locked state toggled via `FiLock`/`FiUnlock` icon button.
  - State persisted across sessions in `localStorage.getItem('blogora_admin_sidebar_pinned')`.
- **Core Navigation Sections**:
  1. `dashboard`: Executive KPI cards + 12 Production-Grade Visual Charts.
  2. `verification`: Unverified / Pending OTP queue with 1-click manual verification.
  3. `users`: Master User Directory, search, multi-filter, dossier drawer, role mutation.
  4. `settings`: Universal platform controls, security rate limits, taxonomy governance.

---

## 📐 Strict UI Placement Rules

1. **Global Action Buttons**: Fixed in the **Right-Bottom Corner** (`fixed right-6 bottom-6 z-40`) as a floating action menu (Refresh Metrics, Export CSV, Scroll To Top).
2. **Table Action Buttons**: Located at the **Top-Right** of that specific table container (e.g. Export CSV, Refresh, Add).
3. **Filter Groups**: Placed at the **Top-Right** of the respective page/view header (Search bar, Role, Status, Gender, Timeframe).

---

## 🔐 Auth UI Security Standards

- **Theme Lock Icon**: Uses dynamic `bg-[var(--accent-primary)]` with soft glow matching the theme palette.
- **Password Masking & Shield**:
  - Permanent interactive eye toggle (`FiEye` / `FiEyeOff`).
  - Strict clipboard protection: Blocks plaintext copying, injects masked placeholder dots (`••••••••••••`), and displays security notice.

---

## 👑 Super Admin Credentials

- **Email**: `shayanbukhari12345@gmail.com`
- **Password**: `Asdf123@`
- **Role**: `super-admin`
