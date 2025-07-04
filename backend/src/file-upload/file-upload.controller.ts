// backend/src/file-upload/file-upload.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Express } from 'express';
  import * as pdfParse from 'pdf-parse';
  import OpenAI from 'openai';
  import { Multer } from 'multer';
  
  import { AIClassifierService } from '../ai/ai-classifier.service';
  
  interface OrderLineDTO {
    description: string;
    unitPrice:  number;
    amount:     number;
    totalPrice: number;
    unit?:      string;
    commodityGroupId?:   string;
    commodityGroupName?: string;
  }
  
  interface OfferDTO {
    vendorName:  string;
    vatId?:      string;
    department?: string;
    totalCost?:  number;
    orderLines:  OrderLineDTO[];
  }
  
  @Controller('api/upload')
  export class FileUploadController {
    private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
    constructor(private readonly ai: AIClassifierService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('pdf'))
    async upload(@UploadedFile() file: Express.Multer.File) {
      /* 1️⃣  Extract raw text from PDF */
      const text = (await pdfParse(file.buffer)).text
        .replace(/\r/g, '')
        .slice(0, 16000);               // limit prompt tokens
  
      /* 2️⃣  Ask GPT for structured JSON */
      const prompt = `
  You are a senior procurement assistant.  
  Return ONLY valid JSON matching this TypeScript interface (no markdown):
  
  interface OfferDTO {
    vendorName:  string;          // supplier or seller
    vatId?:      string;          // e.g. DE123456789, may be missing
    department?: string;          // "Offered to", "Delivery address", etc.
    totalCost?:  number;          // grand / net total, number only
    orderLines: {
      description: string;
      unitPrice:  number;         // price per unit
      amount:     number;         // quantity
      totalPrice: number;         // line total
      unit?:      string;         // pcs, qm, etc. default "pcs"
    }[];
  }
  
  PDF content below (---BEGIN--- / ---END---).  
  If something is missing, leave field null or 0; do **not** invent values.
  
  ---BEGIN---
  ${text}
  ---END---
  `.trim();
  
      let parsed: OfferDTO | null = null;
      try {
        const resp = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0,
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }],
        });
  
        parsed = JSON.parse(resp.choices[0].message.content ?? '');
      } catch (e) {
        console.warn('⚠️ GPT extraction failed, will fallback to regex.');
      }
  
      /* 3️⃣  Regex micro-fallback just to avoid 500 (optional) */
      if (!parsed) {
        const vendorFallback = text.match(/^(.*?GmbH|Vendor Name[:–]?\s*(.+))$/m)?.[1] ?? 'Unknown';
        parsed = { vendorName: vendorFallback, orderLines: [] };
      }
  
      /* 4️⃣  Tag commodity group for each line */
      for (const line of parsed.orderLines) {
        const cg = await this.ai.classify(line.description ?? '');
        line.commodityGroupId   = cg.id;
        line.commodityGroupName = cg.name;
      }
  
      /* 5️⃣  Coerce numeric strings to numbers (defensive) */
      parsed.totalCost = Number(parsed.totalCost) || 0;
      parsed.orderLines = parsed.orderLines.map(l => ({
        ...l,
        amount:     Number(l.amount)     || 0,
        unitPrice:  Number(l.unitPrice)  || 0,
        totalPrice: Number(l.totalPrice) || 0,
        unit: l.unit || 'pcs',
      }));
  
      /* 6️⃣  Return */
      if (!parsed.vendorName) {
        throw new InternalServerErrorException('Unable to parse vendor offer');
      }
      return parsed;
    }
  }
  