import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

export interface CommodityGroup { id: string; name: string; }

const GROUPS: CommodityGroup[] = [
  { id: '004', name: 'Consulting' },
  { id: '020', name: 'Audio and Visual Production' },
  { id: '029', name: 'Hardware' },
  { id: '030', name: 'IT Services' },
  { id: '031', name: 'Software' },
  { id: '038', name: 'Marketing Agencies' },
  { id: '044', name: 'Warehouse and Operational Equipment' },
];

@Injectable()
export class AIClassifierService {
  private log = new Logger(AIClassifierService.name);
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async classify(raw: string | null | undefined): Promise<CommodityGroup> {
    const description = (raw ?? '').trim();
    if (!description) return { id: '000', name: 'Unknown' };

    /* cheap keyword shortcut */
    const kw = description.toLowerCase();
    if (kw.includes('license') || kw.includes('software'))    return GROUPS[4];
    if (kw.includes('consult'))                              return GROUPS[0];

    try {
      const prompt = `
Item: "${description}"
Which commodity group fits best?  Return ONLY JSON like {"id":"031","name":"Software"}

${GROUPS.map(g => `${g.id}: ${g.name}`).join('\n')}
`.trim();

      const res = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      });

      return JSON.parse(res.choices[0].message.content ?? '');
    } catch (e) {
      this.log.warn(`GPT classify failed (${description}) → Unknown`);
      return { id: '000', name: 'Unknown' };
    }
  }
}
