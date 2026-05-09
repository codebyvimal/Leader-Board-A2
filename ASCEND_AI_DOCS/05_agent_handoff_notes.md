# Agent handoff notes (ASCEND)

This doc summarizes the current implementation so another agent can quickly continue work.

## App routes (Next.js app router)

- `/`  
  Dashboard: roadmap (left) + leaderboard (right) + task modal.
- `/login`  
  UI-only login screen (no real auth yet).
- `/leaderboard`  
  Full-page leaderboard view.
- `/activity`  
  Activity feed view.
- `/profile`  
  “My profile” editor (public info + avatar + cover/thumbnail upload). Stores images locally.
- `/u/[handle]`  
  Public profile view. Currently resolves from mock data; supports both `handle` and (for activity links) `id` fallback.
- `/admin`  
  Admin “signup” (UI-only) + roadmap builder. Stores roadmap locally and dashboard uses it.
- `POST /api/admin/allowed`  
  Server route that checks Supabase `admin_emails` table to decide whether the Admin button is shown.

## Key UI components

- `src/components/Sidebar.tsx`
  - Nav: Roadmap, Leaderboard, Activity, Profile.
  - **Admin link is conditional**: it calls `POST /api/admin/allowed` with the locally stored admin email.
  - Sign out routes to `/login`.
- `src/components/Leaderboard.tsx`
  - Shows rankings.
  - **Top 3 have crowns** (different colors).
  - Each row links to `/u/[handle]`.
- `src/components/ActivityFeed.tsx`
  - Activity items link to `/u/[userId]` (works because public profile route tolerates id).
- `src/components/Roadmap.tsx` + `src/components/TaskDetailsModal.tsx`
  - Roadmap tasks open modal; proof submit is console-only (no backend yet).

## Mock data + types

File: `src/lib/data.ts`

- Types: `Task`, `Section`, `User`, `ActivityEvent`, `PublicProfile`
- `mockRoadmap`, `mockUsers`, `mockActivity`, `mockPublicProfile`
- `User` includes a `handle` field used for `/u/[handle]`.

## Local persistence (client-side)

- Roadmap is saved to localStorage so the Admin builder feeds the main dashboard.
  - File: `src/lib/roadmapStore.ts`
  - Key: `ascend:roadmap:v1`
  - `src/app/page.tsx` loads roadmap via lazy `useState(() => loadRoadmapFromStorage() ?? mockRoadmap)`

- Profile images (avatar + cover/thumbnail) stored as data URLs:
  - File: `src/app/profile/page.tsx`
  - Key: `ascend:profileMedia:v1`

- Admin “auth” (UI-only) stored locally:
  - Key: `ascend:adminAuth:v1`
  - Stored by: `src/app/admin/page.tsx` (email + isAuthed)
  - Read by: `src/components/Sidebar.tsx`

## Supabase admin gating (server-side check)

The Admin sidebar button is shown only when the locally stored admin email exists in Supabase.

- API route: `src/app/api/admin/allowed/route.ts`
- Expects env vars (server-only; do NOT expose as NEXT_PUBLIC):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Requires Supabase table:
  - `admin_emails(email text primary key)`

The API uses Supabase REST endpoint `/rest/v1/admin_emails?select=email&email=eq.<normalized>&limit=1`
with `Authorization: Bearer <service role key>`.

## Important repo lint rule

This repo’s hooks lint flags **synchronous** `setState` inside `useEffect`.
To avoid violations, many values are initialized via **lazy `useState(() => ...)`** from localStorage.

## Next.js turbopack root config

File: `next.config.ts`

`turbopack.root` is set to avoid incorrect workspace root inference when multiple lockfiles exist elsewhere on the machine.

