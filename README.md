# Custom Auth Integration with RTK Query, Next.js, and TypeScript

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)
![License](https://img.shields.io/badge/license-MIT-green)

This project is a production-style authentication frontend built with Next.js App Router, TypeScript, Redux Toolkit, RTK Query, React Hook Form, Zod, and Tailwind CSS.

It covers the complete authentication flow:

- Signup with OTP verification
- Login with automatic OTP redirect for unverified users
- Forgot password → OTP verification → Reset password
- Protected homepage (route protection)
- Edit profile
- Update password
- Automatic access-token refresh (RTK Query retry mechanism)
- Clean auth state management (Redux + Storage sync)
- Public & Protected route handling
- Scalable OTP flow handling (signup & forget)

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Redux Toolkit and RTK Query
- React Redux
- React Hook Form
- Zod validation
- Tailwind CSS 4
- next-themes
- react-hot-toast

## Backend Integration

This frontend is designed to work with the following backend:

👉 [Node.js Auth Backend](https://github.com/Shayan197/nodejs-boilerplate)

Make sure the backend is running on http://localhost:3035 before starting the frontend.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set your backend auth API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3035/api/auth
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Auth Flow

The app uses RTK Query for API calls and a custom base query for token refresh.

- Public endpoints do not receive the Bearer token.
- Protected endpoints receive the current access token from Redux state.
- If a protected request returns `401`, the refresh token is used to request a fresh access token.
- If refresh succeeds, the failed request is retried once.
- If refresh fails because the refresh token is expired or invalid, the session is expired and the user is redirected to login.

## Token Storage Strategy

Because the backend does not currently set HttpOnly cookies, the frontend has to manage tokens.

Current implementation:

- Access token: stored in Redux memory and mirrored in `sessionStorage`.
- Refresh token: stored in `localStorage` because it must survive page reloads.
- OTP and password-reset workflow state: stored in `sessionStorage` so it stays tab-scoped and is cleared after the flow finishes.
- App startup: if the access token is still valid, Redux is restored from storage; otherwise the refresh token is used to get a new access token.
- Logout/session expiry: all auth and temporary OTP/reset storage is cleared.

This is safer than storing both access and refresh tokens permanently in `localStorage`, but it is still not as secure as HttpOnly cookies because JavaScript-accessible storage can be read if an XSS bug exists.

Best backend-backed option:

- Backend sets the refresh token in an HttpOnly, Secure, SameSite cookie.
- Frontend keeps the access token only in memory.
- Refresh endpoint reads the cookie and returns a short-lived access token.
- Logout endpoint clears the refresh cookie server-side.

Until the backend supports cookies, keep access tokens short-lived, rotate refresh tokens, enforce strong Content Security Policy, avoid unsafe HTML rendering, and never store tokens in Redux Persist.

## Code Quality

- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks

This ensures clean and consistent code before every commit.

## Project Structure

```text
src/app/(auth)        Public auth pages
src/app/(protected)   Protected pages
src/components        Shared UI components
src/redux             Store, slices, RTK Query API
src/types             Shared TypeScript contracts
src/utils             Auth storage, validation, token, and API helpers
```

## Environment Variables

| Variable                   | Purpose                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend auth API. Example: `http://localhost:3035/api/auth` |

`NEXT_PUBLIC_` is required because RTK Query calls run in client components.

## Verification

The project should pass:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## Support

If you found this project helpful:

**If you like this project, feel free to star the repository!**

---

## Author

**Muhammad Shayan Bukhari**
Frontend Developer — React | Next.js | TypeScript

---

## License

MIT License

---
