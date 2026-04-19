import cors from 'cors';
import express from 'express';
import { bookingRouter } from './routes/booking';
import { healthRouter } from './routes/health';
import { livekitRouter } from './routes/livekit';
import { IntegrationConfigError } from './utils/integration';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRouter);
app.use(livekitRouter);
app.use(bookingRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof IntegrationConfigError) {
    return res.status(400).json({ message: error.message, missingVars: error.missingVars });
  }

  if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Unexpected error' });
});
