# CoachKit

A full-featured appointment and event booking SaaS platform for fitness studios, sports centers, and wellness businesses.

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **State:** TanStack Query (server) + Zustand (client)
- **Backend:** PHP 8 (Laravel REST API)
- **Database:** PostgreSQL
- **Testing:** Vitest + Testing Library, Playwright (E2E), PHPUnit

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker + Docker Compose (for backend)
- PHP 8.x + Composer (optional, for local backend dev)

### Frontend

```bash
cd application/frontend
npm install
npm run dev
```

### Backend

```bash
docker compose up -d
```

## Development

See [docs/TASKS.md](docs/TASKS.md) for the full development roadmap and [docs/AGENTS.md](docs/AGENTS.md) for conventions and guidelines.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `style:` — formatting
- `refactor:` — code restructuring
- `test:` — adding/updating tests
- `chore:` — tooling, CI, dependencies

## License

MIT
