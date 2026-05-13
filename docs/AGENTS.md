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

- **Trunk-based Development** — `main` is the single long-lived branch and is always deployable. Feature/fix branches are short-lived (hours to 2 days max), branched off `main` and merged back via PR after CI passes.
- **Feature branches** — One branch per **logical deliverable** (something that can be reviewed, merged, and potentially toggled on independently), not per checkbox. Group related tasks into a single branch (e.g. `feat/design-system` covers all base components, `feat/public-pages` covers the entire public site). This keeps the graph clean and PRs meaningful. See `docs/TASKS.md` for the recommended branch grouping.
- **If a feature spans multiple days**, use **feature flags** to merge incomplete work into `main` without exposing it. This keeps integration continuous and avoids long-lived branches.
- **Feature flags** — Unfinished or unreleased features are gated behind a simple toggle (e.g. `if (featureFlags.bookingWizard)`). Flags are removed once the feature is fully shipped and stable. This lets `main` stay deployable at all times.
- **No `develop` branch** — Maintaining two long-lived branches adds sync overhead with no benefit for a single-dev or small team. All active work lives on `main` behind flags.
- **Releases** — A release is simply a tag on `main` (e.g. `v1.0.0`). No release branches needed. Rollbacks are done by flipping a feature flag off or reverting a commit, not by reverting merge commits across branches.
- **No overengineering** — Build what's needed, not what might be needed later. No abstraction layers "just in case." Refactor when there's a concrete need, not preemptively.
- **SOLID principles** — Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY** — Don't repeat yourself. Extract shared logic into hooks, utils, or components
- **YAGNI** — You aren't gonna need it. Don't build features or abstractions until there's a clear requirement for them.
- **Testing** — Write tests for critical logic and components, but don't aim for 100% coverage. Focus on meaningful tests that validate behavior, not implementation details.
- **Documentation** — Keep code well-commented where necessary, and maintain clear documentation in this `AGENTS.md` file for architecture decisions, conventions, and development guidelines. Update it as the project evolves.
- **Markdown lint** — All `.md` files must follow [markdownlint](https://github.com/DavidAnson/markdownlint) rules. Run `markdownlint-cli2` (or IDE plugin) before committing to catch violations. This applies to AI-generated content as well.
