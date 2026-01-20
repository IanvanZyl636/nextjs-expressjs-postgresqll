# Copilot Instructions for nextjs-expressjs-postgresql
```markdown
# Copilot Instructions — nextjs-expressjs-postgresql

Summary
- Monorepo: `apps/` (backend, frontend) + `libs/shared` for shared types/constants and Prisma client.
- Backend: Express + Prisma (Postgres). Frontend: Next.js (app dir). JWT auth with short-lived access & DB-backed refresh tokens.

Environment & runtime notes
- `apps/backend/src/index.ts` expects many env vars (see file). Common required vars: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `BACKEND_JWT_EXPIRATION`, `BACKEND_JWT_REFRESH_EXPIRATION`, SMTP and MINIO credentials, and `FRONTEND_URL`.
- Tests and dev runs assume a working Postgres (or a test DB). Docker compose at repo root can be used for multi-service environment.

Code layout & conventions (how to work here)
- API routers live in `apps/backend/src/integrations/express/routers/` (e.g. `auth.router.ts`). Routers are thin: they mount controllers and use `asyncHandlerMiddleware`.
- Controllers: `apps/backend/src/integrations/express/controllers/` — controllers do business logic and return via standard response models from `libs/shared`.
- Middleware: `apps/backend/src/integrations/express/middleware/` — add auth checks, async handlers, error handling here.
- Prisma models: split per-domain under `apps/backend/src/integrations/prisma/models/` (zmodel files and generated client). Update Prisma schema here and run migrations from the backend package context.
- Shared code: `libs/shared/src` contains constants (`constants/*.ts`), helpers, models, and prisma client helpers — import these instead of duplicating types.

Patterns & examples (pick these when changing/adding features)
- Auth: endpoints are POST-only (`/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`). See `auth.router.ts` and controllers for refresh/logout semantics (refresh token passed in request body).
- Protected routes: add your router under `routers/`, create a controller, then apply JWT middleware from `services/auth/utils/jwt.util.ts` to protect routes.
- File uploads: uses `multer` + `@aws-sdk/client-s3` or MinIO client (see `integrations/s3-client` and `helpers/sharp.helper.ts` for image processing).
- Swagger: API docs are initialized in backend (`integrations/swagger`) — JSDoc comments above router endpoints are used to generate docs.

Developer workflows & gotchas
- Always run `apps/backend/src/index.ts` env checks locally — missing env vars will throw and stop startup.
- Prisma migrations: edit schema under backend prisma folder and run migrations from `apps/backend` context. (Prisma client may be shared via `libs/shared`.)
- Tests: Jest is configured in `apps/backend`. Run from that package; tests may depend on DB and seeded data.

Files to reference when coding
- `apps/backend/src/index.ts` — startup and required env vars
- `apps/backend/src/integrations/express/routers/auth.router.ts` — example of routes + swagger comments
- `apps/backend/src/integrations/express/controllers/*` — controller pattern
- `libs/shared/src` — shared models, constants, prisma helpers

What not to change without review
- Shared public types in `libs/shared` (breaking changes require updating both apps).
- JWT/Refresh token semantics and DB refresh token storage — changing these affects auth flows across frontend and backend.

If you need more details
- If a requested pattern or file isn't present, search `apps/backend/src/integrations/express/` and `libs/shared/src` for similar examples; follow file-level patterns (router -> controller -> service -> prisma).

---
If any section is unclear or you want additional examples (e.g., a sample protected route or a minimal migration walkthrough), tell me which area to expand.

```
