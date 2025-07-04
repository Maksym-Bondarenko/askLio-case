import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Express } from 'express';
  import * as pdfParse from 'pdf-parse';
  import { Multer } from 'multer';
  
  import { AIClassifierService } from '../ai/ai-classifier.service';
  
  /* ------------------ helpers ------------------ */
  
  interface ExtractedLine {
    description: string;
    unitPrice: number;
    amount: number;
    totalPrice: number;
    unit: string;
    commodityGroupId?: string;
    commodityGroupName?: string;
  }
  
  function extractField(text: string, rex: RegExp): string {
    const m = text.match(rex);
    return m ? m[1].trim().replace(/\s+/g, ' ') : '';
  }
  
  function extractOrderLines(text: string): ExtractedLine[] {
    const simplified = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    const pattern =
      /([A-Za-z0-9ÄÖÜäöüß\- ]+?)\s+(\d+)\s+€?([\d,.]+)\s+€?([\d,.]+)/g;
  
    const lines: ExtractedLine[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(simplified)) !== null) {
      lines.push({
        description: match[1].trim(),
        amount: parseInt(match[2]),
        unitPrice: parseFloat(match[3].replace(',', '.')),
        totalPrice: parseFloat(match[4].replace(',', '.')),
        unit: 'pcs',
      });
    }
    return lines;
  }
  
  /* ------------------ controller ------------------ */
  
  @Controller('api/upload')
  export class FileUploadController {
    constructor(private readonly ai: AIClassifierService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('pdf'))
    async upload(@UploadedFile() file: Express.Multer.File) {
      // 1) read PDF text
      const parsed = await pdfParse(file.buffer);
      const rawText = parsed.text;
  
      // 2) extract basic fields
      const vendorName = extractField(
        rawText,
        /(?:Vendor Name|Erstellt von):\s*(.*)/i,
      );
      const vatId = extractField(
        rawText,
        /(?:VAT ID|USt.-IdNr\.?):\s*(DE\d{9})/i,
      );
      const department = extractField(
        rawText,
        /(?:Department|Lieferadresse):\s*(.*)/i,
      );
      const totalCost = extractField(
        rawText,
        /(?:Gesamtsumme|Total Offer Cost):\s*€?([\d,.]+)/i,
      );
  
      // 3) extract order lines
      const orderLines = extractOrderLines(rawText);
  
      // 4) call GPT for commodity-group tagging
      for (const line of orderLines) {
        const cg = await this.ai.classify(line.description);
        line.commodityGroupId = cg.id;
        line.commodityGroupName = cg.name;
      }
  
      // 5) return JSON to frontend
      return {
        vendorName,
        vatId,
        department,
        totalCost,
        orderLines,
      };
    }
  }
  