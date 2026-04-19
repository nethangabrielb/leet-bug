<div align="center">
<!-- PROJECT LOGO / BANNER -->
<!-- <img src="public/logo.svg" alt="LeetBug Logo" width="200" /> -->

<h1>🐛 LeetBug</h1>

<p><em>A structured 31-day LeetCode training system with spaced repetition, confidence tracking, and anti-panic interview prep — built for beginners who want a system, not a grind.</em></p>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Version](https://img.shields.io/badge/version-0.1.0-brightgreen.svg)]()
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)

<br />

[Report a Bug](https://github.com/nethangabrielb/leet-bug/issues) · [Request a Feature](https://github.com/nethangabrielb/leet-bug/issues)

</div>

---

## The Problem With How Most People Learn LeetCode

Most beginners open LeetCode, filter by "Easy," and start grinding. After two weeks they've solved 40 random problems, remember maybe 10, panic in interviews, and quit.

**LeetBug doesn't let you do that.**

It restricts what you study, enforces how you study it, schedules your reviews so you never forget, and trains the mental game that most resources completely ignore. It's not a problem list — it's a system.

---

## Table of Contents

- [The 31-Day Roadmap](#-the-31-day-roadmap)
- [The Traffic Light System](#-the-traffic-light-system)
- [The Daily Routine](#-the-daily-routine)
- [The Pattern Flowchart](#-the-pattern-flowchart)
- [The Mental Game](#-the-mental-game)
- [Spaced Repetition](#-spaced-repetition)
- [What You Won't Study (And Why)](#-what-you-wont-study-and-why)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🧭 The 31-Day Roadmap

LeetBug gives you a fixed, opinionated 5-week sequence designed to build pattern recognition in the right order — not alphabetically, not by difficulty, but chronologically by how concepts build on each other.

| Week | Theme | Topics |
|------|-------|---------|
| **Week 1** | Foundation | Math, Arrays, Hashing |
| **Week 2** | Building Up | Strings, Two Pointers, Stacks |
| **Week 3** | Leveling Up | Sliding Window, Binary Search, Sorting |
| **Week 4** | Going Deep | Greedy, Linked Lists, Trees |
| **Week 5** | Boss Battles 🔥 | Interview simulations under timed pressure |

**Days 7, 14, 21, and 28 are hardcoded as Review Days.** You cannot advance to new material on these days — the app enforces it. Review only.

---

## 🔴🟡🟢 The Traffic Light System

Every problem you attempt gets rated. Your rating determines exactly what happens next.

**🔴 Red — Couldn't Solve It**

This is not failure. This is the most important state in the system.

1. Read the solution fully
2. Close the tab
3. Rewrite it from scratch, purely from memory
4. The problem is automatically queued for spaced repetition review in **3 days**

**🟡 Yellow — Solved, But Struggled**

You got it working but it wasn't clean.

1. Write down the key insight that unlocked it
2. Review the top 3 discussion solutions
3. Problem is queued for review in **7 days**

**🟢 Green — Clean Solve**

You cracked it elegantly. No review needed unless it's a ⭐ core problem.

> The rewrite-from-memory step on Red problems is non-negotiable. Reading a solution and understanding it are not the same thing. Rewriting proves you actually internalized it.

---

## ⏳ The Daily Routine

To prevent burnout spirals, LeetBug enforces a strict 4-block daily structure with time limits. You don't get to grind for 4 hours and burn out by day 5.

| Block | Duration | Purpose |
|-------|----------|---------|
| **Morning Warm-Up** | 15 min | Wake the brain up. No new learning. |
| **Core Practice** | 35–50 min | Attack the day's roadmap module. Timers enforced: 20 min for Easys, 35 min for Mediums. |
| **Spaced Repetition** | 15–20 min | Clear the Red/Yellow backlog. |
| **Evening Reflection** | 10 min | Log your "Aha!" moments. |

Total: ~75–95 minutes per day. Enough to make real progress. Not enough to destroy yourself.

---

## 🧠 The Pattern Flowchart

A huge reason beginners freeze in interviews isn't lack of knowledge — it's not knowing which tool to reach for. LeetBug includes an interactive visual decision tree you click through based on problem cues:

```
Is it asking for a contiguous subarray?     → Sliding Window
Does it involve matching or undoing?        → Stack
Is it asking for minimum scheduling?        → Greedy or Tree
Does it need fast lookups?                  → Hash Map
Is the input sorted and you need O(log n)?  → Binary Search
```

Instead of guessing, you follow the flowchart. Over time, pattern identification becomes instinct.

---

## 🧘 The Mental Game

Most apps teach you DSA. None of them teach you what to do when your mind goes blank 10 minutes into a 45-minute interview. LeetBug does.

**Before you start:**
- 3 slow breaths (in 4s, hold 4s, out 6s)
- Verbalize: *"Let me read this carefully."*

**When you're stuck:**
- Test the problem out loud with `n = 1`
- Do not touch the keyboard yet

**The 2-Minute Warning:**
At the halfway mark of your timer, if you don't have code yet — write the brute force. A working `O(n²)` answer always beats an unfinished `O(n)` answer.

**Edge Case Checklist (always):**
- Empty array `[]`
- Single element `[x]`
- Negative numbers
- Zeros
- Null inputs

---

## 🔁 Spaced Repetition

LeetBug automatically manages a review queue based on your confidence ratings. Problems don't disappear after you solve them — they come back exactly when you're about to forget them.

- 🔴 Red problems resurface in **3 days**
- 🟡 Yellow problems resurface in **7 days**
- 🟢 Green problems are retired (unless starred as core)

The queue is the most important part of the system. Clearing it daily is non-negotiable.

---

## 🚫 What You Won't Study (And Why)

LeetBug explicitly tells you to ignore the following — and blocks them from the roadmap entirely:

| Topic | Why You're Skipping It |
|-------|----------------------|
| Dynamic Programming | Requires pattern fluency you don't have yet. A trap for beginners. |
| Graph BFS/DFS | Complex, rarely appears in early-career assessments. |
| Heaps / Priority Queues | Advanced. Not worth the cognitive load at this stage. |
| Tries | Niche. Almost never tested at junior level. |
| Hard problems | You don't need them. Mediums win junior interviews. |

Knowing what to skip is as important as knowing what to study.

---

## ✅ Features

- **31-Day Structured Roadmap** — Fixed weekly progression with enforced review days
- **Traffic Light Confidence System** — Red/Yellow/Green ratings with enforced follow-up protocols
- **Spaced Repetition Queue** — Automatic problem resurfacing at 3-day and 7-day intervals
- **Interactive Pattern Flowchart** — Visual decision tree for approach identification
- **4-Block Daily Routine Tracker** — Timed practice blocks with daily check-ins
- **Mental Game Section** — Pre-exam rituals, stuck protocols, and edge case reminders
- **Practice Logging** — Per-problem logs with key insights and confidence history
- **Streak Tracking** — Daily consistency monitoring across all 4 blocks

---

## 🛠 Tech Stack

| Technology | Role |
|---|---|
| [Next.js 16](https://nextjs.org/) | Full-stack React framework (App Router, Server Actions, RSC) |
| [React 19](https://react.dev/) | UI with Hooks and Suspense |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible primitive components |
| [TanStack Query](https://tanstack.com/query) | Client-side caching and cache invalidation |
| [Better Auth](https://better-auth.com/) | Email/password authentication |
| [Prisma 7](https://www.prisma.io/) | Type-safe ORM |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Zod](https://zod.dev/) | End-to-end schema validation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **PostgreSQL** — local or managed (Supabase, Neon, etc.)

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/leetbug?schema=public"
BETTER_AUTH_SECRET="a-strong-random-secret"
```

### Installation

```bash
git clone https://github.com/nethangabrielb/leet-bug.git
cd leet-bug
pnpm install
npx prisma generate
npx prisma migrate dev
pnpm dev
```

App runs at `http://localhost:3000`

---

## 📋 Roadmap

| Status | Feature |
|--------|---------|
| ✅ Done | 31-Day Roadmap with enforced review days |
| ✅ Done | Traffic Light confidence system |
| ✅ Done | Spaced repetition queue (3-day / 7-day) |
| ✅ Done | Interactive pattern identification flowchart |
| ✅ Done | 4-Block daily routine tracker |
| ✅ Done | Mental game section |
| 📋 Planned | Daily streak history board |
| 💡 Considering | Custom roadmap builder |
| 💡 Considering | Community shared key insights |

---

## Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add something'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

---

## License

MIT. See `LICENSE` for details.

---

## Contact

**Nethan Gabriel**
[![GitHub](https://img.shields.io/badge/GitHub-nethangabrielb-black?style=flat-square&logo=github)](https://github.com/nethangabrielb)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-nethangabrielb-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/nethangabrielb/)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/nethangabrielb">Nethan Gabriel</a></sub>
</div>