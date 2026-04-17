import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Mock the module BEFORE anything else imports it
jest.unstable_mockModule('../services/gemma.service.js', () => ({
  gemmaService: {
    chat: jest.fn(),
    generate: jest.fn()
  }
}));

// 2. Import the modules that depend on the mock AFTER mocking
const { handleChat, handleGenerate } = await import('../controllers/chat.controller.js');
const { gemmaService } = await import('../services/gemma.service.js');
const { errorHandler } = await import('../middlewares/error.middleware.js');

const app = express();
app.use(express.json());
app.post('/api/chat', handleChat);
app.post('/api/generate', handleGenerate);
app.use(errorHandler as any);

describe('POST /api/chat', () => {
  it('should return 200 and completion if stream is false', async () => {
    (gemmaService.chat as any).mockResolvedValue('Hello from Gemma!');

    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'Hi' }],
        stream: false
      });

    expect(res.status).toBe(200);
    expect(res.body.choices[0].message.content).toBe('Hello from Gemma!');
  });

  it('should return 400 if messages are missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /api/generate', () => {
  it('should return 200 and completion for prompt', async () => {
    (gemmaService.generate as any).mockResolvedValue('Generated text');

    const res = await request(app)
      .post('/api/generate')
      .send({
        prompt: 'Tell me a story',
        stream: false
      });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Generated text');
  });

  it('should return 400 if prompt is missing', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({});

    expect(res.status).toBe(400);
  });
});
