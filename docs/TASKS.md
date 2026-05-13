# Development Tasks

## Development Order

1. **Frontend** — Build all UI with mock data (MSW / static fixtures). No backend dependency.
2. **Database** — Design schema, create migrations, implement seed scripts.
3. **API** — Build Laravel REST API with all endpoints.
4. **Integration** — Replace mocks with real API calls, glue frontend to backend.

---

## Phase 0: Environment & Scaffolding

### 0.1 Repository Setup

- [ ] Initialize git repo with `main` + `develop` branches
- [ ] Create `application/`, `docs/` directory structure
- [ ] Add `.gitignore` (Node, PHP, Laravel, Docker, OS files)
- [ ] Add `.editorconfig`
- [ ] Configure branch protection rules for `main`

### 0.2 Frontend Scaffolding

- [ ] Scaffold Vite + React + TypeScript project in `application/frontend/`
- [ ] Install and configure Tailwind CSS
- [ ] Install React Router, TanStack Query, Zustand, axios
- [ ] Install MSW (Mock Service Worker) for API mocking
- [ ] Install and configure Vitest + Testing Library
- [ ] Install and configure Playwright
- [ ] Set up path aliases (`@/` -> `src/`)
- [ ] Configure ESLint + Prettier
- [ ] Create folder structure: `public/`, `admin/`, `customer/`, `components/`, `hooks/`, `stores/`, `api/`, `types/`, `lib/`, `mocks/`
- [ ] Set up base layout (header, footer, shell)
- [ ] Set up React Router with route placeholders for all pages
- [ ] Set up MSW handlers skeleton

### 0.3 Backend Scaffolding

- [ ] Scaffold Laravel project in `application/backend/`
- [ ] Configure `.env` for local PostgreSQL
- [ ] Set up Dockerfile + docker-compose.yml (Laravel + PHP 8 + PostgreSQL + Nginx)
- [ ] Install Sanctum (API auth) or JWT package
- [ ] Configure CORS for frontend dev server
- [ ] Set up PHPUnit configuration
- [ ] Create database migration skeleton

---

## Phase 1: Frontend — Design System

### 1.1 Design Tokens & Theme

- [ ] Configure Tailwind theme: colors (sky primary, rose accent, amber warm, teal secondary), fonts (Plus Jakarta Sans), border radius, shadows
- [ ] Create CSS custom properties file for design tokens
- [ ] Set up global styles (body, headings, links, transitions)

### 1.2 Base Components

- [ ] `Button` — variants (primary, secondary, outline, ghost), sizes, loading state, disabled, icon support
- [ ] `Input` — text, email, password, number variants; error state, label, helper text
- [ ] `Select` — native select with custom styling, error state
- [ ] `Textarea` — with resize control, error state
- [ ] `Card` — with optional header, footer, hover shadow, variants
- [ ] `Modal` — overlay, close button, body scroll lock, animation, sizes
- [ ] `Badge` — color variants, dot indicator
- [ ] `Avatar` — image fallback to initials, sizes
- [ ] `Spinner` — size variants, centered container
- [ ] `Skeleton` — loading placeholder, text/avatar/card variants
- [ ] `Toast` — success/error/info/warning, auto-dismiss, stackable
- [ ] `Pagination` — page numbers, prev/next, ellipsis
- [ ] `Tabs` — horizontal tab bar with content panel
- [ ] `Table` — sortable headers, striped rows, empty state, loading state
- [ ] `Dropdown Menu` — click trigger, positioned menu, item variants
- [ ] `Form Field` — wrapper with label, error, help text, required indicator

### 1.3 Navigation Components

- [ ] `Header` — logo, nav links, mobile hamburger menu, CTA button
- [ ] `Footer` — columns for links, social icons, copyright, legal links
- [ ] `Sidebar` — admin sidebar, collapsible, active state, nested items
- [ ] `Breadcrumbs` — auto-generated from route, with home link
- [ ] `Mobile Nav` — drawer-style navigation for mobile

### 1.4 Section/Page Components

- [ ] `Hero Section` — heading, subtext, CTA button, background
- [ ] `Feature Card` — icon, title, description, optional link
- [ ] `Review Card` — quote, author, rating stars, avatar
- [ ] `Instructor Card` — photo, name, bio, social links
- [ ] `Class Card` — image, name, duration, intensity badge, CTA
- [ ] `Pricing Card` — plan name, price, features list, CTA, featured variant
- [ ] `Contact Form` — name, email, phone, message fields, submit
- [ ] `Gallery Grid` — image grid with lightbox
- [ ] `Google Reviews Carousel` — auto-rotating review cards
- [ ] `Schedule Preview` — week view, day columns, class blocks

---

## Phase 2: Frontend — Mock Data Layer

### 2.1 Type Definitions

- [ ] Define `User`, `AdminUser`, `CustomerUser` types
- [ ] Define `Location` type
- [ ] Define `Coach` type
- [ ] Define `ClassType` type
- [ ] Define `WeeklySchedule` type
- [ ] Define `ScheduleException` type
- [ ] Define `SubscriptionPlan`, `CustomerSubscription` types
- [ ] Define `PointCardPlan`, `PointCardPurchase` types
- [ ] Add `default_price` field to `ClassType` type
- [ ] Define `Booking` type
- [ ] Define `Attendance` type
- [ ] Define `WaitlistEntry` type
- [ ] Define `PaymentTransaction` type
- [ ] Define API response wrapper types (`ApiResponse<T>`, `PaginatedResponse<T>`)

### 2.2 Mock Data Fixtures

- [ ] Create mock users (10 from jsonplaceholder.typicode.com structure, 1 admin)
- [ ] Create mock locations (3 sites with addresses, contact info)
- [ ] Create mock coaches (4 profiles)
- [ ] Create mock class types (6 types with colors, durations, capacities)
- [ ] Create mock weekly schedule (full week with assigned classes/coaches)
- [ ] Create mock schedule exceptions (2 holidays, 1 early closure)
- [ ] Create mock subscription plans (4 plans: monthly/annual variants)
- [ ] Create mock point card plans (3 plans)
- [ ] Add `default_price` field to mock class types
- [ ] Create mock customer subscriptions (mix of active/cancelled/expired)
- [ ] Create mock point card purchases
- [ ] Create mock bookings (confirmed, cancelled, attended, no-show, guest)
- [ ] Create mock attendance records
- [ ] Create mock waitlist entries
- [ ] Create mock payment transactions

### 2.3 MSW Handlers

- [ ] Locations handlers: list, get, create, update, delete
- [ ] Auth handlers: login, register, me, logout
- [ ] Users/coaches handlers: list, get, create, update, delete
- [ ] Class types handlers: list, get, create, update, delete
- [ ] Weekly schedule handlers: list by day/week, get, create, update, delete
- [ ] Schedule exceptions handlers: list, create, update, delete
- [ ] Subscription plans handlers: list, get
- [ ] Customer subscriptions handlers: list mine, list all (admin), create, cancel
- [ ] Point card plans handlers: list, get
- [ ] Point card purchases handlers: list mine, create
- [ ] Single session pricing handlers: list by class type
- [ ] Bookings handlers: list mine, list all (admin), create, cancel, check-in
- [ ] Attendance handlers: list, create, report
- [ ] Waitlist handlers: list, join, leave, promote
- [ ] Payment handlers: create intent, webhook mock
- [ ] Dashboard analytics handlers: KPIs, charts, occupancy

---

## Phase 3: Frontend — Public Site Pages

### 3.1 Home Page

- [ ] Build Hero section with CTA (first session free)
- [ ] Build Google Reviews carousel component
- [ ] Build Coach/Instructor story snippet section
- [ ] Build Weekly schedule preview (next 7 days)
- [ ] Build Class preview cards (grid of class types)
- [ ] Build Gallery section (image grid)
- [ ] Build Social media links section
- [ ] Build Footer with contact info
- [ ] Add responsive breakpoints for all sections
- [ ] Write tests for Home page sections

### 3.2 Classes Page

- [ ] Build class type listing grid
- [ ] Build individual class detail view (description, benefits, duration, intensity)
- [ ] Build class images/gallery per type
- [ ] Add booking CTA per class
- [ ] Write tests for Classes page

### 3.3 Pricing Page

- [ ] Build subscription plans cards (annual)
- [ ] Build subscription plans cards (monthly)
- [ ] Build point card plans listing
- [ ] Display single session price from class type `default_price`
- [ ] Wire all pricing data live from mock API (no hardcoding)
- [ ] Add insurance fee display
- [ ] Write tests for Pricing page

### 3.4 Booking Page

- [ ] Build schedule selection (week view, pick a day)
- [ ] Build class type filter
- [ ] Build time slot picker
- [ ] Build date confirmation step
- [ ] Build guest booking form (email, name)
- [ ] Build authenticated booking flow
- [ ] Build booking confirmation/success view
- [ ] Build booking error handling
- [ ] Show capacity remaining per slot
- [ ] Handle full-class waitlist prompt
- [ ] Write tests for Booking wizard (all steps)

### 3.5 About Page

- [ ] Build Coach bio section
- [ ] Build Mission/Vision section
- [ ] Build Team section
- [ ] Build Gallery section
- [ ] Write tests for About page

### 3.6 Contact Page

- [ ] Build Contact form (name, email, phone, message)
- [ ] Add form validation (required fields, email format)
- [ ] Build form submission flow with success/error feedback
- [ ] Display contact info (phone, email, address, map)
- [ ] Write tests for Contact page

### 3.7 SEO Setup

- [ ] Add react-helmet-async for per-page meta tags
- [ ] Set meta titles, descriptions, OG tags per page
- [ ] Add JSON-LD structured data (LocalBusiness)
- [ ] Generate sitemap.xml
- [ ] Add robots.txt
- [ ] Add canonical URLs

### 3.8 Analytics Setup

- [ ] Add Umami tracking script to layout
- [ ] Track page views
- [ ] Track booking confirmed event
- [ ] Track waitlist joined event
- [ ] Track subscription purchased event
- [ ] Track contact form submitted event

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

## Phase 7: Database

### 7.1 Migration: Core Tables

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

### 7.2 Seed Script

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

## Phase 8: API — Authentication

### 8.1 Auth Endpoints

- [ ] Create `POST /api/auth/register` — customer registration
- [ ] Create `POST /api/auth/login` — email + password, return JWT
- [ ] Create `POST /api/auth/logout` — invalidate token
- [ ] Create `GET /api/auth/me` — return current user profile
- [ ] Create `POST /api/auth/refresh` — refresh token
- [ ] Create `POST /api/auth/forgot-password` — send reset email
- [ ] Create `POST /api/auth/reset-password` — reset with token
- [ ] Implement JWT token generation, validation, refresh
- [ ] Implement auth middleware/guard for protected routes
- [ ] Implement admin middleware/guard for admin-only routes
- [ ] Write PHPUnit tests for all auth endpoints

### 8.2 Guest Flow

- [ ] Create `POST /api/guest/register` — register after first free session
- [ ] Create `GET /api/guest/check-email` — check if email already used for free session
- [ ] Implement one-per-email validation on guest booking
- [ ] Write tests for guest flow

---

## Phase 9: API — Core CRUD

### 9.1 User Management

- [ ] Create `GET /api/admin/users` — list all users (paginated, searchable)
- [ ] Create `GET /api/admin/users/{id}` — get user detail
- [ ] Create `PUT /api/admin/users/{id}` — update user
- [ ] Create `DELETE /api/admin/users/{id}` — soft delete user
- [ ] Write tests for user endpoints

### 9.2 Location Management

- [ ] Create `GET /api/locations` — list active locations (public)
- [ ] Create `GET /api/admin/locations` — list all locations (admin)
- [ ] Create `POST /api/admin/locations` — create location
- [ ] Create `GET /api/admin/locations/{id}` — get location detail
- [ ] Create `PUT /api/admin/locations/{id}` — update location
- [ ] Create `DELETE /api/admin/locations/{id}` — soft delete location
- [ ] Write tests for location endpoints

### 9.3 Instructor Management

- [ ] Create `GET /api/admin/coaches` — list all coaches
- [ ] Create `POST /api/admin/coaches` — create coach
- [ ] Create `GET /api/admin/coaches/{id}` — get coach detail
- [ ] Create `PUT /api/admin/coaches/{id}` — update coach
- [ ] Create `DELETE /api/admin/coaches/{id}` — soft delete coach
- [ ] Write tests for coach endpoints

### 9.4 Class Type Management

- [ ] Create `GET /api/class-types` — list active class types (public)
- [ ] Create `GET /api/admin/class-types` — list all class types (admin)
- [ ] Create `POST /api/admin/class-types` — create class type
- [ ] Create `GET /api/admin/class-types/{id}` — get class type detail
- [ ] Create `PUT /api/admin/class-types/{id}` — update class type
- [ ] Create `DELETE /api/admin/class-types/{id}` — soft delete class type
- [ ] Write tests for class type endpoints

### 9.5 Schedule Management

- [ ] Create `GET /api/schedule` — list schedule (filterable by week, date range, location_id)
- [ ] Create `GET /api/schedule/{id}` — get schedule detail with capacity info
- [ ] Create `POST /api/admin/schedule` — create schedule entry
- [ ] Create `PUT /api/admin/schedule/{id}` — update schedule entry
- [ ] Create `DELETE /api/admin/schedule/{id}` — delete schedule entry
- [ ] Create `GET /api/admin/schedule-exceptions` — list exceptions (filterable by location_id)
- [ ] Create `POST /api/admin/schedule-exceptions` — create exception
- [ ] Create `PUT /api/admin/schedule-exceptions/{id}` — update exception
- [ ] Create `DELETE /api/admin/schedule-exceptions/{id}` — delete exception
- [ ] Write tests for schedule endpoints

### 9.6 Subscription Management

- [ ] Create `GET /api/subscription-plans` — list active plans (public)
- [ ] Create `GET /api/admin/subscription-plans` — list all plans (admin)
- [ ] Create `POST /api/admin/subscription-plans` — create plan
- [ ] Create `PUT /api/admin/subscription-plans/{id}` — update plan
- [ ] Create `DELETE /api/admin/subscription-plans/{id}` — soft delete plan
- [ ] Create `GET /api/customer/subscriptions` — list current user's subscriptions
- [ ] Create `POST /api/customer/subscriptions` — subscribe to plan
- [ ] Create `PUT /api/customer/subscriptions/{id}/cancel` — cancel subscription
- [ ] Create `GET /api/admin/customer-subscriptions` — list all subscriptions (admin)
- [ ] Write tests for subscription endpoints

### 9.7 Point Card Management

- [ ] Create `GET /api/point-card-plans` — list active plans (public)
- [ ] Create `GET /api/admin/point-card-plans` — list all plans (admin)
- [ ] Create `POST /api/admin/point-card-plans` — create plan
- [ ] Create `PUT /api/admin/point-card-plans/{id}` — update plan
- [ ] Create `DELETE /api/admin/point-card-plans/{id}` — soft delete plan
- [ ] Create `GET /api/customer/point-cards` — list current user's point cards
- [ ] Create `POST /api/customer/point-cards` — purchase point card
- [ ] Write tests for point card endpoints

### 9.8 Class Pricing

- [ ] Include `default_price` in `GET /api/class-types` response
- [ ] Include `default_price` field in admin class type create/update endpoints
- [ ] Write tests for pricing endpoints

### 9.9 Booking Endpoints

- [ ] Create `POST /api/customer/bookings` — create booking (with deduction logic)
- [ ] Create `GET /api/customer/bookings` — list current user's bookings
- [ ] Create `GET /api/customer/bookings/{id}` — get booking detail
- [ ] Create `PUT /api/customer/bookings/{id}/cancel` — cancel booking
- [ ] Create `PUT /api/customer/bookings/{id}/reschedule` — reschedule booking
- [ ] Create `GET /api/admin/bookings` — list all bookings (admin)
- [ ] Create `GET /api/admin/bookings/{id}` — get booking detail (admin)
- [ ] Implement booking deduction priority: subscription -> point card -> redirect to purchase
- [ ] Implement cancellation: refund point, free subscription slot
- [ ] Implement capacity check on booking creation
- [ ] Write tests for booking endpoints (including edge cases)

### 9.10 Attendance Endpoints

- [ ] Create `POST /api/admin/attendance` — mark attendance for a booking
- [ ] Create `GET /api/admin/attendance` — list attendance (filterable by date, class, customer)
- [ ] Create `GET /api/admin/attendance/report` — session usage report per customer
- [ ] Create `GET /api/customer/attendance` — list current user's attendance
- [ ] Write tests for attendance endpoints

### 9.11 Waitlist Endpoints

- [ ] Create `POST /api/customer/waitlist` — join waitlist for a full class
- [ ] Create `DELETE /api/customer/waitlist/{id}` — leave waitlist
- [ ] Create `GET /api/customer/waitlist` — list current user's waitlist entries
- [ ] Create `GET /api/admin/waitlist` — list all waitlist entries (admin)
- [ ] Create `POST /api/admin/waitlist/{id}/promote` — manually promote
- [ ] Implement auto-promotion on cancellation with confirmation window
- [ ] Implement waitlist FIFO ordering
- [ ] Write tests for waitlist endpoints

### 9.12 Dashboard & Reporting Endpoints

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

## Phase 10: API — Payments

### 10.1 Stripe Integration

- [ ] Set up Stripe PHP SDK
- [ ] Create `POST /api/customer/payments/create-intent` — create payment intent
- [ ] Create `POST /api/customer/payments/subscription` — create Stripe subscription
- [ ] Create `POST /api/webhooks/stripe` — handle Stripe webhooks
- [ ] Handle `payment_intent.succeeded` — update transaction status
- [ ] Handle `payment_intent.payment_failed` — notify customer + admin
- [ ] Handle `invoice.payment_succeeded` — confirm subscription active
- [ ] Handle `invoice.payment_failed` — retry logic, notify
- [ ] Handle `customer.subscription.updated` — sync status
- [ ] Handle `customer.subscription.deleted` — cancel subscription
- [ ] Implement idempotency key support for webhooks

### 10.2 PayPal Integration

- [ ] Set up PayPal PHP SDK
- [ ] Create `POST /api/customer/payments/paypal/create-order` — create order
- [ ] Create `POST /api/customer/payments/paypal/capture-order` — capture after approval
- [ ] Write tests for payment endpoints

---

## Phase 11: API — Email Notifications

### 11.1 Mail Setup

- [ ] Configure mail driver (SMTP / Mailgun / SES)
- [ ] Set up email queue (database queue driver)
- [ ] Create base mail template (HTML + text versions)

### 11.2 Notification Templates

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

## Phase 12: Integration — Frontend + API

### 12.1 API Client Setup

- [ ] Create axios instance with base URL, interceptors, error handling
- [ ] Create typed API client functions per entity (replacing MSW)
- [ ] Set up TanStack Query hooks per entity (useQuery, useMutation)
- [ ] Set up query keys enum/constants
- [ ] Set up optimistic updates for mutations (booking, cancel, etc.)

### 12.2 Hook Migration (per entity)

- [ ] Replace MSW handlers with real API calls for locations
- [ ] Replace MSW handlers with real API calls for auth
- [ ] Replace MSW handlers with real API calls for users
- [ ] Replace MSW handlers with real API calls for coaches
- [ ] Replace MSW handlers with real API calls for class types
- [ ] Replace MSW handlers with real API calls for schedule
- [ ] Replace MSW handlers with real API calls for subscriptions
- [ ] Replace MSW handlers with real API calls for point cards
- [ ] Wire `default_price` from class types API to pricing display
- [ ] Replace MSW handlers with real API calls for bookings
- [ ] Replace MSW handlers with real API calls for attendance
- [ ] Replace MSW handlers with real API calls for waitlist
- [ ] Replace MSW handlers with real API calls for payments
- [ ] Replace MSW handlers with real API calls for dashboard/reports

### 12.3 Integration Testing

- [ ] Run full app with Docker backend + frontend dev server
- [ ] Test public site pages with live data
- [ ] Test booking flow end-to-end
- [ ] Test admin CRUD operations
- [ ] Test customer panel flows
- [ ] Test guest booking + account activation
- [ ] Test payment flows (Stripe test mode)
- [ ] Test email notifications (mailtrap or similar)
- [ ] Fix any integration issues

### 12.4 Error Handling

- [ ] Add global error boundary (React error boundaries)
- [ ] Add API error handling (toast notifications for errors)
- [ ] Add retry logic for transient failures (TanStack Query retry)
- [ ] Add offline/network error state UI
- [ ] Add form validation error display from API responses
- [ ] Add session expiry handling (redirect to login)

### 12.5 Performance

- [ ] Add loading skeletons for all pages
- [ ] Add pagination for all list views
- [ ] Add TanStack Query stale time configuration
- [ ] Add React.lazy + Suspense for route-level code splitting
- [ ] Add image optimization (lazy loading, responsive sizes)
- [ ] Verify dashboard load time (< 2s)
- [ ] Verify booking wizard responsiveness under load
- [ ] Verify export generation time (< 5s)

---

## Phase 13: Testing & QA

### 13.1 Frontend Tests

- [ ] Unit tests: all utils (lib/), Zustand stores, custom hooks
- [ ] Component tests: all shared components (Testing Library)
- [ ] Page-level integration tests: all public pages, customer panel, admin panel
- [ ] Mock API tests: all MSW handlers return correct data
- [ ] Target >= 80% coverage on utilities and stores

### 13.2 E2E Tests (Playwright)

- [ ] Public site: full navigation, class browsing, contact form
- [ ] Booking: guest first-session-free flow, authenticated booking, cancellation
- [ ] Admin: login, CRUD schedule/classes/subscriptions, attendance marking, report export
- [ ] Customer panel: login, view bookings, cancel, session usage
- [ ] Mobile responsive: verify layouts at mobile breakpoints
- [ ] All critical paths covered before launch

### 13.3 API Tests (PHPUnit)

- [ ] Auth endpoints: register, login, logout, me, refresh, password reset
- [ ] CRUD endpoints: all entities, all operations
- [ ] Booking logic: deduction priority, capacity edge cases, waitlist trigger
- [ ] Validation: input validation errors, auth guards, idempotency
- [ ] Payment webhooks: event handling, idempotency
- [ ] Email notifications: mailables render correctly

### 13.4 Performance Tests

- [ ] Dashboard load time < 2s (initial load)
- [ ] Booking wizard responsiveness under concurrent booking simulation
- [ ] Export generation < 5s for standard reports
- [ ] Lighthouse scores >= 90 (performance, accessibility, SEO)

---

## Phase 14: GDPR, Legal & Compliance

- [ ] Add cookie consent banner with explicit opt-in
- [ ] Create Privacy policy page
- [ ] Create Terms of Use and Sale (CGU/CGV) page
- [ ] Implement account deletion flow (with data retention rules)
- [ ] Add unsubscribe link in all email templates
- [ ] Add data retention auto-cleanup command (scheduled task)
- [ ] Verify GDPR compliance checklist

---

## Phase 15: CI/CD & Deployment

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
