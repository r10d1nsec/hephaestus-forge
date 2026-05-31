# PRD — Streakly

## Executive Summary
Streakly is an AI-powered habit tracker that converts ambitious, vaguely-defined goals into a concrete sequence of adaptive daily micro-tasks. Unlike conventional habit apps that act as static checklists, Streakly uses an LLM to decompose a user's goal ("run a half-marathon," "learn Spanish," "ship a side project") into small, achievable daily actions and continuously rewrites the plan when life gets in the way.

The core insight is that most goals fail not from lack of motivation, but from lack of a system: people don't know what to do *today* to move toward what they want *eventually*, and a single missed day often collapses the whole effort. Streakly closes that gap with two differentiators — **AI goal decomposition** and **adaptive rescheduling** — so a missed day triggers a recalculated plan rather than guilt and abandonment.

The MVP targets busy professionals aged 25–40 as a mobile-first PWA with email/OAuth authentication and a single LLM provider. It deliberately excludes social features, gamified reward stores, and wearable integrations to focus on proving that AI-guided, self-healing planning drives measurably higher consistency than dumb checklists.

## Problem Statement
People set big goals but consistently fail to achieve them because:
1. **No decomposition** — A goal like "get fit" or "learn to code" is too large to act on. Users don't know the right *next small step*, so they either over-commit and burn out or never start.
2. **Brittle plans** — Existing habit apps assume perfect execution. One missed day breaks a streak, the plan no longer reflects reality, and the user feels they've "failed," leading to abandonment.
3. **Zero guidance** — Apps like Habitica and Streaks are essentially checklists the user must design and maintain themselves. They track behavior but provide no intelligence about *what* to do or *how* to recover from setbacks.

The result is a large population of motivated people who repeatedly start and quit, blaming themselves rather than the lack of an adaptive system.

## Target User Persona
**"Consistent-Seeking Professional"**
- **Age:** 25–40
- **Profile:** Busy knowledge worker / professional with limited, fragmented free time.
- **Goals:** Building habits in fitness, learning a skill, or progressing a side project.
- **Behaviors:** Has tried (and churned out of) one or more habit/productivity apps. Comfortable with mobile apps and OAuth logins. Motivated but time-poor and easily derailed by unpredictable schedules.
- **Pain:** Wants to make real progress on meaningful goals but lacks a system that tells them what to do each day and adapts when they fall behind.
- **Success looks like:** Opening the app, seeing 1–3 clear tasks for today, checking them off, and trusting that missed days won't sabotage the whole plan.

## Goals & Non-Goals

**Goals**
- Let a user input any goal and receive an AI-generated plan of adaptive daily micro-tasks.
- Present a frictionless daily feed of tasks the user can check off in seconds.
- Automatically reschedule and rebalance the plan when the user misses days, without breaking the goal.
- Make progress and consistency visible and motivating via streaks and progress views.
- Validate that AI-guided adaptive planning increases consistency vs. traditional checklists.

**Non-Goals (MVP)**
- Not a social or community platform.
- Not a gamified economy with rewards/stores.
- Not a wearable or third-party fitness data hub.
- Not a multi-provider LLM platform at launch.
- Not a native iOS/Android app at launch (PWA only).

## Feature List (MVP)

### 1. Goal Input + AI Decomposition
- **User Story:** As a busy professional, I want to enter a big goal in plain language and have the AI break it into daily micro-tasks, so that I know exactly what small actions to take without planning it myself.
- **Acceptance Criteria:**
  - User can enter a free-text goal and optional parameters (e.g., target timeframe, available days/week).
  - The system calls the LLM and returns a structured plan of dated micro-tasks.
  - Each micro-task is concrete and completable in a single day.
  - The generated plan is persisted and editable/regenerable by the user.
  - A loading/error state is shown if generation fails or times out.
- **Priority:** P0

### 2. Daily Task Feed with Check-Off
- **User Story:** As a user, I want to open the app and see only today's tasks with a one-tap check-off, so that I can act immediately without sorting through my whole plan.
- **Acceptance Criteria:**
  - The feed shows tasks scheduled for the current day, ordered clearly.
  - User can mark a task complete/incomplete with a single tap.
  - Completion state persists across sessions and devices for the same account.
  - Past-due and upcoming tasks are visually distinguished from today's tasks.
- **Priority:** P0

### 3. Adaptive Rescheduling on Misses
- **User Story:** As a user who missed a day, I want the plan to automatically reschedule itself, so that I can recover without feeling like I failed or having to replan manually.
- **Acceptance Criteria:**
  - When tasks go uncompleted past their scheduled day, the system detects the miss.
  - The plan is recalculated (manually triggered and/or on app open) to redistribute remaining work while respecting the goal's target timeframe.
  - Rescheduling never silently drops required tasks; it shifts or rebalances them.
  - The user is informed that the plan was adjusted and can view the updated schedule.
- **Priority:** P0

### 4. Streak & Progress View
- **User Story:** As a user, I want to see my streak and overall progress toward my goal, so that I stay motivated and understand how far I've come.
- **Acceptance Criteria:**
  - Displays current streak and/or consistency metric.
  - Shows progress toward goal completion (e.g., % of plan completed or milestones reached).
  - Updates in real time as tasks are checked off.
  - Reschedules from missed days are reflected without unfairly zeroing the user's sense of progress.
- **Priority:** P1

### 5. Authentication (Email + OAuth)
- **User Story:** As a user, I want to sign up and log in with email or a social provider, so that my goals and progress are saved securely and synced.
- **Acceptance Criteria:**
  - User can register and log in via email and at least one OAuth provider.
  - Authenticated sessions persist and data is scoped to the account.
  - Basic account security (password handling / OAuth token handling) follows standard practices.
- **Priority:** P0

## Out of Scope
- **Social features** (friends, sharing, leaderboards, community challenges).
- **Gamified rewards store** (points-for-prizes economy, virtual items).
- **Wearable integrations** (smartwatch / fitness tracker data sync).
- **Push notifications** (planned for a later version, not MVP).
- **Multiple LLM providers** (MVP uses a single provider).
- **Native mobile apps** (MVP is a mobile-first PWA).

## Success Metrics / KPIs
- **Activation:** % of new users who create at least one goal and complete their first day's tasks.
- **Consistency (north star):** Average % of scheduled daily tasks completed per active user per week.
- **Recovery rate:** % of users who, after missing a day, return and complete tasks within the next 2 days (measures whether adaptive rescheduling reduces abandonment).
- **Retention:** D7 and D30 retention of users who created a goal.
- **Plan quality proxy:** % of AI-generated plans accepted/kept without manual rebuild.
- **Goal progress:** Median progress toward goal completion at 30 days.

## Open Questions
- Which specific LLM provider/model will power the MVP, and what is the per-user cost/latency budget for decomposition and rescheduling calls?
- What is the precise rescheduling trigger and policy — automatic on app open, manual, or both — and how does it handle goals with hard deadlines vs. open-ended ones?
- How is a "miss" defined (end of calendar day in the user's timezone? a grace window?), and how is timezone handling managed for a PWA?
- How is "streak" defined when the plan adapts — is it based on scheduled-vs-completed days, and how do rescheduled days affect it?
- What inputs are required at goal creation (timeframe, days available per week, difficulty) to produce a good initial plan?
- What are the limits per account (number of concurrent goals, plan length/horizon)?
- Without push notifications in the MVP, what mechanism (if any) re-engages users to open the app daily?
- What are the data privacy, storage, and retention requirements for user goals and any data sent to the LLM provider?
