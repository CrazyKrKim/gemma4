import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { handleChat, handleGenerate } from './controllers/chat.controller.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Body parser
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    }, 'Request completed');
  });
  next();
});

// Routes
app.post('/api/chat', handleChat);
app.post('/api/generate', handleGenerate);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: 'gemma-4' });
});

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
