# AI Context

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- State: TanStack Query (server data) + Zustand (client/UI state)
- Backend: PHP 8 (Laravel REST API)
- Database: PostgreSQL
- Testing: Vitest + Testing Library (unit/component), Playwright (E2E)

## Development Environment

- **API**: Docker container (Laravel + PHP 8 + Apache/Nginx + PostgreSQL) at `application/backend/`
- **Frontend**: `npm run dev` in `application/frontend/` (Vite dev server)
- **docker-compose.yml** at project root — spins up Laravel + PostgreSQL for local dev

## Project Structure

```text
application/
      frontend/       # Vite + React + TypeScript
    src/
      public/     # Public site pages
      admin/      # Admin dashboard pages
      customer/   # Customer panel pages
      components/ # Shared UI components
      hooks/      # Custom React hooks
      stores/     # Zustand stores
      api/        # API client & endpoints
      types/      # TypeScript types
      lib/        # Utilities
  backend/        # Laravel PHP API
docs/             # Project documentation
docker-compose.yml
```

## Code Conventions

- Components: PascalCase, default exports for pages, named exports for shared components
- Hooks: `use` prefix, camelCase
- Stores: camelCase with `Store` suffix (e.g. `authStore`)
- API functions: camelCase with `Api` suffix (e.g. `fetchBookingsApi`)
- Types/interfaces: PascalCase with `Type`/`Interface` suffix or plain noun
- CSS: Tailwind utility classes only (no CSS modules or styled-components)

## Commit Convention (Conventional Commits)

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `style:` — formatting
- `refactor:` — code restructuring
- `test:` — adding/updating tests
- `chore:` — tooling, CI, dependencies

## Key Rules

- **Feature branches** — Each feature/step must be developed in its own git branch (e.g. `feat/class-booking`, `fix/payment-validation`). Never commit directly to `main`.
- **No overengineering** — Build what's needed, not what might be needed later. No abstraction layers "just in case." Refactor when there's a concrete need, not preemptively.
- **SOLID principles** — Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY** — Don't repeat yourself. Extract shared logic into hooks, utils, or components
- **YAGNI** — You aren't gonna need it. Don't build features or abstractions until there's a clear requirement for them.
- **Testing** — Write tests for critical logic and components, but don't aim for 100% coverage. Focus on meaningful tests that validate behavior, not implementation details.
- **Documentation** — Keep code well-commented where necessary, and maintain clear documentation in this `AGENTS.md` file for architecture decisions, conventions, and development guidelines. Update it as the project evolves.
