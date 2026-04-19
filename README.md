<div align="center">
<!-- PROJECT LOGO / BANNER -->
<!-- <img src="public/logo.svg" alt="LeetBug Logo" width="200" /> -->

<p><em>A premium, interactive LeetCode training system providing structured pattern mastery, spaced repetition, and practice logging.</em></p>

<!-- BADGES -->

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Version](https://img.shields.io/badge/version-0.1.0-brightgreen.svg)]()
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)

<br />

[Report a Bug](https://github.com/nethangabrielb/leet-bug/issues) · [Request a Feature](https://github.com/nethangabrielb/leet-bug/issues)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Contact](#-contact)

---

## Overview

> **LeetBug** is a full-stack web application built with Next.js 16, Prisma 7, and PostgreSQL. It provides an optimized, interactive 31-day plan to master core data structure and algorithmic patterns, utilizing active spaced repetition and structured daily logging to ensure durable learning rather than mindless grinding.

<!-- Add screenshots here -->
<!-- <img width="1901" height="1097" alt="screenshot" src="[url]" /> -->

This project was built to:

- **Stop Random Grinding** — Provide a focused, structured 31-day path to mastering 10 essential algorithmic patterns.
- **Ensure Durable Learning** — Built-in spaced repetition queue prevents forgetting by resurfacing problems exactly when you need to review them.
- **Showcase Modern Architecture** — Demonstrates a fast, server-rendered and highly interactive full-stack app leveraging Next.js 16 Server Actions, React Query cache invalidation, and type-safe data serialization.

---

## Features

### Core

- [x] **Spaced Repetition Queue** — Algorithms automatically schedule reviews (🔴 3 days, 🟡 7 days) exactly when you're about to forget them.
- [x] **Pattern Mastery Tracking** — Don't just solve problems blindly. See your true mastery levels across 10 core patterns dynamically rendered via heatmaps.
- [x] **Daily Routine Consistency** — Track daily check-ins across 4 core practice blocks, build streaks, and stay motivated.
- [x] **Interactive Pattern Flowchart** — A visual decision tree that helps you systematically identity which data structure or algorithm to tackle a problem with.
- [ ] **Data Export** — Export all your logs and analytical history.

### Technical

- [x] **Server Actions & Mutations** — Uses Next.js Server Actions tightly integrated with TanStack Query for blazing fast cache invalidation without page reloads.
- [x] **Top-Level Type Safety** — Strict validation at application boundaries using Zod coupled with Prisma generated types.
- [x] **Optimized UX / UI** — Complete with Shadcn UI components, Sonner toaster notifications for immediate mutation feedback, TopLoader progress bars, and intelligent React Suspense skeletons.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/docs) | React meta-framework handling routing, build optimizations, and rendering |
| [React](https://react.dev/) | Core UI library |
| [Tailwind CSS](https://tailwindcss.com/) | Rapid, robust, utility-first styling and theme tokens |
| [TanStack Query](https://tanstack.com/query/latest) | Asynchronous state management, client-side data fetching, caching, and invalidation |
| [Shadcn UI](https://ui.shadcn.com/) | Accessible, beautifully designed primitive UI components |

### Backend

| Technology | Purpose |
|---|---|
| [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | Secure backend mutations invoked directly from client components |
| [Better Auth](https://better-auth.com/) | Robust, standard-compliant authentication library offering email logic |
| [Zod](https://zod.dev/) | End-to-end schema validation |

### Database & Infrastructure

| Technology | Purpose |
|---|---|
| [PostgreSQL](https://www.postgresql.org/) | Core relational database |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database interactions and schema migrations |

---

## Architecture

### Project Structure

```
leetbug/
├── prisma/
│   ├── schema.prisma              # Database schema & generator overrides
│   └── migrations/                # Incremental DB migrations
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Toast & Loader providers
│   │   ├── page.tsx               # Landing / home page
│   │   ├── globals.css            # Global styles
│   │   ├── (app)/                 # Protected Application Routes
│   │   │   ├── dashboard/         # Dashboard / Mastery Tracking
│   │   │   ├── practice-log/      # Daily Practice Logging
│   │   │   ├── spaced-repetition/ # Spaced Repetition Queue
│   │   │   ├── patterns/          # Pattern Deep Dives
│   │   │   └── flowchart/         # Pattern Identification Flowchart
│   ├── actions/                   # Server Actions (database fetches & mutations)
│   ├── components/                # Shared UI blocks (StatCards, Re-usable fragments)
│   │   └── ui/                    # Base building blocks (Shadcn UI, Sonner, Skeleton)
│   ├── lib/
│   │   ├── auth-client.ts         # Better Auth client export
│   │   ├── auth.ts                # Better Auth logic configuration
│   │   ├── prisma.ts              # Global Prisma Client singleton
│   │   └── utils.ts               # Shared Tailwind/Class merging utilities
│   └── providers/                 # React Context wrapers (QueryProvider)
├── tsconfig.json
├── package.json
```

### Architecture Pattern

> **Monolith (Next.js Full-Stack)** — A unified application architecture where Next.js serves both the highly interactive React 19 Frontend and secures Server Actions (Backend) operating against a PostgreSQL database. 

### Data Flow Architecture

```mermaid
graph TD
    A[Client UI Components] -->|TanStack React Query| B[Server Actions]
    A -->|Form submissions| B
    B -->|Prisma ORM| D[(PostgreSQL Database)]
    A -->|Auth State| E[Better Auth Provider]
    E -->|Session Context| D
```

### Request Flow

```
User Mutation → Client Event Handler
    → React Query `useQuery` / `useMutation`
        → Server Action (auth check, backend logic)
        → Prisma Database Update
    → React Query Cache Invalidation
        → Automatic UI Component Re-render + Success Toast
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` / **pnpm** (preferred)
- **PostgreSQL Database** — Local or managed (e.g. Supabase, Neon)

### Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```
*(If `.env.example` does not exist, simply create `.env`)*

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/leetbug?schema=public"

# ─── Authentication ─────────────────────────────────────
BETTER_AUTH_SECRET="A_STRONG_RANDOM_SECRET_STRING_HERE"
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/nethangabrielb/leet-bug.git
cd leet-bug
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Generate the Prisma Client**

```bash
npx prisma generate
```

4. **Set up the database**

```bash
# Push schema to the database
npx prisma db push

# OR, run migrations
npx prisma migrate dev
```

### Running the App

**Development**:

```bash
pnpm dev
```

**Production build**:

```bash
pnpm build
pnpm start
```

The app will be available at: `http://localhost:3000`

---

## Database Schema

> Full schema: [`prisma/schema.prisma`](prisma/schema.prisma)

### Entity Relationship Diagram

```mermaid
erDiagram
    user ||--o{ PracticeLog : "has many"
    user ||--o{ RepetitionItem : "has many"
    user ||--o{ DailyCheckIn : "has many"
    Pattern ||--o{ Problem : "groups"
    Problem ||--o{ PracticeLog : "is logged in"
    Problem ||--o{ RepetitionItem : "is queued in"

    user {
        string id PK
        string email UK
        string name
        string password
    }

    Problem {
        string id PK
        int leetcodeNumber
        string difficulty
        string patternId FK
    }

    PracticeLog {
        string id PK
        string userId FK
        string problemId FK
        string solved
        string confidence
    }
```

### Core Models

| Model | Key Fields | Description |
|-------|-----------|-------------|
| `user` | id, email, name, password | App accounts, powered by Better Auth |
| `Pattern` | id, number, name | Standard 10 algorithmic patterns (Sliding Window, Trees, DFS, etc.) |
| `Problem` | id, leetcodeNumber, patternId | Individual problem definitions tied to the 31-day roadmap |
| `PracticeLog` | id, userId, problemId, confidence, keyInsight | Stores individual daily problem run logs linking users and problems |
| `RepetitionItem` | id, userId, problemId, status, nextReviewDate | Queued problems users struggled on waiting for spaced review |
| `DailyCheckIn` | id, block1Done, block2... | State of the 4-block daily task consistency routine |

---

## Roadmap

| Status | Feature |
|--------|---------|
| ✅ Done | 31-Day Roadmap Implementation |
| ✅ Done | Practice Log Session Tracker |
| ✅ Done | Backend Spaced Repetition Logic |
| ✅ Done | Pattern Flowchart Interactive Layout |
| ✅ Done | UI Performance Migrations (Suspense & React Query Loading) |
| 📋 Planned | Daily Streak Extractor & History Board |
| 💡 Considering | Dynamic Custom Roadmaps |

See all open issues: [GitHub Issues →](https://github.com/nethangabrielb/leet-bug/issues)

---

## Contributing

Contributions are what make open-source amazing. Any contributions are greatly appreciated.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) — Beautiful primitive components
- [Better Auth](https://better-auth.com/) — Flawless authentication out of the box
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling

---

## Contact

**Nethan Gabriel**
[![GitHub](https://img.shields.io/badge/GitHub-nethangabrielb-black?style=flat-square&logo=github)](https://github.com/nethangabrielb)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/nethangabrielb">Nethan Gabriel</a></sub>
</div>
