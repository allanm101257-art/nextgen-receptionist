import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from '../src/config/env';

const dbPath = path.resolve(process.cwd(), env.dbPath);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);

sqlite.exec(`
CREATE TABLE IF NOT EXISTS dealers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dealer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone_e164 TEXT NOT NULL,
  appointment_start_time_iso TEXT NOT NULL,
  appointment_notes TEXT,
  recording_url TEXT,
  hubspot_contact_id TEXT NOT NULL,
  hubspot_deal_id TEXT NOT NULL,
  twilio_sms_sid TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(dealer_id) REFERENCES dealers(id)
);

CREATE TABLE IF NOT EXISTS call_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER,
  dealer_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  recording_url TEXT,
  transcript_url TEXT,
  transcript_text TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(booking_id) REFERENCES bookings(id),
  FOREIGN KEY(dealer_id) REFERENCES dealers(id)
);
`);

sqlite.close();
console.log(`Migration complete at ${dbPath}`);
