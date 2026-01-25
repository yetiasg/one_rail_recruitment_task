# one_rail_recruitment_task

A Node.js (TypeScript) REST API built using a hexagonal (ports & adapters) architecture, Express, Sequelize ORM (MySQL), Redis caching, and Swagger (OpenAPI) documentation.

---

## Requirements

- Node.js (version defined in `.nvmrc`)
- pnpm
- Docker & Docker Compose

---

## Running the App Locally (without Docker for the API)

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Start infrastructure (MySQL + Redis):

```bash
pnpm compose
```

4. Run database migrations and seeders:

```bash
pnpm migrate:up
pnpm seed
```

5. Start the application in development mode:

```bash
pnpm dev
```

The API will be available on the port defined in `.env`.

To stop infrastructure:

```bash
pnpm compose-down
```

---

## Running with Docker (API + Dependencies)

The application can be run fully containerized using Docker Compose:

```bash
docker compose -f docker-compose.yml up -d
```

This starts:

- API: http://localhost:3000
- MySQL database
- Redis
- Redis Commander: http://localhost:8081

To stop all services:

```bash
docker compose -f docker-compose.yml down
```

---

## Swagger UI

Swagger (OpenAPI) documentation is available at:

```
http://localhost:3000/swagger
```

---

## Running Tests

Run all unit tests:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

Coverage report:

```bash
pnpm test:coverage
```

---

## Key Design Decisions

- **Architecture**: Hexagonal (ports & adapters) architecture for strong separation of concerns and high testability.
- **ORM**: **Sequelize** with MySQL for mature migrations, transactions, and schema control.
- **Error Handling**: Centralized HTTP error middleware with consistent error responses.
- **Validation**: Request validation at the transport layer (DTOs / schemas).
- **Caching**: **Redis** used to cache frequently accessed data and reduce database load.
- **Swagger / OpenAPI**: Swagger serves as the single source of truth for the API contract.
- **Testing**: Unit tests focus on domain and application layers with infrastructure mocked.

---

## Repository Structure (High Level)

- `src/` – application source code
- `migrations/` – database migrations
- `seeders/` – database seed data
- `test/unit/` – unit tests
- `Dockerfile` – multi-stage production build
- `docker-compose.yml` – container orchestration
- `.env.example` – environment variable template
