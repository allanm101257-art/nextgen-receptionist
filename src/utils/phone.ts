import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const normalizePhoneToE164 = (input: string, defaultCountry: string = 'US'): string => {
  const parsed = parsePhoneNumberFromString(input, defaultCountry as any);
  if (!parsed || !parsed.isValid()) {
    throw new Error('Invalid phone number; please provide a valid phone number.');
  }
  return parsed.number;
};
