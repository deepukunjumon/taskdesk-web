# TaskDesk Web

React 19 + TypeScript SPA for TaskDesk. Phase 1 scope: architectural skeleton only (login, protected
shell, role-aware routing). Feature modules under `src/features/*` are intentionally empty scaffolds.

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 + shadcn/ui (`button`, `input`, `card`, `table`, `sonner`)
- Zustand (state)
- React Router
- Axios

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

   `VITE_API_BASE_URL` must point at the running `taskdesk-api` backend (default
   `http://127.0.0.1:8000/api`).

3. Run the dev server:

   ```bash
   npm run dev
   ```

   The app is served at `http://localhost:5173`. This must match `CORS_ALLOWED_ORIGINS` in the
   backend's `.env`.

## Test users

Seeded by the backend (`php artisan db:seed`), all with password `password`:

| Email                    | Role       |
| ------------------------ | ---------- |
| superadmin@taskdesk.test | superadmin |
| admin@taskdesk.test      | admin      |
| employee@taskdesk.test   | employee   |

## Scripts

```bash
npm run dev            # start dev server
npm run build           # type-check and build for production
npm run lint             # run ESLint
npm run format           # run Prettier (write)
npm run format:check     # run Prettier (check only)
```

## Architecture

```
src/
  api/          axios instance (client.ts) + one typed module per resource (auth.ts, ...)
  components/
    ui/         shadcn components
    layout/     AppShell, Sidebar, Header (role-aware)
  features/     feature-based folders, empty scaffolds until their phase is built
  hooks/
  stores/       Zustand stores (authStore holds user + token)
  types/        shared TypeScript types
  pages/        route-level components
  routes/       router config + RequireAuth / RequireRole guards
  lib/          utils, constants
```

Auth flow: `authStore` persists the Sanctum bearer token in `localStorage` and attaches it to every
request via an axios interceptor. A 401 response clears the token and redirects to `/login`.
`RequireAuth` gates the whole authenticated route tree; `RequireRole` gates individual routes
(currently `reports` for `admin`/`superadmin`, `admin` for `superadmin` only) and the sidebar filters
nav items by the current user's role.
