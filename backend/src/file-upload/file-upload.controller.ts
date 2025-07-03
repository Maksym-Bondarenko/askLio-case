import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { Multer } from 'multer';
  import { Express } from 'express';
  import { FileInterceptor } from '@nestjs/platform-express';
  import * as pdfParse from 'pdf-parse';
  
  @Controller('api/upload')
    export class FileUploadController {
        @Post()
        @UseInterceptors(FileInterceptor('pdf'))
        async upload(@UploadedFile() file: Express.Multer.File) {
            const data = await pdfParse(file.buffer);
            const text = data.text;

            const extracted = {
                vendorName: extract(text, /(?:Vendor Name|Erstellt von):\s*(.*)/i),
                vatId: extract(text, /(?:VAT ID|USt.-IdNr\.?):\s*(DE\d{9})/i),
                department: extract(text, /(?:Department|Lieferadresse):\s*(.*)/i),
                totalCost: extract(text, /(?:Gesamtsumme|Total Offer Cost):\s*€?([\d,.]+)/i),
                orderLines: extractOrderLines(text),
              };

            return extracted;
        }
    }
  
    function extract(text: string, regex: RegExp): string {
        const match = text.match(regex);
        return match ? match[1].trim().replace(/\s+/g, ' ') : '';
    }
      
  
    function extractOrderLines(text: string): {
        description: string;
        unitPrice: number;
        amount: number;
        totalPrice: number;
        unit: string;
      }[] {
        const lines: {
          description: string;
          unitPrice: number;
          amount: number;
          totalPrice: number;
          unit: string;
        }[] = [];
      
        const simplified = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      
        const pattern = /([A-Za-z0-9\- ]+?)\s+(\d+)\s+€?([\d,.]+)\s+€?([\d,.]+)/g;
      
        let match;
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
      
      
  
  