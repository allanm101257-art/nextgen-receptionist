import { AccessToken } from 'livekit-server-sdk';
import { env } from '../config/env';
import { IntegrationConfigError, getMissingVars } from '../utils/integration';
import { LivekitTokenInput } from '../validation/schemas';

const requireLiveKitConfig = () => {
  const missing = getMissingVars(['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET']);
  if (missing.length) {
    throw new IntegrationConfigError('LiveKit', missing);
  }

  return {
    apiKey: env.livekitApiKey as string,
    apiSecret: env.livekitApiSecret as string,
  };
};

export const mintLiveKitToken = async (input: LivekitTokenInput): Promise<string> => {
  const config = requireLiveKitConfig();
  const token = new AccessToken(config.apiKey, config.apiSecret, {
    identity: input.participantIdentity,
    name: input.participantName,
  });

  token.addGrant({
    roomJoin: true,
    room: input.roomName,
    canPublish: input.grants.publisher ?? true,
    canSubscribe: input.grants.subscriber ?? true,
  });

  return token.toJwt();
};
