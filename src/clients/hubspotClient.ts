import { Client } from '@hubspot/api-client';
import { env } from '../config/env';
import { IntegrationConfigError, getMissingVars } from '../utils/integration';

const requireHubSpotConfig = (): string => {
  const missing = getMissingVars(['HUBSPOT_PRIVATE_APP_TOKEN']);
  if (missing.length) {
    throw new IntegrationConfigError('HubSpot', missing);
  }
  return env.hubspotToken as string;
};

const createClient = (): Client => new Client({ accessToken: requireHubSpotConfig() });

export type HubspotBookingResult = {
  contactId: string;
  dealId: string;
};

export const createHubspotBooking = async (input: {
  customerName: string;
  customerPhoneE164: string;
  appointmentStartTimeISO: string;
  notes?: string;
  recordingUrl?: string;
}): Promise<HubspotBookingResult> => {
  const client = createClient();

  const searchRes = await client.apiRequest({
    method: 'POST',
    path: '/crm/v3/objects/contacts/search',
    body: {
      filterGroups: [{ filters: [{ propertyName: 'phone', operator: 'EQ', value: input.customerPhoneE164 }] }],
      properties: ['phone'],
      limit: 1,
    },
  });

  const searchJson = await searchRes.json();
  const existingContactId = searchJson?.results?.[0]?.id as string | undefined;

  const contactId = existingContactId
    ? existingContactId
    : (await (await client.apiRequest({
        method: 'POST',
        path: '/crm/v3/objects/contacts',
        body: {
          properties: {
            firstname: input.customerName,
            phone: input.customerPhoneE164,
          },
        },
      })).json()).id;

  const date = new Date(input.appointmentStartTimeISO).toISOString().slice(0, 10);
  const deal = await client.apiRequest({
    method: 'POST',
    path: '/crm/v3/objects/deals',
    body: {
      properties: {
        dealname: `${input.customerName} - ${date}`,
      },
    },
  });
  const dealId = (await deal.json()).id as string;

  await client.apiRequest({
    method: 'PUT',
    path: `/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/deal_to_contact`,
  });

  const noteBody = [
    `Appointment: ${input.appointmentStartTimeISO}`,
    input.notes ? `Notes: ${input.notes}` : undefined,
    input.recordingUrl ? `Recording: ${input.recordingUrl}` : undefined,
  ]
    .filter(Boolean)
    .join('\n');

  const noteRes = await client.apiRequest({
    method: 'POST',
    path: '/crm/v3/objects/notes',
    body: {
      properties: {
        hs_note_body: noteBody,
        hs_timestamp: new Date().toISOString(),
      },
    },
  });
  const noteId = (await noteRes.json()).id as string;

  await client.apiRequest({
    method: 'PUT',
    path: `/crm/v3/objects/notes/${noteId}/associations/deals/${dealId}/note_to_deal`,
  });

  return { contactId, dealId };
};
