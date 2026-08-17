# Orbit

A full-stack kanban project-management app: Express + Prisma + PostgreSQL backend with a Next.js client.

## Performance Improvements

### Server

- **Reduced database round-trips**: Removed redundant project existence lookups in the boards and tasks services (e.g. `getProject` was called multiple times per request). Each request now performs the minimum required queries.
- **Quieted query logging**: Prisma logging is set to `["warn", "error"]` in production instead of emitting a log line for every query, eliminating per-request log overhead.
- **Auth rate limiting**: Added `express-rate-limit` on authentication routes (login, register, refresh, forgot/reset password). Configurable via the `AUTH_RATE_LIMIT` env var (default 20 requests per 15 minutes).

### Client

- **Cache-aware board mutations**: Instead of refetching the entire board after every task/column mutation, the board cache is patched in place via `features/board/lib/board-cache.ts`. Task and column create/update/delete now update only the affected data in the React Query cache, so the board UI updates instantly with no extra network request. Full-board refetch is reserved for drag-and-drop moves, where server-side position reconciliation is required.
- **Deduplicated member queries**: The task dialog and the members list now share the same React Query key (`["organization", orgId, "members"]`), so opening a task dialog reuses the already-fetched member list instead of making a duplicate request.
- **Smarter query defaults** (`QueryProvider`): `refetchOnWindowFocus: false` stops unnecessary background refetches when the tab regains focus; `retry: 1` limits retries on flaky requests; `gcTime: 5 min` keeps cached data (e.g. boards, orgs) alive longer so navigating back doesn't re-fetch. Mutations do not retry.

## Testing

- Integration test suite under `server/tests` covers auth, organizations, projects, board/kanban, tasks, comments, and users (57 tests). Run with `npm test` in `server/`; tests run against the `orbit_test` database and truncate tables between tests.
