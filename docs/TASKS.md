# Development Tasks

## Development Order

1. **Frontend** — Build all UI with mock data (MSW / static fixtures). No backend dependency.
2. **Backend** — Scaffold Laravel + Docker environment, design schema, migrations, seed scripts.
3. **API** — Build Laravel REST API with all endpoints.
4. **Integration** — Replace mocks with real API calls, glue frontend to backend.

---

## Phase 0: Environment & Scaffolding

### 0.1 Repository Setup

- [x] Initialize git repo
- [x] Create `application/`, `docs/` directory structure
- [x] Add `.gitignore` (Node, PHP, Laravel, Docker, OS files)
- [x] Add `.editorconfig`
- [x] Configure branch protection rules for `main` (no force pushes, no deletions, admin enforced — no review required, solo dev)

### 0.2 Frontend Scaffolding [x]

- [x] Scaffold Vite + React + TypeScript project in `application/frontend/`
- [x] Install and configure Tailwind CSS
- [x] Install React Router, TanStack Query, Zustand, axios
- [x] Install MSW (Mock Service Worker) for API mocking
- [x] Install and configure Vitest + Testing Library
- [x] Install and configure Playwright
- [x] Set up path aliases (`@/` -> `src/`)
- [x] Configure ESLint + Prettier (root-level config, refined during Vite scaffold)
- [x] Create folder structure: `public/`, `admin/`, `customer/`, `components/`, `hooks/`, `stores/`, `api/`, `types/`, `lib/`, `mocks/`
- [x] Set up base layout (header, footer, shell)
- [x] Set up React Router with route placeholders for all pages
- [x] Set up MSW handlers skeleton

---

## Phase 1: Frontend — Design System

### 1.1 Design Tokens & Theme [x]

- [x] Configure Tailwind theme: colors (sky primary, rose accent, amber warm, teal secondary), fonts (Plus Jakarta Sans), border radius, shadows
- [x] Create CSS custom properties file for design tokens
- [x] Set up global styles (body, headings, links, transitions)

### 1.2 Base Components [x]

- [x] `Button` — variants (primary, secondary, outline, ghost), sizes, loading state, disabled, icon support
- [x] `Input` — text, email, password, number variants; error state, label, helper text
- [x] `Select` — native select with custom styling, error state
- [x] `Textarea` — with resize control, error state
- [x] `Card` — with optional header, footer, hover shadow, variants
- [x] `Modal` — overlay, close button, body scroll lock, animation, sizes
- [x] `Badge` — color variants, dot indicator
- [x] `Avatar` — image fallback to initials, sizes
- [x] `Spinner` — size variants, centered container
- [x] `Skeleton` — loading placeholder, text/avatar/card variants
- [x] `Toast` — success/error/info/warning, auto-dismiss, stackable
- [x] `Pagination` — page numbers, prev/next, ellipsis
- [x] `Tabs` — horizontal tab bar with content panel
- [x] `Table` — sortable headers, striped rows, empty state, loading state
- [x] `Dropdown Menu` — click trigger, positioned menu, item variants
- [x] `Form Field` — wrapper with label, error, help text, required indicator

### 1.3 Navigation Components [x]

- [x] `Header` — logo, nav links, mobile hamburger menu, CTA button
- [x] `Footer` — columns for links, social icons, copyright, legal links
- [x] `Sidebar` — admin sidebar, collapsible, active state, nested items
- [x] `Breadcrumbs` — auto-generated from route, with home link
- [x] `Mobile Nav` — drawer-style navigation for mobile
- [x] `Logo` — SVG brand logo (fitness-themed icon + wordmark), used in Header, Footer, and favicon

### 1.4 Section/Page Components [x]

- [x] `Hero Section` — heading, subtext, CTA button, background
- [x] `Feature Card` — icon, title, description, optional link
- [x] `Review Card` — quote, author, rating stars, avatar
- [x] `Instructor Card` — photo, name, bio, social links
- [x] `Class Card` — image, name, duration, intensity badge, CTA
- [x] `Pricing Card` — plan name, price, features list, CTA, featured variant
- [x] `Contact Form` — name, email, phone, message fields, submit
- [x] `Gallery Grid` — image grid with lightbox
- [x] `Google Reviews Carousel` — auto-rotating review cards
- [x] `Schedule Preview` — week view, day columns, class blocks
- [x] Wire design system components into route pages for visual preview

---

## Phase 2: Frontend — Mock Data Layer [x]

### 2.1 Type Definitions [x]

- [x] Define `User`, `AdminUser`, `CustomerUser` types
- [x] Define `Location` type
- [x] Define `Coach` type
- [x] Define `ClassType` type
- [x] Define `WeeklySchedule` type
- [x] Define `ScheduleException` type
- [x] Define `SubscriptionPlan`, `CustomerSubscription` types
- [x] Define `PointCardPlan`, `PointCardPurchase` types
- [x] Add `default_price` field to `ClassType` type
- [x] Define `Booking` type
- [x] Define `Attendance` type
- [x] Define `WaitlistEntry` type
- [x] Define `PaymentTransaction` type
- [x] Define API response wrapper types (`ApiResponse<T>`, `PaginatedResponse<T>`)

### 2.2 Mock Data Fixtures [x]

- [x] Create mock users (10 from jsonplaceholder.typicode.com structure, 1 admin)
- [x] Create mock locations (3 sites with addresses, contact info)
- [x] Create mock coaches (4 profiles)
- [x] Create mock class types (6 types with colors, durations, capacities)
- [x] Create mock weekly schedule (full week with assigned classes/coaches)
- [x] Create mock schedule exceptions (2 holidays, 1 early closure)
- [x] Create mock subscription plans (4 plans: monthly/annual variants)
- [x] Create mock point card plans (3 plans)
- [x] Create mock customer subscriptions (mix of active/cancelled/expired)
- [x] Create mock point card purchases
- [x] Create mock bookings (confirmed, cancelled, attended, no-show, guest)
- [x] Create mock attendance records
- [x] Create mock waitlist entries
- [x] Create mock payment transactions

### 2.3 MSW Handlers [x]

- [x] Locations handlers: list, get, create, update, delete
- [x] Auth handlers: login, register, me, logout
- [x] Users/coaches handlers: list, get, create, update, delete
- [x] Class types handlers: list, get, create, update, delete
- [x] Weekly schedule handlers: list by day/week, get, create, update, delete
- [x] Schedule exceptions handlers: list, create, update, delete
- [x] Subscription plans handlers: list, get
- [x] Customer subscriptions handlers: list mine, list all (admin), create, cancel
- [x] Point card plans handlers: list, get
- [x] Point card purchases handlers: list mine, create
- [x] Single session pricing handlers: list by class type
- [x] Bookings handlers: list mine, list all (admin), create, cancel, check-in
- [x] Attendance handlers: list, create, report
- [x] Waitlist handlers: list, join, leave, promote
- [x] Payment handlers: create intent, webhook mock
- [x] Dashboard analytics handlers: KPIs, charts, occupancy

---

## Phase 3: Frontend — Public Site Pages

### 3.1 Home Page [x]

- [x] Build Hero section with CTA (first session free)
- [x] Build Google Reviews carousel component
- [x] Build Coach/Instructor story snippet section
- [x] Build Weekly schedule preview (next 7 days)
- [x] Build Class preview cards (grid of class types)
- [x] Build Gallery section (image grid)
- [x] Build Social media links section
- [x] Build Footer with contact info
- [x] Add responsive breakpoints for all sections
- [x] Write tests for Home page sections

### 3.2 Classes Page [x]

- [x] Build class type listing grid
- [x] Build individual class detail view (description, benefits, duration, intensity)
- [x] Build class images/gallery per type
- [x] Add booking CTA per class
- [x] Write tests for Classes page

### 3.3 Pricing Page [x]

- [x] Build subscription plans cards (annual)
- [x] Build subscription plans cards (monthly)
- [x] Build point card plans listing
- [x] Display single session price from class type `default_price`
- [x] Wire all pricing data live from mock API (no hardcoding)
- [x] Add insurance fee display
- [x] Write tests for Pricing page

### 3.4 Booking Page [x]

- [x] Build schedule selection (week view, pick a day)
- [x] Build class type filter
- [x] Build time slot picker
- [x] Build date confirmation step
- [x] Build guest booking form (email, name)
- [x] Build authenticated booking flow (login prompt in guest form)
- [x] Build booking confirmation/success view
- [x] Build booking error handling
- [x] Show capacity remaining per slot
- [~] Handle full-class waitlist prompt (shows "Full" badge, no join flow yet)
- [x] Write tests for Booking wizard (all steps)

### 3.5 About Page [x]

- [x] Build Coach bio section
- [x] Build Mission/Vision section
- [x] Build Team section
- [x] Build Gallery section
- [x] Write tests for About page

### 3.6 Contact Page [x]

- [x] Build Contact form (name, email, phone, message)
- [x] Add form validation (required fields, email format)
- [x] Build form submission flow with success/error feedback
- [x] Display contact info (phone, email, address, map)
- [x] Write tests for Contact page

### 3.7 SEO Setup [x]

- [x] Add react-helmet-async for per-page meta tags
- [x] Set meta titles, descriptions, OG tags per page
- [x] Add JSON-LD structured data (LocalBusiness)
- [x] Generate sitemap.xml
- [x] Add robots.txt
- [x] Add canonical URLs

### 3.8 Analytics Setup [x]

- [x] Add Umami tracking script to layout
- [x] Track page views
- [x] Track booking confirmed event
- [x] Track waitlist joined event
- [x] Track subscription purchased event
- [x] Track contact form submitted event

---

## Phase 4: Frontend — Authentication

### 4.1 Auth UI

- [ ] Build Login page (email + password)
- [ ] Build Register page (name, email, password, phone)
- [ ] Build Password reset flow (request + reset forms)
- [ ] Build Auth guard component (redirect if not authenticated)
- [ ] Build Role guard component (redirect if not admin)
- [ ] Build Guest layout vs Authenticated layout switch
- [ ] Write tests for Login flow

### 4.2 Auth Logic

- [ ] Create Zustand auth store (user, token, login, logout, refresh)
- [ ] Persist token in localStorage/httpOnly cookie
- [ ] Create auth API client (login, register, me, logout, refresh)
- [ ] Create axios interceptors for token injection + 401 handling
- [ ] Wire MSW auth handlers
- [ ] Write tests for auth store

### 4.3 First Session Free (Guest Flow)

- [ ] Build guest booking flow (no account required)
- [ ] Build post-booking account activation form (set password)
- [ ] Enforce one-per-email rule for free session
- [ ] Write tests for guest booking flow

---

## Phase 5: Frontend — Customer Panel

### 5.1 Dashboard Overview

- [ ] Build customer dashboard layout (sidebar + content)
- [ ] Display upcoming bookings list
- [ ] Display subscription status card (plan, sessions used/remaining, dates)
- [ ] Display point card balances
- [ ] Display recent payment history
- [ ] Write tests for customer dashboard

### 5.2 Booking Management

- [ ] Build upcoming bookings list with cancel/reschedule actions
- [ ] Build booking history list (past bookings with attendance status)
- [ ] Build reschedule flow (select new date/time, confirm)
- [ ] Build cancel confirmation dialog
- [ ] Write tests for booking management

### 5.3 Subscription Management

- [ ] Display current subscription details
- [ ] Build plan change/upgrade flow
- [ ] Build cancellation flow
- [ ] Display session usage tracker (used vs remaining, per period)
- [ ] Write tests for subscription management

### 5.4 Profile Management

- [ ] Build profile edit form (name, email, phone)
- [ ] Build password change form
- [ ] Build account deletion flow (with confirmation)
- [ ] Write tests for profile management

---

## Phase 6: Frontend — Admin Panel

### 6.1 Admin Dashboard

- [ ] Build admin layout (sidebar + header + content)
- [ ] Build KPI cards (active subscriptions, occupancy rate, revenue, new signups)
- [ ] Build revenue chart (monthly/weekly)
- [ ] Build occupancy chart per class type
- [ ] Build new signups trend chart
- [ ] Build upcoming classes widget
- [ ] Write tests for admin dashboard

### 6.2 Schedule Management

- [ ] Build weekly timetable editor (day columns, time rows, location filter)
- [ ] Build drag-to-create slot
- [ ] Build edit slot modal (class type, coach, location, capacity, time)
- [ ] Build delete slot confirmation
- [ ] Build exception dates manager (holidays, closures, per location)
- [ ] Write tests for schedule management

### 6.3 Class Management

- [ ] Build class types list with CRUD
- [ ] Build create/edit class form (name, slug, description, color, duration, max capacity)
- [ ] Build delete confirmation
- [ ] Write tests for class management

### 6.4 Subscription & Pricing Management

- [ ] Build subscription plans list with CRUD
- [ ] Build create/edit plan form (name, type, sessions/week, price, commitment, insurance)
- [ ] Build point card plans CRUD
- [ ] Build default price field in class type create/edit form
- [ ] Write tests for pricing management

### 6.5 Location Management

- [ ] Build locations list with CRUD
- [ ] Build create/edit location form (name, address, city, postal code, phone, email, maps URL, notes)
- [ ] Build location detail view (linked schedule, exceptions)
- [ ] Write tests for location management

### 6.6 Customer Management

- [ ] Build customers list (searchable, sortable, paginated)
- [ ] Build customer detail view (profile, subscriptions, bookings, attendance, payments)
- [ ] Build impersonation/assist mode
- [ ] Write tests for customer management

### 6.7 Attendance

- [ ] Build attendance check-in interface (select date, view class, mark attendees)
- [ ] Build attendance history view (per customer, per class, date range)
- [ ] Build session usage report (used vs remaining per customer)
- [ ] Write tests for attendance

### 6.8 Instructor Management

- [ ] Build instructors list with CRUD
- [ ] Build create/edit instructor form (name, bio, photo, email, phone)
- [ ] Build instructor schedule view
- [ ] Write tests for instructor management

### 6.9 Waitlist Management

- [ ] Build waitlist view per class/date
- [ ] Build manual promote action
- [ ] Build notify all action
- [ ] Write tests for waitlist management

### 6.10 Reporting & Export

- [ ] Build customer report (list, export XLS/PDF)
- [ ] Build attendance report (date range, exportable)
- [ ] Build subscription report (active, revenue, churn)
- [ ] Build occupancy report (per class type, per time slot)
- [ ] Build revenue report (monthly, annual)
- [ ] Write tests for report generation

### 6.11 Embedded Analytics

- [ ] Build analytics page with Umami iframe/integration
- [ ] Show conversion rate, popular classes, peak booking times
- [ ] Write tests for analytics page

---

## Phase 7: Backend Scaffolding

- [ ] Scaffold Laravel project in `application/backend/`
- [ ] Configure `.env` for local PostgreSQL
- [ ] Set up Dockerfile + docker-compose.yml (Laravel + PHP 8 + PostgreSQL + Nginx + Mailpit)
- [ ] Add Mailpit for email catching in development (SMTP server, web UI at localhost:8025)
- [ ] Install Sanctum (API auth) or JWT package
- [ ] Configure CORS for frontend dev server
- [ ] Set up PHPUnit configuration
- [ ] Create database migration skeleton

---

## Phase 8: Database

### 8.1 Migration: Core Tables

- [ ] Create `users` table migration (id, email, password_hash, first_name, last_name, phone, role, email_verified_at, last_login_at, timestamps, soft_deletes)
- [ ] Create `locations` table migration (id, name, slug, address, city, postal_code, phone, email, google_maps_url, notes, is_active, timestamps, soft_deletes)
- [ ] Create `coaches` table migration (id, first_name, last_name, bio, photo_url, email, phone, is_active, timestamps, soft_deletes)
- [ ] Create `class_types` table migration (id, name, slug, description, color, intensity_level, image_url, duration_minutes, max_capacity, default_price, sort_order, is_active, timestamps, soft_deletes)
- [ ] Create `weekly_schedule` table migration (id, class_type_id FK, coach_id FK, location_id FK, day_of_week, start_time, end_time, max_capacity, valid_from, valid_to, is_active, timestamps, soft_deletes)
- [ ] Create `schedule_exceptions` table migration (id, location_id FK, date, is_closed, open_time, close_time, reason, timestamps)
- [ ] Create `subscription_plans` table migration (id, name, description, type, sessions_per_week, price_per_month, commitment_months, insurance_fee, trial_days, is_active, stripe_price_id, timestamps, soft_deletes)
- [ ] Create `point_card_plans` table migration (id, name, description, points, price, validity_months, is_active, stripe_price_id, timestamps, soft_deletes)
- [ ] Add `default_price` column to `class_types` table migration
- [ ] Create `customer_subscriptions` table migration (id, user_id FK, subscription_plan_id FK, start_date, end_date, sessions_used, status, stripe_subscription_id, auto_renew, notes, cancelled_at, timestamps)
- [ ] Create `point_card_purchases` table migration (id, user_id FK, point_card_plan_id FK, points_remaining, purchase_date, expiry_date, timestamps)
- [ ] Create `bookings` table migration (id, user_id FK nullable, schedule_id FK, booking_date, status, guest_email, source, waitlist_promoted_from_id FK nullable, notes, cancelled_at, timestamps)
- [ ] Create `attendance` table migration (id, booking_id FK, user_id FK, class_type_id FK, attended_at, marked_by FK, check_in_method, notes, timestamps)
- [ ] Create `waitlist` table migration (id, user_id FK, schedule_id FK, date, status, expires_at, confirmed_at, notified_at, timestamps)
- [ ] Create `payment_transactions` table migration (id, user_id FK, subscription_id FK nullable, point_card_purchase_id FK nullable, booking_id FK nullable, amount, fee_amount, net_amount, currency, status, payment_method, stripe_payment_intent_id, receipt_url, description, metadata json, timestamps)
- [ ] Create `free_session_claims` table migration (id, email, user_id FK nullable, booking_id FK, claimed_at, timestamps)
- [ ] Add indexes on foreign keys, status columns, and date columns
- [ ] Add unique constraints where appropriate

### 8.2 Seed Script

- [ ] Create `DatabaseSeeder` orchestrator
- [ ] Create `UserSeeder`: fetch `https://jsonplaceholder.typicode.com/users`, map to users table, promote first entry to admin
- [ ] Create `LocationSeeder`: insert 2-3 hardcoded sites with address, contact info
- [ ] Create `CoachSeeder`: insert 4 hardcoded instructor profiles
- [ ] Create `ClassTypeSeeder`: insert 6 hardcoded class types with colors
- [ ] Create `WeeklyScheduleSeeder`: generate schedule entries across weekdays and locations
- [ ] Create `ScheduleExceptionSeeder`: insert 2-3 holiday/closure dates per location
- [ ] Create `SubscriptionPlanSeeder`: insert 4 plans (monthly + annual variants)
- [ ] Create `PointCardPlanSeeder`: insert 3 point card options
- [ ] Set `default_price` on each class type in `ClassTypeSeeder`
- [ ] Create `CustomerSubscriptionSeeder`: assign subscriptions to subset of users (with auto_renew mix)
- [ ] Create `FreeSessionClaimSeeder`: insert 2-3 claims from guest bookings, 1 linked to activated account
- [ ] Create `PointCardPurchaseSeeder`: assign point cards to subset of users
- [ ] Create `BookingSeeder`: generate 10-15 bookings with varied statuses
- [ ] Create `AttendanceSeeder`: mark attendance for subset of confirmed bookings
- [ ] Create `WaitlistSeeder`: add 3-5 waitlist entries
- [ ] Create `PaymentTransactionSeeder`: generate sample payment records
- [ ] Verify seed is idempotent (skip existing records)

---

## Phase 9: API — Authentication

### 9.1 Auth Endpoints

### 9.2 Guest Flow

- [ ] Create `POST /api/guest/register` — register after first free session
- [ ] Create `GET /api/guest/check-email` — check if email already used for free session
- [ ] Implement one-per-email validation on guest booking
- [ ] Write tests for guest flow

---

## Phase 10: API — Core CRUD

### 10.1 User Management

### 10.2 Location Management

### 10.3 Instructor Management

### 10.4 Class Type Management

### 10.5 Schedule Management

### 10.6 Subscription Management

### 10.7 Point Card Management

### 10.8 Class Pricing

### 10.9 Booking Endpoints

### 10.10 Attendance Endpoints

### 10.11 Waitlist Endpoints

### 10.12 Dashboard & Reporting Endpoints

- [ ] Create `GET /api/admin/dashboard/kpi` — active subs, occupancy, revenue, signups
- [ ] Create `GET /api/admin/dashboard/revenue-chart` — revenue over time
- [ ] Create `GET /api/admin/dashboard/occupancy-chart` — occupancy by class type
- [ ] Create `GET /api/admin/reports/customers` — customer list export
- [ ] Create `GET /api/admin/reports/attendance` — attendance export
- [ ] Create `GET /api/admin/reports/subscriptions` — subscription report export
- [ ] Create `GET /api/admin/reports/occupancy` — occupancy report export
- [ ] Create `GET /api/admin/reports/revenue` — revenue report export
- [ ] Implement XLS/PDF generation for exports
- [ ] Write tests for dashboard and report endpoints

---

## Phase 11: API — Payments

### 11.1 Stripe Integration

### 11.2 PayPal Integration

- [ ] Set up PayPal PHP SDK
- [ ] Create `POST /api/customer/payments/paypal/create-order` — create order
- [ ] Create `POST /api/customer/payments/paypal/capture-order` — capture after approval
- [ ] Write tests for payment endpoints

---

## Phase 12: API — Email Notifications

### 12.1 Mail Setup

### 12.2 Notification Templates

- [ ] Create booking confirmation mail (customer + guest)
- [ ] Create booking reminder mail (24h before)
- [ ] Create cancellation confirmation mail
- [ ] Create waitlist promotion mail (claim your spot)
- [ ] Create subscription confirmation mail
- [ ] Create payment receipt mail
- [ ] Create payment failed mail (customer + admin)
- [ ] Create subscription renewing mail (7 days before)
- [ ] Create contact form notification mail (admin)
- [ ] Create account activation mail (guest set password)
- [ ] Write tests for mailables

---

## Phase 13: Integration — Frontend + API

### 13.1 API Client Setup

### 13.2 Hook Migration (per entity)

### 13.3 Integration Testing

### 13.4 Error Handling

### 13.5 Performance

- [ ] Add loading skeletons for all pages
- [ ] Add pagination for all list views
- [ ] Add TanStack Query stale time configuration
- [ ] Add React.lazy + Suspense for route-level code splitting
- [ ] Add image optimization (lazy loading, responsive sizes)
- [ ] Verify dashboard load time (< 2s)
- [ ] Verify booking wizard responsiveness under load
- [ ] Verify export generation time (< 5s)

---

## Phase 14: Testing & QA

### 14.1 Frontend Tests

### 14.2 E2E Tests (Playwright)

### 14.3 API Tests (PHPUnit)

### 14.4 Performance Tests

- [ ] Dashboard load time < 2s (initial load)
- [ ] Booking wizard responsiveness under concurrent booking simulation
- [ ] Export generation < 5s for standard reports
- [ ] Lighthouse scores >= 90 (performance, accessibility, SEO)

---

## Phase 15: GDPR, Legal & Compliance

- [ ] Add cookie consent banner with explicit opt-in
- [ ] Create Privacy policy page
- [ ] Create Terms of Use and Sale (CGU/CGV) page
- [ ] Implement account deletion flow (with data retention rules)
- [ ] Add unsubscribe link in all email templates
- [ ] Add data retention auto-cleanup command (scheduled task)
- [ ] Verify GDPR compliance checklist

---

## Phase 16: CI/CD & Deployment

- [ ] Set up GitHub Actions workflow: lint + typecheck + test on PR
- [ ] Set up GitHub Actions workflow: auto-deploy on merge to main
- [ ] Configure staging environment
- [ ] Configure production environment
- [ ] Set up SSL via Let's Encrypt
- [ ] Set up daily PostgreSQL backup (retain 30 days)
- [ ] Set up uptime monitoring (UptimeRobot or similar)
- [ ] Configure error monitoring (Sentry or equivalent)
- [ ] Run full E2E test suite against staging
- [ ] Go-live checklist review

---

## Git Branch Convention

Trunk-based development with short-lived feature branches grouped by deliverable:

```text
main                    # Always deployable. Feature-flagged if incomplete.
├── feat/frontend-scaffold   # Vite + Tailwind + Router + MSW + Vitest + layout
├── feat/design-system       # All base components (Button, Input, Card, Modal...)
├── feat/mock-data-layer     # Types + fixtures + MSW handlers
├── feat/public-pages        # Home, Classes, Pricing, About, Contact + SEO + Analytics
├── feat/auth                # Login, Register, guest flow, auth store
├── feat/customer-panel      # Dashboard, bookings, subscriptions, profile
├── feat/admin-panel         # Dashboard, schedule, classes, locations, customers,
│                            # attendance, instructors, waitlist, reporting
├── feat/backend-scaffold    # Laravel project + Docker + docker-compose
├── feat/database            # Migrations + seed scripts
├── feat/api-auth            # Auth endpoints + guest flow
├── feat/api-crud            # All CRUD endpoints (users, locations, coaches,
│                            # classes, schedule, subscriptions, point cards,
│                            # bookings, attendance, waitlist, dashboard)
├── feat/api-payments        # Stripe + PayPal integration
├── feat/api-notifications   # Email templates + queue
├── feat/integration         # Replace MSW with real API, error handling, perf
├── feat/testing             # E2E, performance, QA
├── feat/gdpr-legal          # Cookie consent, privacy, terms, deletion flow
├── feat/ci-cd               # GitHub Actions, staging, monitoring, backups
├── fix/*
└── chore/*
```

Key rules:

- `main` is the only long-lived branch.
- One branch per logical deliverable, not per checkbox. Group related tasks.
- Feature branches live at most 1-2 days. If a feature takes longer, use feature flags to merge early.
- A release is just a git tag on `main` (e.g. `v1.0.0`). No release branches.
- Rollback = toggle a flag off or revert a single commit.

## Task Tracking

As work progresses, each task above should be updated with:

- `[ ]` not started
- `[/]` in progress
- `[x]` completed
- `[~]` delayed — blocked or deferred pending a decision
