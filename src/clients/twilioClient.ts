import twilio from 'twilio';
import { env } from '../config/env';
import { IntegrationConfigError, getMissingVars } from '../utils/integration';

const requireTwilioConfig = () => {
  const missing = getMissingVars(['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER']);
  if (missing.length) {
    throw new IntegrationConfigError('Twilio', missing);
  }

  return {
    accountSid: env.twilioAccountSid as string,
    authToken: env.twilioAuthToken as string,
    fromNumber: env.twilioFromNumber as string,
  };
};

export const sendBookingSms = async (to: string, message: string): Promise<{ sid: string }> => {
  const config = requireTwilioConfig();
  const client = twilio(config.accountSid, config.authToken);
  const msg = await client.messages.create({
    from: config.fromNumber,
    to,
    body: message,
  });

  return { sid: msg.sid };
};
