import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dealers = sqliteTable('dealers', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  dealerId: text('dealer_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhoneE164: text('customer_phone_e164').notNull(),
  appointmentStartTimeISO: text('appointment_start_time_iso').notNull(),
  appointmentNotes: text('appointment_notes'),
  recordingUrl: text('recording_url'),
  hubspotContactId: text('hubspot_contact_id').notNull(),
  hubspotDealId: text('hubspot_deal_id').notNull(),
  twilioSmsSid: text('twilio_sms_sid'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const callRecords = sqliteTable('call_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id'),
  dealerId: text('dealer_id').notNull(),
  roomName: text('room_name').notNull(),
  recordingUrl: text('recording_url'),
  transcriptUrl: text('transcript_url'),
  transcriptText: text('transcript_text'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});
