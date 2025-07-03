import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

const COMMODITY_GROUPS = [
  { id: '031', name: 'Software' },
  { id: '030', name: 'IT Services' },
  { id: '038', name: 'Marketing Agencies' },
  { id: '029', name: 'Hardware' },
  { id: '020', name: 'Audio and Visual Production' },
  { id: '044', name: 'Warehouse and Operational Equipment' },
  { id: '004', name: 'Consulting' },
  // Add more from the README list...
];

@Injectable()
export class AIClassifierService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async classify(description: string): Promise<{ id: string; name: string }> {
    const prompt = `
You are a procurement assistant. Given this item description:

"${description}"

Return the best matching commodity group ID and name from this list:

${COMMODITY_GROUPS.map((g) => `${g.id}: ${g.name}`).join('\n')}

Respond in JSON like: { "id": "031", "name": "Software" }
    `.trim();

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    try {
      const json = JSON.parse(completion.choices[0].message.content || '');
      return json;
    } catch (e) {
      return { id: '000', name: 'Unknown' };
    }
  }
}
