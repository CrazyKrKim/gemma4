import { gemmaProvider, ChatMessage } from '../providers/gemma.provider.js';
import { Readable } from 'stream';

export class GemmaService {
  async chat(messages: ChatMessage[], stream: boolean = false): Promise<string | Readable> {
    if (stream) {
      return gemmaProvider.getChatStream(messages);
    } else {
      return gemmaProvider.getChatCompletion(messages);
    }
  }

  async generate(prompt: string, stream: boolean = false): Promise<string | Readable> {
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    if (stream) {
      return gemmaProvider.getChatStream(messages);
    } else {
      return gemmaProvider.getChatCompletion(messages);
    }
  }
}

export const gemmaService = new GemmaService();
