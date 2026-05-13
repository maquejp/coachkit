# Contributing

## Development Workflow

This project uses trunk-based development with `main` as the single long-lived branch.

1. **Branch off `main`** — Use a short-lived feature branch:
   - `feat/` — new features
   - `fix/` — bug fixes
   - `chore/` — tooling, dependencies, CI

2. **Commit using Conventional Commits** — See [README.md](README.md) for the commit format.

3. **Open a Pull Request** — PRs are the merge mechanism into `main`. Keep PRs small and focused on a single deliverable.

4. **Pre-commit checks** — The pre-commit hook runs automatically:
   - `markdownlint-cli2 --fix` on `.md` files
   - `prettier --write` on JS/TS/JSON/CSS/PHP files
   - ESLint on JS/TS/TSX files

## Code Conventions

- Components: PascalCase, default exports for pages, named exports for shared components
- Hooks: `use` prefix, camelCase
- Stores: camelCase with `Store` suffix (e.g. `authStore`)
- API functions: camelCase with `Api` suffix (e.g. `fetchBookingsApi`)
- Types/interfaces: PascalCase
- CSS: Tailwind utility classes only

See [docs/AGENTS.md](docs/AGENTS.md) for the full conventions reference.
