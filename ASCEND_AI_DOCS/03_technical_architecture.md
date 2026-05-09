# ASCEND — Technical Architecture

# Recommended Stack

## Frontend
- Next.js
- Tailwind CSS
- Framer Motion

## Backend
- Supabase

## Deployment
- Vercel

---

# Why This Stack

## Next.js
- modern
- fast
- AI-friendly
- easy deployment

## Tailwind
- rapid UI development
- clean styling

## Framer Motion
- premium animations

## Supabase
Provides:
- auth
- database
- realtime
- APIs

Without needing complex backend setup.

---

# Database Structure

## users

| field | type |
|---|---|
| id | uuid |
| name | text |
| email | text |
| xp | integer |
| streak | integer |
| avatar | text |

---

## tasks

| field | type |
|---|---|
| id | uuid |
| title | text |
| description | text |
| xp | integer |
| deadline | timestamp |
| section | text |
| order | integer |

---

## submissions

| field | type |
|---|---|
| id | uuid |
| user_id | uuid |
| task_id | uuid |
| linkedin_url | text |
| status | text |
| submitted_at | timestamp |

---

# Core Logic

## Task Completion Flow

1. User clicks task
2. User submits LinkedIn URL
3. Admin reviews
4. Admin approves
5. XP updates
6. Leaderboard refreshes

---

# Realtime Features

Use Supabase realtime for:
- leaderboard updates
- XP changes
- activity feed updates

---

# Pages

## /login
Authentication page

## /
Main application page

Contains:
- leaderboard
- roadmap
- activity
- stats

## /admin
Admin controls:
- approve proofs
- create tasks
- edit XP
