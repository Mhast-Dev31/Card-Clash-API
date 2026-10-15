# CARD CLASH API

Backend API for **CARD CLASH**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Mhax Santy D. De Venecia (Mhast-Dev31), BSCS [3-2]
- Group and game concept: [Group 2 - Card Clash]

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player is considered to have completed the game when their participant has a final result recorded in the `game_results` table when the match ends. This means the player is included in the final results whether they remained active or were eliminated before the game ended.

## Tables

1. `users` — Player accounts and roles.
2. `question_sets` — Collections of questions used in a game.
3. `power_cards` — Available Power Cards and their effects.
4. `questions` — Questions belonging to a question set.
5. `game_sessions` — Individual Card Clash game sessions.
6. `seat` — Connects users to games and stores their nickname and score for that game.
7. `players` — Players who joined a game session.
8. `participants` — Solo players or teams competing in a game.
9. `choices` — Answer choices for questions.
10. `question_cards` — Question Card configurations and scoring.
11. `decks` — Card decks assigned to participants.
12. `participant_members` — Links players to their participants or teams.
13. `cards` — Cards contained in participant decks.
14. `participant_power_cards` — Power Cards acquired by participants.
15. `answers` — Player answers and their resulting score and HP changes.
16. `aid_requests` — Requests made by eliminated participants for revival assistance.
17. `revivals` — Records revival attempts and their outcomes.
18. `comeback_challenges` — Comeback challenges after eligible revivals.
19. `comeback_cards` — Questions/cards used during comeback challenges.
20. `game_results` — Final results for each participant in a completed game.

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
