import { Readable } from 'stream';
import logger from '../utils/logger.js';
import ollama from 'ollama';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class GemmaProvider {
  private modelName = process.env.OLLAMA_MODEL || 'gemma';

  /**
   * 로컬 Ollama 엔진으로부터 실시간 스트리밍 응답을 생성합니다.
   */
  async getChatStream(messages: ChatMessage[]): Promise<Readable> {
    logger.info({ messages, model: this.modelName }, 'GemmaProvider.getChatStream started via Ollama');

    const stream = new Readable({
      read() {}
    });

    try {
      const response = await ollama.chat({
        model: this.modelName,
        messages: messages,
        stream: true,
      });

      (async () => {
        try {
          for await (const part of response) {
            stream.push(JSON.stringify({
              object: 'chat.completion.chunk',
              choices: [{
                delta: { content: part.message.content },
                index: 0,
                finish_reason: part.done ? 'stop' : null
              }]
            }) + '\n');
          }
          stream.push(null);
          logger.info('GemmaProvider.getChatStream (Ollama) completed');
        } catch (err) {
          logger.error({ err }, 'Error during Ollama streaming');
          stream.destroy(err as Error);
        }
      })();
    } catch (err) {
      logger.error({ err }, 'Failed to start Ollama chat stream');
      throw err;
    }

    return stream;
  }

  /**
   * 로컬 Ollama 엔진으로부터 일반(Non-streaming) 응답을 생성합니다.
   */
  async getChatCompletion(messages: ChatMessage[]): Promise<string> {
    logger.info({ messages, model: this.modelName }, 'GemmaProvider.getChatCompletion called via Ollama');
    
    try {
      const response = await ollama.chat({
        model: this.modelName,
        messages: messages,
        stream: false,
      });
      
      return response.message.content;
    } catch (err) {
      logger.error({ err }, 'Failed to get Ollama chat completion');
      throw err;
    }
  }
}

export const gemmaProvider = new GemmaProvider();
