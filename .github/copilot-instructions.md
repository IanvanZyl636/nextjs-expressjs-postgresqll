# Copilot Instructions for nextjs-expressjs-postgresql

## Architecture Overview
- Monorepo structure with `apps/` (backend, frontend) and `libs/shared` for common code.
- Backend: Express.js API (`apps/backend`), uses Prisma ORM for PostgreSQL, JWT-based authentication (short-lived access tokens, long-lived refresh tokens).
- Frontend: Next.js app (`apps/frontend`).
- Shared types, constants, and Prisma client in `libs/shared`.

## Key Patterns & Conventions
- API routes are defined in `apps/backend/src/integrations/express/routers/`.
  - Auth routes: `/auth/register`, `/auth/login`, `/auth/refresh` (all POST).
  - `/auth/refresh` is a public route, only requires refresh token in body.
- Controllers in `apps/backend/src/integrations/express/controllers/`.
- Middleware in `apps/backend/src/integrations/express/middleware/`.
- JWT utilities in `apps/backend/src/services/auth/utils/jwt.util.ts`.
- Prisma schema split by domain in `apps/backend/src/integrations/prisma/models/`.
- Error handling via custom `HttpError` class.

## Developer Workflows
- **Backend:**
  - Start: `npm run dev` in `apps/backend` (uses nodemon).
  - Test: `npm test` in `apps/backend` (Jest).
  - Prisma migrations: edit `schema.prisma`, run migration commands.
- **Frontend:**
  - Start: `npm run dev` in `apps/frontend`.
- **Docker:**
  - Compose file at project root for multi-service orchestration.

## Integration Points
- Prisma ORM connects backend to PostgreSQL.
- JWT tokens for stateless authentication; refresh tokens stored in DB.
- Shared types/constants imported from `libs/shared`.

## Examples
- To add a new protected route: create router/controller, add JWT middleware.
- To extend user model: update Prisma schema, run migration, update shared types.

## Project-Specific Notes
- All auth endpoints are POST for security and convention.
- Refresh endpoint is public (no access token required).
- Use shared code from `libs/shared` for consistency.

---
If any section is unclear or missing, please provide feedback to improve these instructions.
