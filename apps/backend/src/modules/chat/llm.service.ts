import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  constructor(private configService: ConfigService) {}

  /**
   * Mock LLM service for local development
   * In production, integrate with OpenAI, Anthropic, or other LLM providers
   */
  async generateResponse(
    config: {
      model: string;
      temperature: number;
      systemPrompt: string;
      maxTokens?: number;
    },
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    // If no API key, use mock responses for demo
    if (!apiKey) {
      return this.getMockResponse(conversationHistory);
    }

    // TODO: Implement actual OpenAI/Anthropic integration
    // Example with OpenAI:
    // const response = await openai.chat.completions.create({
    //   model: config.model,
    //   messages: [
    //     { role: 'system', content: config.systemPrompt },
    //     ...conversationHistory,
    //   ],
    //   temperature: config.temperature,
    //   max_tokens: config.maxTokens,
    // });
    // return response.choices[0].message.content;

    return this.getMockResponse(conversationHistory);
  }

  private getMockResponse(
    conversationHistory: Array<{ role: string; content: string }>,
  ): string {
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    const userMessage = lastMessage?.content.toLowerCase() || '';

    // Simple mock responses for demo
    if (userMessage.includes('hello') || userMessage.includes('hi')) {
      return "Hello! I'm your AI assistant. How can I help you today?";
    }

    if (userMessage.includes('how are you')) {
      return "I'm functioning well, thank you for asking! How can I assist you?";
    }

    if (userMessage.includes('help')) {
      return 'I can help you with various tasks. What do you need assistance with?';
    }

    if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
      return 'Goodbye! Feel free to come back if you need any help.';
    }

    // Default response
    return `I understand you said: "${lastMessage?.content}". This is a mock response. In production, this would be powered by an actual LLM like OpenAI's GPT-4. How else can I assist you?`;
  }

  /**
   * Calculate approximate token count
   */
  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
