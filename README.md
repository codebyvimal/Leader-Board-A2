# ASCEND Protocol Dashboard

ASCEND is an elite, high-performance web application designed for tracking progress, tasks, and activity within a private learning network or competitive group. The application utilizes a "Creamy Dark" / Gold premium design language.

## Architecture & Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS (custom tokens, gradients, drop shadows)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password strictly enforced via `AuthGuard`)
- **Storage**: Supabase Storage (Profile Avatars & Covers)
- **Animations**: Framer Motion (used for Fluid Cursor tracking & tilt mechanics)

## Core Features

1. **Authentication Guard (`/login`)**:
   - The application is entirely restricted. No user can view the dashboard unless authenticated through Supabase Auth.
   - Registration is disabled from the UI; users must be manually created in the Supabase Dashboard.

2. **Single-Page Dashboard (`/`)**:
   - **Roadmap**: Displays tasks configured by the admin.
   - **Leaderboard**: Automatically sorts users by `xp` dynamically fetched from the database.
   - **Activity**: Displays live history of all interactions and updates.
   - **Profile**: A unified panel where operators can update their bios, avatars, and covers (syncs directly to Supabase storage).

3. **Admin Control Protocol (`/admin`)**:
   - Accessible only to authorized admin emails (e.g., `ramadass17810@gmail.com`).
   - Enables direct CRUD operations on the `tasks` roadmap table.

4. **Public Profiles (`/u/[handle]`)**:
   - Dynamic routing to view the stats, bio, and visual footprint of other operators on the network.

5. **Fluid Distortion Cursor**:
   - A custom `Canvas` based tracking cursor that generates beautiful, highly performant gold water ripples on the background grid as you move.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Schema
Run the provided SQL script in your Supabase SQL Editor to generate the following tables and buckets:
- `profiles`
- `activity`
- `tasks`
- `profile_media` (Storage Bucket)
*Note: A trigger automatically generates a profile record whenever a new user is added via Supabase Auth.*

### 3. Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.
