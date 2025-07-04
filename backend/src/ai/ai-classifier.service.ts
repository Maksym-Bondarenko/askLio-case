// backend/src/ai/ai-classifier.service.ts
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

/* ──────────────────────────────────────────────────────────── */
/*  Commodity-group master list  (trim or extend as you like)  */
/* ──────────────────────────────────────────────────────────── */
export interface CommodityGroup {
  id: string;
  name: string;
}

const GROUPS: CommodityGroup[] = [
  { id: '004', name: 'Consulting' },
  { id: '020', name: 'Audio and Visual Production' },
  { id: '029', name: 'Hardware' },
  { id: '030', name: 'IT Services' },
  { id: '031', name: 'Software' },
  { id: '038', name: 'Marketing Agencies' },
  { id: '044', name: 'Warehouse and Operational Equipment' },
  /* … add the rest from README if needed … */
];

/* ──────────────────────────────────────────────────────────── */

@Injectable()
export class AIClassifierService {
  private readonly log = new Logger(AIClassifierService.name);

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Returns the best-matching commodity group for a line description.
   * If GPT fails or quota is exhausted → fallback “Unknown”.
   */
  async classify(raw: string | null | undefined): Promise<CommodityGroup> {
    const description = (raw ?? '').trim();
    if (!description) return { id: '000', name: 'Unknown' };

    /* quick keyword shortcut ↓  (avoid API cost on obvious hits) */
    const kw = description.toLowerCase();
    if (kw.includes('license') || kw.includes('subscription') || kw.includes('software')) {
      return { id: '031', name: 'Software' };
    }
    if (kw.includes('consulting')) {
      return { id: '004', name: 'Consulting' };
    }

    /* OpenAI fallback */
    try {
      const prompt = `
You are a procurement assistant.  
Given the item description below, return ONLY a valid JSON object  
matching the best commodity group from the list provided.

Item: "${description}"

Commodity groups:
${GROUPS.map(g => `${g.id}: ${g.name}`).join('\n')}

JSON format: {"id":"031","name":"Software"}
`.trim();

      const res = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      });

      // return JSON.parse(res.choices[0].message.content);
      return { id: '000', name: 'Unknown' };
    } catch (err) {
      this.log.warn(`AI classify failed → Unknown (${description})`);
      return { id: '000', name: 'Unknown' };
    }
  }
}
