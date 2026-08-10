# TaskDesk Web

React 19 + TypeScript SPA for TaskDesk.

- **Phase 1**: architectural skeleton — login, protected shell, role-aware routing.
- **Phase 2**: Task Register — list/filter/create/edit work items, detail drawer with timeline,
  constrained status transitions, and a "My Tasks" employee view.

Dashboard, Reports, Admin, Search, and Knowledge Base are still empty scaffolds under `src/features/*`.

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 + shadcn/ui
- Zustand (client/UI state) + TanStack Query (server state)
- React Hook Form + Zod (form validation)
- React Router
- Axios
- Vitest + React Testing Library

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

| Email                          | Role       | Department |
| --------------------------------- | ---------- | ---------- |
| superadmin@taskdesk.test       | superadmin | —          |
| admin@taskdesk.test            | admin      | IT Support |
| employee@taskdesk.test         | employee   | IT Support |
| financeadmin@taskdesk.test     | admin      | Finance    |
| financeemployee@taskdesk.test  | employee   | Finance    |

Use the Finance pair to verify department scoping — a Finance admin should not see IT Support's
work items, and vice versa.

## Scripts

```bash
npm run dev            # start dev server
npm run build           # type-check and build for production
npm run lint             # run ESLint
npm run format           # run Prettier (write)
npm run format:check     # run Prettier (check only)
npm run test             # run Vitest
```

## Architecture

```
src/
  api/          axios instance (client.ts) + one typed module per resource (auth.ts, workItems.ts, lookups.ts)
  components/
    ui/         shadcn components
    layout/     AppShell, Sidebar, Header (role-aware)
  features/
    work-register/  hooks (React Query), form schema (Zod), table/filters/detail/create/edit
                     components, StatusTransitionControl
  hooks/
  stores/       Zustand stores (authStore: user + token; uiStore: sidebar state)
  types/        shared TypeScript types
  pages/        route-level components (WorkRegisterPage, MyTasksPage, ...)
  routes/       router config + RequireAuth / RequireRole guards
  lib/          utils, constants
```

Auth flow: `authStore` persists the Sanctum bearer token in `localStorage` and attaches it to every
request via an axios interceptor. A 401 response clears the token and redirects to `/login`.
`RequireAuth` gates the whole authenticated route tree; `RequireRole` gates individual routes
(`work-register`/`reports` for `admin`/`superadmin`, `admin` for `superadmin` only) and the sidebar
filters nav items by the current user's role.

### Task Register

- `WorkItemsTable` is one reusable component driving both the full Task Register (admin/superadmin,
  with department/assignee filters) and "My Tasks" (all roles, pre-filtered to the current user) —
  filtering is done via a prop, not a duplicated component.
- **The frontend holds no permission or workflow rules of its own — every `WorkItem` from the API
  carries the data that drives the UI:**
  - `item.permissions.{can_update,can_update_status,can_reassign,can_delete}` — gates the
    Edit/Reassign/Delete controls and the status-update section directly; there is no
    `permissions.ts` mirroring `WorkItemPolicy` client-side anymore.
  - `item.next_statuses` — fed straight into `StatusTransitionControl`, which is now a purely
    presentational component that renders whatever list it's given (see
    `StatusTransitionControl.test.tsx`).
  - `item.editable_fields` — `WorkItemEditForm` renders only the fields named in this array, so the
    same component serves an employee (`resolution`, `remarks` only) and an admin (the full field
    set) without any role branching in the frontend.
  - `user.abilities.can_create_work_items` (from `/api/me`) — gates the "Add New Task" button.
- Server state (work items, lookups) is managed with TanStack Query; mutations invalidate the
  relevant queries and surface errors/success via `sonner` toasts.

## Testing

```bash
npm run test
```

Covers the status-transition control rendering only valid next-states for each status (open → only
`in_progress`; in_progress → `pending`/`closed`; pending → `in_progress`/`closed`; closed → none),
and that selecting an option calls back with the chosen status.
