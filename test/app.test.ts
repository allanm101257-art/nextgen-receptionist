import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('API', () => {
  it('GET /health returns ok true', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('POST /livekit/token returns 400 when required env vars are missing', async () => {
    delete process.env.LIVEKIT_URL;
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;

    const res = await request(app).post('/livekit/token').send({
      dealerId: 'nextgen',
      roomName: 'room-1',
      participantIdentity: 'user-1',
      participantName: 'User One',
      grants: { publisher: true, subscriber: true },
    });

    expect(res.status).toBe(400);
    expect(res.body.missingVars).toEqual(
      expect.arrayContaining(['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET']),
    );
  });
});
