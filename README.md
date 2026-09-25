# Setu — Referral Continuity Prototype

Frontend for **SIH26133** (Accessibility and quality of public healthcare in
rural and underserved areas — Government of Maharashtra).

This is the narrow build described in the pitch: not a teleconsultation app,
but the **referral continuity thread** — a patient gets an ID, a frontline
worker records a visit offline, it syncs when connectivity returns, and a
facility dashboard shows whether the referral was actually completed.

## Run it

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). It works in any
browser — no backend to run, no environment variables to set.

## How the two sides talk to each other

There's no real server in this prototype. Instead:

- **`src/db.js`** — the on-device store (IndexedDB, via Dexie). This is what
  the ASHA worker's app writes to. It works with the network fully off.
- **`src/serverStore.js`** — a stand-in for the district health server
  (backed by `localStorage` under its own namespace). The dashboard reads
  **only** from here — never from the device store directly — so it
  genuinely only shows what has been synced.
- **`src/syncEngine.js`** — pushes unsynced records from the device store to
  the server store. Runs automatically when you flip back to "online."

This keeps the architecture honest for a demo: turning connectivity off
really does cut the two stores apart, and turning it back on really does
require an explicit sync step, the same as a real deployment would.

## Demo script

1. Open **Field visit**, leave the status bar on "Online."
2. Click **Simulate offline** in the top bar — it turns from teal to ochre.
3. Fill in a new patient, record vitals, tick "This patient needs a
   referral," pick a facility and urgency, save.
4. Switch to **Facility dashboard** — nothing shows up. It's still sitting
   only on the device.
5. Go back to Field visit, click **Simulate online**. The pending-sync count
   clears automatically.
6. Switch to the dashboard again — the referral now appears in the
   **Created** column. Click **Move to next stage** to walk it through
   In transit → Received → Seen by doctor → Closed, and say out loud that
   this state machine is the thing the problem statement asks for
   ("referral tracking") and the thing most teams skip.

## What's deliberately out of scope here

This is frontend-only, tuned for the referral-continuity demo. Not built:
teleconsultation, diagnostic/medicine availability, a real backend, real
ABDM/FHIR integration, or auth. The data shapes (health ID format, patient/
visit/referral records) are written so that swapping `serverStore.js` for a
real API later doesn't require touching the UI components.

## Stack

- React + Vite
- Dexie.js (IndexedDB wrapper) for offline storage
- vite-plugin-pwa for the offline-capable service worker / installability
- Plain CSS (design tokens in `src/styles.css`) — no UI framework
- `Mukta` typeface — one family that covers both Latin and Devanagari, so
  the English/Marathi toggle doesn't need a font swap
