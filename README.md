# one_rail_recruitment_task

A Node.js (TypeScript) REST API built using a hexagonal (ports & adapters) architecture, dependency injection, MySQL with Sequelize ORM, and Swagger documentation.

---

## Requirements

- Node.js (recommended version according to `.nvmrc`)
- pnpm
- Docker + Docker Compose (for database and caching)

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

3. Start infrastructure using Docker Compose:

```bash
pnpm compose
```

4. Run database migrations and seeders:

```bash
pnpm migrate:up
pnpm seed
```

5. Start the application:

```bash
pnpm dev
```

5. Stop infrastructure :

```bash
pnpm compose-down
```

The API will be available on the port defined in `.env`

---

## Running with Docker (API + Database)

Build docker image:

```bash
pnpm docker-build
```

---

## Swagger UI

After starting the application, the Swagger UI is available at the following endpoint:

- `http://localhost:<PORT>/swagger`

---

## Running Tests

Run the full test suite:

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

- **Architecture**: Hexagonal architecture (ports & adapters) to clearly separate domain logic from infrastructure (HTTP, database), improving testability and maintainability.
- **Dependency Injection**: Centralized DI container to reduce coupling and enable easy mocking in tests.
- **ORM**: **Sequelize** with MySQL for rapid schema modeling, migrations, and seed data.
- **Error Handling**: Centralized error-handling middleware with consistent HTTP error mapping (e.g. `400`, `404`, `409`).
- **Input Validation**: Validation performed at the HTTP adapter level (DTOs), ensuring domain logic operates only on valid data.
- **Caching**:
- **Swagger / OpenAPI**: Single source of truth for the API contract, enabling easy testing and integration.

---

## Repository Structure (High Level)

- `src/` – application source code
- `migrations/` – database migrations
- `seeders/` – initial seed data
- `test/unit/` – unit tests
- `Dockerfile`, `docker-compose.yml` – Docker setup
