import { z } from 'zod';

export const livekitTokenSchema = z.object({
  dealerId: z.string().min(1),
  roomName: z.string().min(1),
  participantIdentity: z.string().min(1),
  participantName: z.string().min(1),
  grants: z
    .object({
      publisher: z.boolean().optional().default(true),
      subscriber: z.boolean().optional().default(true),
    })
    .default({ publisher: true, subscriber: true }),
});

export const bookingSchema = z.object({
  dealerId: z.string().min(1),
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
  }),
  appointment: z.object({
    startTimeISO: z.string().datetime(),
    notes: z.string().optional(),
  }),
  recordingUrl: z.string().url().optional(),
  sms: z.object({
    enabled: z.boolean(),
  }),
});

export type LivekitTokenInput = z.infer<typeof livekitTokenSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
