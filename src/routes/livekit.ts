import { Router } from 'express';
import { z } from 'zod';
import { mintLiveKitToken } from '../services/livekitService';
import { livekitTokenSchema } from '../validation/schemas';

export const livekitRouter = Router();

livekitRouter.post('/livekit/token', async (req, res, next) => {
  try {
    const payload = livekitTokenSchema.parse(req.body);
    const token = await mintLiveKitToken(payload);
    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', issues: error.flatten() });
    }
    next(error);
  }
});
