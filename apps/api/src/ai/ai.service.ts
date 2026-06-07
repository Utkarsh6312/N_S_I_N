import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private model: ChatGoogleGenerativeAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.model = new ChatGoogleGenerativeAI({
        model: 'gemini-1.5-pro',
        apiKey: apiKey,
      });
    } else {
      this.logger.warn('GEMINI_API_KEY not found. AI classification will use mock responses.');
    }
  }

  async classifyScamReport(description: string): Promise<any> {
    if (!this.model) {
      // Mock response for development without API key
      return {
        category: 'FINANCIAL',
        subCategory: 'UPI_FRAUD',
        entities: ['upi@bank'],
        confidence: 0.95,
        summary: 'Mock summary of the fraud.',
      };
    }

    try {
      const prompt = PromptTemplate.fromTemplate(`
        Analyze the following cyber fraud report description.
        Extract the category, sub-category, any relevant entities (phone numbers, URLs, UPI IDs), and provide a brief summary.
        Format the output strictly as JSON.

        Description: {description}
      `);

      const chain = prompt.pipe(this.model);
      const result = await chain.invoke({ description });
      
      const content = result.content.toString().replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(content);
    } catch (error) {
      this.logger.error('Error in AI classification', error);
      throw error;
    }
  }
}
