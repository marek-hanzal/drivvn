## How to run
- Copy `.env.example` -> `.env.local`
- `bun install`
- `docker compose up -d` (starts Postgres for the app)
- `bun run dev` (we'll skip production runtime mess)
- `bun run test` from repo root to run tests (tests are using it's own Postgres, managed by test runner itself)

Backend:
http://localhost:3031/ (OpenAPI spec), **you've to run migration endpoint (from the Scalar UI)**.

## Tests

Test infrastructure is based on my different project where I'm using isolated databases per test (template database), so I know everything is running
in fresh environment, this approach also works even on GitHub Actions, so it's CI friendly.

## Runtime

This app expects `Bun` as a runtime.

## AI Usage

- Concepts, code architecture, repo setup, everything belongs to me (and concepts invented by clever people before me), no LLM involved.

_But!_

Mechanical tasks (e.g. writing endpoints from the template and similar stuff) was delegated to a LLM.

## Server Architecture

I'm using lower domain architecture (flat domain instead of base role access, e.g. "public" / "user") because we're fully public here. In general I'm using
base "role" domain which separates data given role can see (higher role, e.g. "public" (broad public), "user" (user private data), "session" (logged user "public" data), ...).

Flat just to keep things a bit "simpler" - my current setup has major drawback when there may be a lot of domains, everything get spammed from the server down to the client + mixed data access which usually is wrong (until this is internal backend server with some API gateway).

> **Effect.js:**
>
> I was scared first time I saw that library, but now I don't give a shot without it, it's a brilliant piece of software despite being a bit hard to learn and use, also LLMs struggles with it a little bit.

## Notes

- i18n intentionally omitted, English only
- auth is intentionally omitted, if required, I would pick `Better Auth` as my default choice for this setup
- I'm also used to Knip as a secondary linting lever, not used in this project to keep things a bit simpler
- Everything is setup using my current approach to FE/BE architecture (may look overkill at first glance, but I _suppose_ you wanna see inside my head)
- `syncpack` - great tool for syncing monorepo stuff without breaking everything into pieces
- I'm used to `Biome` as somewhat all-in-one linte-formatty tool
- You'll see some `serverless` related stuff (nitro and so on), that's because this setup is serverless friendly, but with slight modifications (on server) it may run as a classic Node.js server too
- **`I'm really unhappy by using database-generated numeric IDs`**, I like to use `cuid2`, but to conform the task, I've used "classic" auto-gen ids.
- Tests run against PostgreSQL and cover the actual backend effects directly.
- I've skipped "better error" reporting (e.g. conflict on duplicate rows) as I've limited time I want to spent on this task...
- Zod may do quite complex validation (e.g. non-negative IDs and so on), but for simplicity, I'll keep "default" validations

> **King of the Notes**:
>
> This backend task is literally what I've done in Marsh, originally in PHP, later on rewritten basically to the same arch. like you see here, just with little differences (car -> vehicle, general enums for e.g. vehicle security, colors, ...), vendor/model and so on, so this topic is close to me :)
