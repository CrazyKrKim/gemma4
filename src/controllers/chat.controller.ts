import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { gemmaService } from '../services/gemma.service.js';
import { Readable } from 'stream';
import logger from '../utils/logger.js';

// 요청 검증 스키마
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1)
  })),
  stream: z.boolean().optional().default(false),
  temperature: z.number().min(0).max(2).optional()
});

const generateRequestSchema = z.object({
  prompt: z.string().min(1),
  stream: z.boolean().optional().default(false),
  max_tokens: z.number().optional()
});

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = chatRequestSchema.parse(req.body);
    const result = await gemmaService.chat(validated.messages, validated.stream);

    if (validated.stream && result instanceof Readable) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      result.pipe(res);
    } else {
      res.json({
        object: 'chat.completion',
        choices: [{
          message: {
            role: 'assistant',
            content: result as string
          },
          index: 0,
          finish_reason: 'stop'
        }]
      });
    }
  } catch (error) {
    next(error);
  }
};

export const handleGenerate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = generateRequestSchema.parse(req.body);
    const result = await gemmaService.generate(validated.prompt, validated.stream);

    if (validated.stream && result instanceof Readable) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      result.pipe(res);
    } else {
      res.json({
        object: 'text_completion',
        text: result as string,
        finish_reason: 'stop'
      });
    }
  } catch (error) {
    next(error);
  }
};
