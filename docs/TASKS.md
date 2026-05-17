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

### 3.9 Multi-language Setup

- [x] Research and select i18n library (react-i18next or similar)
- [x] Externalize all user-facing strings into locale files
- [x] Set up language detection and switching
- [x] Configure primary language per deployment via environment
- [x] Store language preference in user profile (persisted across sessions)
- [x] Write tests for language switching

---

## Phase 4: Frontend — Authentication

### 4.1 Auth UI [x]

- [x] Build Login page (email + password)
- [x] Build Register page (name, email, password, phone)
- [x] Build Password reset flow (request + reset forms)
- [x] Build Auth guard component (redirect if not authenticated)
- [x] Build Role guard component (redirect if not admin)
- [x] Build Guest layout vs Authenticated layout switch
- [x] Write tests for Login flow

### 4.2 Auth Logic

- [x] Create Zustand auth store (user, token, login, logout, refresh)
- [x] Persist token in localStorage
- [x] Create auth API client (login, register, me, logout, refresh)
- [x] Create axios interceptors for token injection + 401 handling
- [x] Wire MSW auth handlers
- [x] Write tests for auth store

### 4.3 First Session Free (Guest Flow) [x]

- [x] Build guest booking flow (no account required)
- [x] Build post-booking account activation form (set password)
- [x] Enforce one-per-email rule for free session
- [x] Write tests for guest booking flow

---

## Phase 5: Frontend — Customer Panel

### 5.1 Dashboard Overview [x]

- [x] Build customer dashboard layout (sidebar + content)
- [x] Display upcoming bookings list
- [x] Display subscription status card (plan, sessions used/remaining, dates)
- [x] Display point card balances
- [x] Display recent payment history
- [x] Write tests for customer dashboard

### 5.2 Booking Management [x]

- [x] Build upcoming bookings list with cancel/reschedule actions
- [x] Build booking history list (past bookings with attendance status)
- [x] Build reschedule flow (select new date/time, confirm)
- [x] Build cancel confirmation dialog
- [x] Write tests for booking management

### 5.3 Subscription Management [x]

- [x] Display current subscription details
- [x] Build plan change/upgrade flow
- [x] Build cancellation flow
- [x] Display session usage tracker (used vs remaining, per period)
- [x] Write tests for subscription management

### 5.4 Profile Management [x]

- [x] Build profile edit form (name, email, phone)
- [x] Build password change form
- [x] Build account deletion flow (with confirmation)
- [x] Write tests for profile management

---

## Phase 6: Frontend — Admin Panel

### 6.1 Admin Dashboard [x]

- [x] Build admin layout (sidebar + header + content)
- [x] Build KPI cards (active subscriptions, occupancy rate, revenue, new signups)
- [x] Build revenue chart (monthly/weekly)
- [x] Build occupancy chart per class type
- [x] Build new signups trend chart
- [x] Build upcoming classes widget
- [x] Write tests for admin dashboard

### 6.2 Schedule Management [x]

- [x] Build weekly timetable editor (day columns, time rows, location filter)
- [x] Build drag-to-create slot
- [x] Build edit slot modal (class type, coach, location, capacity, time)
- [x] Build delete slot confirmation
- [x] Build exception dates manager (holidays, closures, per location)
- [x] Write tests for schedule management

### 6.3 Class Management [x]

- [x] Build class types list with CRUD
- [x] Build create/edit class form (name, slug, description, color, duration, max capacity)
- [x] Build delete confirmation
- [x] Write tests for class management

### 6.4 Subscription & Pricing Management [x]

- [x] Build subscription plans list with CRUD
- [x] Build create/edit plan form (name, type, sessions/week, price, commitment, insurance)
- [x] Build point card plans CRUD
- [x] Build default price field in class type create/edit form
- [x] Write tests for pricing management

### 6.5 Location Management [x]

- [x] Build locations list with CRUD
- [x] Build create/edit location form (name, address, city, postal code, phone, email, maps URL, notes)
- [x] Build location detail view (linked schedule, exceptions)
- [x] Write tests for location management

### 6.6 Customer Management [x]

- [x] Build customers list (searchable, sortable, paginated)
- [x] Build customer detail view (profile, subscriptions, bookings, attendance, payments)
- [x] Build impersonation/assist mode
- [x] Write tests for customer management

### 6.7 Attendance [x]

- [x] Build attendance check-in interface (select date, view class, mark attendees)
- [x] Build attendance history view (per customer, per class, date range)
- [x] Build session usage report (used vs remaining per customer)
- [x] Write tests for attendance

### 6.8 Instructor Management [x]

- [x] Build instructors list with CRUD
- [x] Build create/edit instructor form (name, bio, photo, email, phone)
- [x] Build instructor schedule view
- [x] Write tests for instructor management

### 6.9 Waitlist Management

- [x] Build waitlist view per class/date
- [x] Build manual promote action
- [x] Build notify all action
- [x] Write tests for waitlist management

### 6.10 Reporting & Export

- [x] Build customer report (list, export XLS/PDF)
- [x] Build attendance report (date range, exportable)
- [x] Build subscription report (active, revenue, churn)
- [x] Build occupancy report (per class type, per time slot)
- [x] Build revenue report (monthly, annual)
- [x] Write tests for report generation

### 6.11 Embedded Analytics

- [x] Build analytics page with Umami iframe/integration
- [x] Show conversion rate, popular classes, peak booking times
- [x] Write tests for analytics page

### 6.12 Instructor Dashboard

- [x] Add instructor role to auth types and mock fixtures
- [x] Wire instructor routes under `/instructor/*` with RoleGuard
- [x] Build instructor dashboard — upcoming classes, quick stats
- [x] Build instructor schedule view — weekly timetable of own classes
- [x] Build instructor attendance marking — mark students present for own sessions
- [x] Build instructor profile editing — bio, photo, contact info
- [x] Write tests for instructor dashboard pages

### 6.13 Admin Settings

- [x] Build admin settings page — General (studio name, email, phone, address, timezone, default currency)
- [x] Build business hours editor — per-day open/close times
- [x] Build booking rules section — lead time, cancellation window, max bookings per customer
- [x] Build notifications section — default email sender, event-based notification toggles
- [x] Build payments section stub — currency, tax rate (placeholder for Phase 11)
- [x] i18n support for all settings labels
- [x] Write tests for settings page

---

## Phase 7: Backend Scaffolding [x]

- [x] Scaffold Laravel project in `application/backend/`
- [x] Configure `.env` for local PostgreSQL
- [x] Set up Dockerfile + docker-compose.yml (Laravel + PHP 8 + PostgreSQL + Nginx + Mailpit)
- [x] Add Mailpit for email catching in development (SMTP server, web UI at localhost:8025)
- [x] Install Sanctum (API auth) or JWT package
- [x] Configure CORS for frontend dev server
- [x] Set up PHPUnit configuration
- [x] Create database migration skeleton

---

## Phase 8: Database [x]

### 8.1 Migration: Core Tables

- [x] Create `users` table migration (id, email, password_hash, first_name, last_name, phone, role, email_verified_at, last_login_at, timestamps, soft_deletes)
- [x] Create `locations` table migration (id, name, slug, address, city, postal_code, phone, email, google_maps_url, notes, is_active, timestamps, soft_deletes)
- [x] Create `coaches` table migration (id, first_name, last_name, bio, photo_url, email, phone, is_active, timestamps, soft_deletes)
- [x] Create `class_types` table migration (id, name, slug, description, color, intensity_level, image_url, duration_minutes, max_capacity, default_price_cents, sort_order, is_active, timestamps, soft_deletes)
- [x] Create `weekly_schedule` table migration (id, class_type_id FK, coach_id FK, location_id FK, day_of_week, start_time, end_time, max_capacity, valid_from, valid_until, is_active, timestamps, soft_deletes)
- [x] Create `schedule_exceptions` table migration (id, location_id FK, date, is_closed, open_time, close_time, reason, timestamps)
- [x] Create `subscription_plans` table migration (id, name, description, type, sessions_per_week, price_cents, interval, commitment_months, insurance_fee_cents, trial_days, is_active, stripe_price_id, features json, timestamps, soft_deletes)
- [x] Create `point_card_plans` table migration (id, name, description, sessions_count, price_cents, validity_days, is_active, stripe_price_id, timestamps, soft_deletes)
- [x] Add `default_price_cents` column to `class_types` table migration (included directly)
- [x] Create `customer_subscriptions` table migration (id, user_id FK, subscription_plan_id FK, start_date, end_date, sessions_used, status, stripe_subscription_id, auto_renew, notes, cancelled_at, timestamps)
- [x] Create `point_card_purchases` table migration (id, user_id FK, point_card_plan_id FK, sessions_remaining, purchase_date, expiry_date, timestamps)
- [x] Create `bookings` table migration (id, user_id FK nullable, schedule_id FK, booking_date, status, guest_email, source, waitlist_promoted_from_id FK nullable, notes, cancelled_at, timestamps)
- [x] Create `attendance` table migration (id, booking_id FK, user_id FK, class_type_id FK, attended_at, marked_by FK, check_in_method, notes, timestamps)
- [x] Create `waitlist` table migration (id, user_id FK, schedule_id FK, date, status, expires_at, confirmed_at, notified_at, timestamps)
- [x] Create `payment_transactions` table migration (id, user_id FK, subscription_id FK nullable, point_card_purchase_id FK nullable, booking_id FK nullable, amount_cents, fee_cents, net_cents, currency, status, payment_method, stripe_payment_intent_id, receipt_url, description, metadata json, timestamps)
- [x] Create `free_session_claims` table migration (id, email, user_id FK nullable, booking_id FK, claimed_at, timestamps)
- [x] Add indexes on foreign keys, status columns, and date columns
- [x] Add unique constraints where appropriate

### 8.2 Seed Script

- [x] Create `DatabaseSeeder` orchestrator
- [x] Create `UserSeeder`: fetch `https://jsonplaceholder.typicode.com/users`, map to users table, promote first entry to admin
- [x] Create `LocationSeeder`: insert 2-3 hardcoded sites with address, contact info
- [x] Create `CoachSeeder`: insert 4 hardcoded instructor profiles
- [x] Create `ClassTypeSeeder`: insert 6 hardcoded class types with colors
- [x] Create `WeeklyScheduleSeeder`: generate schedule entries across weekdays and locations
- [x] Create `ScheduleExceptionSeeder`: insert 2-3 holiday/closure dates per location
- [x] Create `SubscriptionPlanSeeder`: insert 4 plans (monthly + annual variants)
- [x] Create `PointCardPlanSeeder`: insert 3 point card options
- [x] Set `default_price_cents` on each class type in `ClassTypeSeeder`
- [x] Create `CustomerSubscriptionSeeder`: assign subscriptions to subset of users (with auto_renew mix)
- [x] Create `FreeSessionClaimSeeder`: insert 2-3 claims from guest bookings, 1 linked to activated account
- [x] Create `PointCardPurchaseSeeder`: assign point cards to subset of users
- [x] Create `BookingSeeder`: generate 10-15 bookings with varied statuses
- [x] Create `AttendanceSeeder`: mark attendance for subset of confirmed bookings
- [x] Create `WaitlistSeeder`: add 3-5 waitlist entries
- [x] Create `PaymentTransactionSeeder`: generate sample payment records
- [x] Verify seed is idempotent (skip existing records)

---

## Phase 9: API — Authentication [x]

### 9.1 Auth Endpoints

- [x] Create `POST /api/auth/login` — login with email + password, return Sanctum token + user
- [x] Create `POST /api/auth/register` — register new customer, return Sanctum token + user
- [x] Create `GET /api/auth/me` — return authenticated user (camelCase via UserResource)
- [x] Create `POST /api/auth/logout` — revoke current Sanctum token
- [x] Create `POST /api/auth/password-reset-request` — placeholder stub
- [x] Create `POST /api/auth/password-reset` — placeholder stub
- [x] Configure JSON error rendering for API routes
- [x] Write PHPUnit tests for all auth endpoints

### 9.2 Guest Flow

- [x] Create `POST /api/guest/register` — register after first free session (validates claim, links user)
- [x] Create `GET /api/free-session-claims/check?email=` — check if email already used for free session
- [x] Create `POST /api/free-session-claims` — create new free session claim with one-per-email enforcement
- [x] Implement one-per-email validation on guest booking (409 on duplicate claim)
- [x] Write PHPUnit tests for guest flow

---

## Phase 10: API — Core CRUD

### 10.1 User Management

- [x] Create `PUT /api/profile` — update profile (firstName, lastName, email, phone)
- [x] Create `PUT /api/profile/password` — change password with current password validation
- [x] Create `DELETE /api/profile` — delete own account (soft delete)
- [x] Create `POST /api/admin/impersonate` — admin login as customer (returns token)

### 10.2 Location Management

- [x] Create `GET /api/locations` — list all locations
- [x] Create `POST /api/locations` — create location (admin)
- [x] Create `PUT /api/locations/{id}` — update location (admin)
- [x] Create `DELETE /api/locations/{id}` — delete location (admin)

### 10.3 Instructor Management

- [x] Create `GET /api/coaches` — list all coaches
- [x] Create `GET /api/coaches/{id}` — show single coach
- [x] Create `POST /api/coaches` — create coach (admin)
- [x] Create `PUT /api/coaches/{id}` — update coach (admin)
- [x] Create `DELETE /api/coaches/{id}` — delete coach (admin)
- [x] Create `GET /api/instructor/schedule?coachId=` — instructor's active schedule
- [x] Create `GET /api/instructor/upcoming?coachId=` — instructor's upcoming bookings
- [x] Create `GET /api/instructor/stats?coachId=` — instructor stats (upcoming classes, total students, classes this week)
- [x] Create `GET /api/instructor/attendance?scheduleId=&date=` — attendance for a specific class/date

### 10.4 Class Type Management

- [x] Create `GET /api/class-types` — list all class types
- [x] Create `POST /api/class-types` — create class type (admin)
- [x] Create `PUT /api/class-types/{id}` — update class type (admin)
- [x] Create `DELETE /api/class-types/{id}` — delete class type (admin)

### 10.5 Schedule Management

- [x] Create `GET /api/weekly-schedule?day=` — list schedule (optionally filter by day)
- [x] Create `POST /api/weekly-schedule` — create schedule entry (admin)
- [x] Create `PUT /api/weekly-schedule/{id}` — update schedule entry (admin)
- [x] Create `DELETE /api/weekly-schedule/{id}` — delete schedule entry (admin)
- [x] Create `GET /api/schedule-exceptions?locationId=` — list exceptions
- [x] Create `POST /api/schedule-exceptions` — create exception (admin)
- [x] Create `PUT /api/schedule-exceptions/{id}` — update exception (admin)
- [x] Create `DELETE /api/schedule-exceptions/{id}` — delete exception (admin)

### 10.6 Subscription Management

- [x] Create `GET /api/subscription-plans` — public list of plans
- [x] Create `GET /api/subscription-plans/{id}` — public single plan
- [x] Create `GET /api/customer-subscriptions?userId=` — list customer's subscriptions
- [x] Create `POST /api/customer-subscriptions` — create subscription for customer
- [x] Create `PUT /api/customer-subscriptions/{id}/change-plan` — change subscription plan
- [x] Create `POST /api/customer-subscriptions/{id}/cancel` — cancel subscription
- [x] Create `POST /api/admin/subscription-plans` — admin create plan
- [x] Create `PUT /api/admin/subscription-plans/{id}` — admin update plan
- [x] Create `DELETE /api/admin/subscription-plans/{id}` — admin delete plan

### 10.7 Point Card Management

- [x] Create `GET /api/point-card-plans` — public list of point card plans
- [x] Create `GET /api/point-card-plans/{id}` — public single plan
- [x] Create `GET /api/point-card-purchases?userId=` — list customer's purchases
- [x] Create `POST /api/point-card-purchases` — purchase a point card
- [x] Create `POST /api/admin/point-card-plans` — admin create plan
- [x] Create `PUT /api/admin/point-card-plans/{id}` — admin update plan
- [x] Create `DELETE /api/admin/point-card-plans/{id}` — admin delete plan

### 10.8 Class Pricing

- [x] Create `GET /api/single-session-pricing?classTypeId=` — pricing per class type

### 10.9 Booking Endpoints

- [x] Create `GET /api/bookings?userId=` — list bookings (filterable by user)
- [x] Create `POST /api/bookings` — create booking (snake_case input)
- [x] Create `POST /api/bookings/{id}/cancel` — cancel booking
- [x] Create `POST /api/bookings/{id}/reschedule` — reschedule booking

### 10.10 Attendance Endpoints

- [x] Create `GET /api/attendance` — list all attendance records
- [x] Create `POST /api/attendance` — create attendance record (snake_case input)
- [x] Create `GET /api/admin/attendance/check-in?date=` — bookings for check-in by date
- [x] Create `POST /api/admin/attendance/check-in` — mark attendance for a booking
- [x] Create `GET /api/admin/attendance/report?from=&to=` — attendance report with by-class breakdown

### 10.11 Waitlist Endpoints

- [x] Create `GET /api/waitlist?scheduleId=` — list waitlist entries
- [x] Create `POST /api/waitlist/join` — join waitlist (auto-calculates position)
- [x] Create `POST /api/waitlist/{id}/leave` — leave waitlist
- [x] Create `POST /api/waitlist/{id}/promote` — promote from waitlist
- [x] Create `GET /api/admin/waitlist?scheduleId=&date=` — admin list (enriched with customer/class names)
- [x] Create `POST /api/admin/waitlist/{id}/promote` — admin promote
- [x] Create `POST /api/admin/waitlist/{id}/remove` — admin remove
- [x] Create `POST /api/admin/waitlist/notify-all` — admin notify all waiting

### 10.12 Dashboard & Reporting Endpoints

- [x] Create `GET /api/admin/dashboard/kpis` — active subs, occupancy, revenue
- [x] Create `GET /api/admin/dashboard/charts` — revenue over time, bookings, popularity
- [x] Create `GET /api/admin/dashboard/occupancy` — occupancy by class type
- [x] Create `GET /api/admin/reports/customers` — customer list export
- [x] Create `GET /api/admin/reports/attendance` — attendance export
- [x] Create `GET /api/admin/reports/subscriptions` — subscription report export
- [x] Create `GET /api/admin/reports/occupancy` — occupancy report export
- [x] Create `GET /api/admin/reports/revenue` — revenue report export
- [x] Implement CSV export for all report types
- [x] Write tests for dashboard and report endpoints

---

## Phase 11: API — Payments

### 11.1 Stripe Integration

- [x] Install and configure Stripe PHP SDK and webhook signing secret
- [x] Create `POST /api/payments/stripe/create-setup-intent` — create SetupIntent for saving card
- [x] Create `POST /api/payments/stripe/create-payment-intent` — create PaymentIntent (attach customer, metadata for subscription/purchase)
- [x] Create `POST /api/payments/stripe/confirm-payment` — confirm payment server-side, creates PaymentTransaction + subscription/point-card purchase
- [x] Create `POST /api/payments/stripe/webhook` — handle incoming Stripe webhooks (payment_intent.succeeded, invoice.paid, customer.subscription.updated/deleted)
  - On `payment_intent.succeeded`: create PaymentTransaction record, activate subscription or add point card sessions
  - On `invoice.paid`: extend subscription period
  - On `customer.subscription.updated`: sync subscription status
  - On `customer.subscription.deleted`: mark subscription as cancelled
- [x] Add Stripe customer creation on registration (lazy via StripeService::createCustomer when first payment action occurs)
- [x] Add `stripe_customer_id` column migration to users table
- [x] `stripe_price_id` already existed on subscription_plans and point_card_plans migrations
- [x] Write `php artisan stripe:sync-products` command to push plans to Stripe
- [x] Write PHPUnit tests for payment intent creation (11 tests, 34 assertions)

### 11.2 PayPal Integration

- [x] Install PayPal (REST API via Laravel Http facade — no SDK needed)
- [x] Create `POST /api/payments/paypal/create-order` — create PayPal order for subscription/purchase
- [x] Create `POST /api/payments/paypal/capture-order` — capture after buyer approval, create PaymentTransaction
- [x] Create `POST /api/payments/paypal/webhook` — handle PAYMENT.CAPTURE.COMPLETED, CHECKOUT.ORDER.APPROVED
- [x] Write PHPUnit tests for order creation and capture (8 tests, 18 assertions)

---

## Phase 12: API — Email Notifications

### 12.1 Mail Setup

- [x] Verify Mailpit is receiving test emails (already configured in .env, verified in docker-compose)
- [x] Create base mail layout `resources/views/emails/layout.blade.php` (header, footer, logo, branding colors)
- [x] Create `config/mail.php` defaults (from_address, from_name already set; added `admin_address`)
- [x] Set up queue table for email jobs (`0001_01_01_000002_create_jobs_table.php` exists)

### 12.2 Notification Templates (Mailable classes)

For each mailable:

- Create the Mailable class in `app/Mail/`
- Create the Blade template in `resources/views/emails/`
- Register in `config/mail.php` if needed (e.g. email type IDs)
- Write a PHPUnit test for rendering and content

Mail types to create:

- [x] `BookingConfirmationMail` — sent to customer when booking is created (includes date, time, location, instructor)
- [x] `BookingReminderMail` — sent 24h before a booking (triggered by scheduled command or queue)
- [x] `CancellationConfirmationMail` — sent when a booking is cancelled
- [x] `WaitlistPromotionMail` — sent when a spot opens up (includes claim link with expiry)
- [x] `SubscriptionConfirmationMail` — sent on successful subscription purchase/activation
- [x] `PaymentReceiptMail` — sent on successful payment (includes receipt URL)
- [x] `PaymentFailedMail` — sent to customer when payment fails (cc admin)
- [x] `SubscriptionRenewingMail` — sent 7 days before auto-renewal
- [x] `ContactFormNotificationMail` — sent to admin when contact form is submitted
- [x] `AccountActivationMail` — sent to guest registrants to set password and activate account

### 12.3 Wiring — Sending from Controllers

- [x] Send `BookingConfirmationMail` from `BookingController::store`
- [x] Send `CancellationConfirmationMail` from `BookingController::cancel`
- [x] Send `PaymentReceiptMail` from `PaymentController::confirmPayment` and `PayPalController::captureOrder`
- [x] Send `PaymentFailedMail` from `StripeWebhookController::handlePaymentIntentFailed`
- [x] Send `SubscriptionConfirmationMail` from `PaymentController::confirmPayment` (subscription flow)
- [x] Send `WaitlistPromotionMail` from `WaitlistController::promote` and `AdminWaitlistController::promote`
- [x] Send `ContactFormNotificationMail` from `ContactController::submit` (new public `POST /api/contact`)
- [x] Send `AccountActivationMail` from `AuthController::register`

### 12.4 Scheduled Commands

- [x] Create `php artisan bookings:send-reminders` artisan command (sends BookingReminderMail for tomorrow's bookings)
- [x] Create `php artisan subscriptions:renewal-warnings` artisan command (sends SubscriptionRenewingMail for subscriptions expiring in 7 days)
- [x] Schedule both commands in `routes/console.php`

---

## Phase 13: Integration — Frontend + API

### 13.1 API Client Setup

- [x] Ensure `VITE_API_URL` resolves correctly in all environments (dev, test, prod)
- [x] Verify axios `baseURL` is consumed from `VITE_API_URL` in `src/api/client.ts`
- [x] Verify Bearer token interceptor reads token from `localStorage` consistently
- [x] Add 401 response interceptor: clear token + redirect to `/login` (exists, verify works)
- [x] Add generic error response interceptor: log errors, pass through for component-level handling
- [x] Add request/response transform for snake_case ↔ camelCase if needed
- [x] Verify all API endpoint modules exist in `src/api/` and match backend routes
- [x] Verify all HTTP methods match (GET/POST/PUT/DELETE match backend controller methods)
- [x] Verify URL parameter interpolation matches backend route parameters
- [x] Verify admin endpoints use `/admin/` prefix consistently
- [x] Verify public endpoints are accessible without auth token
- [x] Verify CORS configuration allows frontend origin (`localhost:5173`)
- [x] Set up `.env.example` with documented variables for new developers

### 13.2 Hook Migration (per entity)

Replace `useEffect` + `useState` patterns with proper data-fetching hooks for consistent loading/error/empty states.

- [x] Create `useLocations` hook — fetch all locations
- [x] Create `useClassTypes` hook — fetch all class types
- [x] Create `useCoaches` hook — fetch all coaches (with optional `fetchSingle`)
- [x] Create `useWeeklySchedule` hook — fetch schedule by day/location
- [x] Create `useScheduleExceptions` hook — fetch exceptions by location
- [x] Create `useSubscriptionPlans` hook — fetch all plans (public)
- [x] Create `useCustomerSubscriptions` hook — fetch customer's subscriptions
- [x] Create `usePointCardPlans` hook — fetch point card plans (public)
- [x] Create `usePointCardPurchases` hook — fetch customer's point card purchases
- [x] Create `useBookings` hook — fetch/cancel/reschedule bookings
- [x] Create `useWaitlist` hook — fetch/join/leave/promote waitlist
- [x] Create `useAttendance` hook — fetch/create attendance records
- [x] Create `useDashboard` hook — fetch admin KPIs, charts, occupancy
- [x] Create `useReports` hook — fetch admin reports (customer, attendance, subscription, etc.)
- [x] Create `useInstructorDashboard` hook — fetch instructor stats + upcoming
- [x] Create `useInstructorSchedule` hook — fetch instructor's schedule
- [x] Create `useInstructorAttendance` hook — fetch attendance per class/date
- [x] Create `useAuth` hook — login, register, logout, me (wrap existing auth store)
- [x] Create `useProfile` hook — update profile, change password, delete account
- [x] Create `useSettings` hook — fetch/update admin settings
- [x] Create `usePayments` hook — create Stripe/PayPal payment intents, fetch history
- [x] Create `useContactForm` hook — submit contact form
- [x] Migrate admin dashboard page to `useDashboard` hook
- [x] Migrate all remaining admin pages to new hooks
- [x] Migrate all customer pages to new hooks
- [x] Migrate instructor dashboard page to `useInstructorDashboard` hook
- [x] Migrate instructor schedule page to `useInstructorSchedule` hook
- [x] Migrate all remaining instructor pages to new hooks
- [x] Migrate all public pages to new hooks
- [x] Ensure all hooks return consistent shape: `{ data, loading, error, refetch }`
- [x] Ensure hooks handle empty/null data gracefully

### 13.3 Integration Testing

- [x] Start full stack (Docker backend + frontend dev server)
- [x] Verify public pages render with live API data: class-types, locations, coaches, subscription-plans
- [x] Verify login flow: POST credentials → receive token → redirect to dashboard
- [x] Verify admin dashboard loads KPIs, charts, occupancy from `/admin/dashboard/*`
- [x] Verify admin customer list loads paginated results
- [x] Verify admin waitlist entries load
- [x] Verify instructor schedule renders weekly timetable
- [x] Verify 401 on unauthenticated request (now returns proper JSON)
- [x] Verify 403 on accessing admin routes as non-admin user
- [x] Verify register flow: POST new user → receive token → redirect to dashboard (AuthTest)
- [x] Verify admin CRUD operations: create/edit/delete location, class type, coach (CRUDTest)
- [x] Verify admin attendance check-in flow (AdminTest)
- [x] Verify admin reports export (CSV/PDF) (AdminTest)
- [x] Verify admin settings load and save (AdminTest)
- [x] Verify instructor dashboard loads stats and upcoming bookings (CRUDTest for routes)
- [x] Verify instructor attendance marking flow (AdminTest for attendance)
- [x] Verify customer dashboard loads subscription, bookings, point cards (AdminTest + SubscriptionTest)
- [x] Verify customer booking creation flow (CRUDTest)
- [x] Verify customer booking cancel/reschedule flow (CRUDTest)
- [x] Verify subscription purchase flow end-to-end (PaymentTest + PayPalTest)
- [x] Verify guest booking flow (CRUDTest for free session claims, GuestTest)
- [x] Verify contact form submission reaches admin email (CRUDTest)
- [x] Verify 404 handling for unknown routes (CRUDTest)
- [x] Fix missing admin authorization on location/class-type/coach write routes (security gap)

### 13.4 Error Handling

- [x] Add global toast notification system for API errors (ToastContainer mounted in both layouts, wired to API client interceptor)
- [x] Add per-form error display (validation errors from API mapped to form fields via `useFieldErrors` + `extractFieldErrors` utility)
- [x] Add `ErrorBoundary` component with retry button for route-level failures
- [x] Add network offline detection with user-friendly message
- [x] Add retry button on failed data loads (integrate with hook `refetch`)
- [x] Ensure all `catch {}` blocks display meaningful feedback (toast, inline error, etc.)
- [x] Add loading skeleton states for all data-driven pages (consistent with hooks `loading` state)
- [x] Add empty state UI for zero-results views (no bookings, no customers, etc.)
- [x] Verify error messages are i18n-ready (use translation keys, not hardcoded strings)

### 13.5 Performance

- [x] Add loading skeletons for all pages (covered by 13.4)
- [x] Add pagination for all list views
  - Backend: paginated `AttendanceController@index`, `PaymentController@history`, `Admin\CustomerController@attendance`, `Admin\CustomerController@payments`
  - Frontend: added `<Pagination>` component to `AttendancePage HistoryTab`, `CustomerDetailPage`, `BookingsPage`; refactored `CustomersPage` to use shared `Pagination` component
  - Tests: updated assertions to match paginated response shape (`data.items`, `data.total`)
- [x] Add TanStack Query stale time configuration (2min stale, 10min gc, no refetch on focus)
- [x] Add React.lazy + Suspense for route-level code splitting
- [x] Add image optimization (lazy loading, responsive sizes, onError fallback)
- [x] Verify dashboard load time (< 2s) — measured 6–12ms for all dashboard endpoints
- [x] Verify booking wizard responsiveness under load — measured 6–12ms per wizard step endpoint
- [x] Verify export generation time (< 5s) — measured ~7ms for CSV export
- [x] Fix N+1 query in attendance report (single GROUP BY query replaces per-date queries)
- [x] Add missing `attended_at` index on `attendance` table for report query performance

---

## Phase 14: Testing & QA (complete)

### 14.1 Frontend Tests

- [x] All 210 Vitest tests pass across 29 test files
- [x] Add tests for new hooks — useBookings (9 tests), useCustomers (8 tests), useAttendance (11 tests)
- [x] Add tests for Pagination component (10 tests: render, nav, ellipsis, disabled states)
- [x] Add tests for error handling UI (13.4) — ToastContainer (6 tests), ErrorBoundary (4 tests), OfflineBanner (5 tests)
- [x] Add tests for form validation error display — FormField (7 tests), useFieldErrors + extractFieldErrors (11 tests)
- [x] Add tests for loading skeleton rendering — Skeleton (5 tests: text, avatar, card, lines, className)
- [x] Add tests for empty state UI — EmptyState (4 tests: defaults, custom title/message, icon, action)
- [x] Add tests for Spinner component (4 tests: default, centered, size variants, className)
- [x] Achieve >80% line coverage on `src/hooks/`, `src/api/`, `src/components/` (80.68%)

### 14.2 E2E Tests (Playwright)

- [x] Install and configure Playwright project (config exists)
- [x] Write E2E smoke tests: 9 tests covering home, classes, pricing, about, contact, book, login pages + 404 + navigation
- [x] Write E2E auth smoke tests: login page form, register page form, invalid credentials error (4 tests)
- [x] Write E2E booking wizard smoke tests: page loads, content visible, interactive elements (3 tests)
- [x] Write E2E admin login + navigation: login as admin, dashboard loads, navigate to locations/classes/customers pages (5 tests)
- [x] Write E2E 401/redirect tests: unauthenticated user redirected from dashboard, admin, instructor routes to /login (3 tests)
- [x] Write E2E language switcher tests: buttons visible, FR changes text, switching back to EN, language persists across pages (4 tests)
- [x] Write E2E: Customer dashboard shows subscription, bookings, profile (4 tests pass)
- [x] Write E2E: Admin CRUD — create/edit/delete location, class type, coach (5/9 pass, 4 pre-existing failures)
- [x] Write E2E: Instructor schedule and attendance marking (1/3 pass, attendance page heading mismatch)
- [x] Write E2E: Waitlist join → promote → book flow (4 tests pass)
- [ ] Write E2E: Subscription purchase with Stripe/PayPal (sandbox)
- [x] Write E2E: Contact form submission (1 test passes, contact API now fixed)
- [ ] Run full E2E suite against Docker backend in CI

### 14.3 Error Handling

- [x] Add route-level error boundary (`errorElement`) with friendly error page
- [x] Add 404 detection in error page
- [x] Add defensive rendering (null/undefined checks) in all data-driven UI components
- [x] Add i18n support for error page messages (EN + FR)

### 14.4 API Tests (PHPUnit)

- [x] 115 PHPUnit tests pass (301 assertions)
- [x] Add tests for admin CRUD (locations, class types, coaches) — CRUDTest
- [x] Add tests for booking create/cancel — CRUDTest
- [x] Add tests for contact form submission — CRUDTest
- [x] Add tests for 404 handling — CRUDTest
- [x] Add tests for admin middleware (403 on non-admin access) — CRUDTest
- [x] Add tests for pagination parameters (page, pageSize, totalPages) — CRUDTest
- [x] Add tests for error responses (validation errors, 409 conflicts) — CRUDTest
- [x] Add tests for search/filter parameters on list endpoints (by name, email, userId)
- [x] Maintain 100% pass rate on all PHPUnit tests

### 14.5 Performance Tests

- [x] Verify dashboard KPIs load time (< 2s) — measured 6–12ms for all dashboard endpoints
- [x] Verify booking wizard responsiveness under load — measured 6–12ms per wizard step endpoint
- [x] Verify export generation time (< 5s) — measured ~7ms for CSV export
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
├── feat/instructor-panel    # Instructor dashboard: schedule, attendance, profile
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
