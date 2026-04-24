# Pulse Check Interview Agent

HR Insights Co.'s self-service pulse check interview product. A prospective client clicks a magic link, walks through a 30-45 minute guided conversation with an AI agent, and the system generates a structured report (client-facing + internal-only) for the in-person follow-up meeting.

## What this repo is

A TypeScript monorepo with two deployed applications:

- `apps/api` — Node.js backend. Runs the interview orchestrator, talks to Supabase, reads the metric library from Google Sheets via a custom MCP server, generates DOCX reports to Google Drive, and sends notification emails via Resend.
- `apps/web` — React + Vite frontend. The browser experience the client walks through.

Plus:

- `packages/shared` — TypeScript types shared between api and web (the API contract).
- `config/03-INTERVIEW-FLOW.json` — the interview definition. All question wording, branching rules, calibration math, and adaptive depth thresholds. **Bianca-editable via the GitHub web UI.**
- `templates/` — starter DOCX report templates. Uploaded to Google Drive on first deploy; further edits happen in Word.
- `scripts/` — one-off operational scripts (e.g. seed the Google Sheet from the cleaned Excel).
- `docs/` — plain-English runbooks for the HR Insights Co. team.

## Where the spec lives

The full specification — what to build, why, how — lives in the build kit at:

`C:\Users\bianc\OneDrive\Documents\Claude\Projects\HR Insights Co\Pulse Check - Build Kit\`

Key files in the build kit:
- `README.md`, `CLAUDE.md` — orientation
- `01-PRODUCT-SPEC.md` through `09-MAINTENANCE.md` — functional and technical spec
- `prototype-reference.html` — behavioural source of truth
- `claude-design-output.html` — visual source of truth
- `DESIGN-TOKENS.md` — CSS variables

## What Bianca edits, and where

| Thing | Where | How |
|-------|-------|-----|
| Question wording, branching, calibration | `config/03-INTERVIEW-FLOW.json` | GitHub web UI → edit → commit |
| The metric library | Google Sheet (seeded from the cleaned Excel) | Edit in browser, 60-second cache |
| Client Report / Internal Brief look | DOCX templates in Google Drive | Edit in Word, save back |
| Who gets notified on session complete | Vercel env var `NOTIFICATION_EMAILS` | Vercel dashboard → Settings → Environment Variables |
| Admin users (team access to Supabase) | Supabase dashboard | Authentication → Users → Invite user |

## Build status

See the commit history and PR log. Build order is documented in the plan file; each phase lands as a PR.

## Running locally (for developers)

```
npm install
npm run dev:api     # backend on http://localhost:3000
npm run dev:web     # frontend on http://localhost:5173
```

Environment variables: copy `.env.example` to `.env.local` in each app and fill in.

## Contact

Product owner: Bianca Smit (biancasmit683@gmail.com).
