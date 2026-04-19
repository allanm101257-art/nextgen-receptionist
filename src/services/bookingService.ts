import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { bookings, dealers } from '../db/schema';
import { createHubspotBooking } from '../clients/hubspotClient';
import { sendBookingSms } from '../clients/twilioClient';
import { normalizePhoneToE164 } from '../utils/phone';
import { BookingInput } from '../validation/schemas';

export type BookingResult = {
  bookingId: number;
  hubspot: {
    contactId: string;
    dealId: string;
  };
  sms: {
    sid?: string;
  };
};

export const createBooking = async (payload: BookingInput): Promise<BookingResult> => {
  const dealer = await db.query.dealers.findFirst({ where: eq(dealers.id, payload.dealerId) });
  if (!dealer) {
    throw new Error(`Dealer '${payload.dealerId}' not found`);
  }

  const phoneE164 = normalizePhoneToE164(payload.customer.phone);
  const hubspot = await createHubspotBooking({
    customerName: payload.customer.name,
    customerPhoneE164: phoneE164,
    appointmentStartTimeISO: payload.appointment.startTimeISO,
    notes: payload.appointment.notes,
    recordingUrl: payload.recordingUrl,
  });

  const [saved] = await db
    .insert(bookings)
    .values({
      dealerId: payload.dealerId,
      customerName: payload.customer.name,
      customerPhoneE164: phoneE164,
      appointmentStartTimeISO: payload.appointment.startTimeISO,
      appointmentNotes: payload.appointment.notes,
      recordingUrl: payload.recordingUrl,
      hubspotContactId: hubspot.contactId,
      hubspotDealId: hubspot.dealId,
      createdAt: new Date(),
    })
    .returning({ id: bookings.id });

  let smsSid: string | undefined;
  if (payload.sms.enabled) {
    const message = `Hi ${payload.customer.name}, your appointment is scheduled for ${payload.appointment.startTimeISO}.`;
    const sms = await sendBookingSms(phoneE164, message);
    smsSid = sms.sid;

    await db.update(bookings).set({ twilioSmsSid: smsSid }).where(eq(bookings.id, saved.id));
  }

  return {
    bookingId: saved.id,
    hubspot,
    sms: { sid: smsSid },
  };
};
