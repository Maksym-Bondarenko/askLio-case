import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RequestService } from '../request/request.service';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const svc = app.get(RequestService);

  const pdfDir = path.join(__dirname, 'samples');
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

  for (const f of files) {
    const buf = fs.readFileSync(path.join(pdfDir, f));
    const res = await axios.post('http://localhost:3000/api/upload',{
      pdf: buf.toString('base64')
    });
    await svc.create(res.data);   // uses service create(dto)
  }
  await app.close();
}
bootstrap();
