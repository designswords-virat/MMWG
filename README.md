# MMWG — Landing Page

The intake form for **Make My Website Great**. Clients submit their existing website, an optional reference, a chosen style (1 of 6 themes), and an accent color. Submissions land in `../submissions.json` at the project root, ready for Claude to pick up automatically.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3.4
- Framer Motion (animations)
- Lenis (smooth scroll)

## Setup

```powershell
cd "d:\DEMO MMWG\landing"
npm install
npm run dev
```

Then open http://localhost:3000.

## Data flow

1. User submits the form on `/`
2. `POST /api/submit` validates and appends an entry to `../submissions.json`
3. The redesign workflow (Claude) reads `submissions.json`, picks the latest `pending` entry, and follows `BRAIN/workflow.md`

## Submission schema

```json
{
  "submissions": [
    {
      "id": "20260511-142345-acme",
      "timestamp": "2026-05-11T14:23:45.000Z",
      "clientName": "Jane Doe",
      "clientEmail": "jane@acme.com",
      "existingUrl": "https://acme.com",
      "referenceUrl": "https://stripe.com",
      "theme": "tech",
      "color": "#7C3AED",
      "status": "pending",
      "deployedUrl": null
    }
  ]
}
```

`status` flows: `pending` → `in-progress` → `review` → `deployed`.

## Project structure

```
landing/
├── app/
│   ├── api/submit/route.ts   ← POST handler → writes submissions.json
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              ← the form page
├── components/
│   ├── BackgroundFX.tsx      ← animated gradient orbs + grid
│   ├── ColorPicker.tsx
│   ├── Field.tsx
│   ├── Form.tsx              ← the form
│   ├── Hero.tsx
│   ├── Nav.tsx
│   ├── SmoothScroll.tsx      ← Lenis wrapper
│   └── ThemeSelect.tsx       ← 6 theme cards
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Deploy

Connect the `landing/` folder to Vercel — it auto-detects Next.js. Note: the API route writes to a local JSON file, which won't persist on Vercel's serverless filesystem. For production submissions, swap the route to write to a database, KV, or external sheet.
