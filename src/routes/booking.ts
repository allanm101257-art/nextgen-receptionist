import { Router } from 'express';
import { z } from 'zod';
import { createBooking } from '../services/bookingService';
import { bookingSchema } from '../validation/schemas';

export const bookingRouter = Router();

bookingRouter.post('/booking', async (req, res, next) => {
  try {
    const payload = bookingSchema.parse(req.body);
    const result = await createBooking(payload);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', issues: error.flatten() });
    }
    next(error);
  }
});
