# nextgen-receptionist

MVP backend for NextGen live receptionist with:
- LiveKit token issuance
- HubSpot CRM booking logging
- Twilio SMS confirmations
- SQLite persistence (v1)

## Tech stack
- Node.js + Express + TypeScript
- SQLite + Drizzle ORM
- Zod validation

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template:
   ```bash
   cp .env.example .env
   ```
3. Fill required env vars in `.env`.
4. Run migrations and seed:
   ```bash
   npm run migrate
   npm run seed
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Environment variables
- `PORT` (default: `3000`)
- `DB_PATH` (default: `./data/app.db`)

### LiveKit
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

### HubSpot
- `HUBSPOT_PRIVATE_APP_TOKEN`

### Twilio
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`

If required integration env vars are missing, endpoints return `400` with clear missing variable names.

## API
### `GET /health`
Response:
```json
{ "ok": true }
```

### `POST /livekit/token`
Body:
```json
{
  "dealerId": "nextgen",
  "roomName": "room-123",
  "participantIdentity": "caller-1",
  "participantName": "Caller",
  "grants": { "publisher": true, "subscriber": true }
}
```
Response:
```json
{ "token": "<jwt>" }
```

### `POST /booking`
Body:
```json
{
  "dealerId": "nextgen",
  "customer": { "name": "Jane Doe", "phone": "+12065550123" },
  "appointment": { "startTimeISO": "2026-05-01T14:30:00.000Z", "notes": "Wants SUV" },
  "recordingUrl": "https://example.com/recording.mp3",
  "sms": { "enabled": true }
}
```
Response:
```json
{
  "bookingId": 1,
  "hubspot": { "contactId": "123", "dealId": "456" },
  "sms": { "sid": "SMxxxx" }
}
```

## Scripts
- `npm run dev` - start dev server with watch mode
- `npm run build` - compile TypeScript
- `npm run start` - run compiled server
- `npm run migrate` - create SQLite tables
- `npm run seed` - upsert default dealer (`nextgen`)
- `npm test` - run tests
