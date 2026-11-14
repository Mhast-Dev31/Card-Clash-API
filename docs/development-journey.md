# Development journey: Card Clash API

Student: Mhax Santy D. De Venecia · Section: 3-2 · Group: Group 2 - Card Clash

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: November 14, 2026 · Time spent: approximately 1 hour
- Goal: Add real accounts, password hashing, JWT authentication, and role-based access control.
- What I built: Added the password migration and seeders; implemented `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /users`, and `PATCH /users/:id/role`; exported the 45-request Accounts Postman collection.
- Evidence: commits `8b1aef0`, `57c9ef7`, `18b0e78`, `cfb93b4`, `4500516`, `ad0c514`, and `dcc9bf7`; pull request pending.
- Problem I hit: Invalid login responses became `500` because the error handler called a missing `mapDatabaseError` function.
- How I solved it: Implemented database-error mapping for user constraints, added the school ID uniqueness migration, and verified the auth and RBAC flows with Newman and the repository check.
- Decision I made and why: Registration always creates `PLAYER`, while only an existing `ADMIN` can change roles; this prevents self-service privilege escalation but requires a separately provisioned first admin.
- Changes to my design set: Added `password_hash` and the unique school ID rule to the user data model, plus authentication and admin-user endpoints.
- What I would explain to a classmate: Authentication proves who the caller is with a token; authorization checks whether that authenticated user has the required role.
- AI tools: Used Copilot SDK in VS Code for repository inspection, implementation assistance, and validation; I reviewed the resulting code and ran the checks locally.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
