import { Controller, Post, Req } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('jotform')
export class JotformController {
  @Post('webhook')
  @FormDataRequest()
  async jotFormWebhook(@Req() req: any) {
    console.log('REQ', req);
    console.log(req.body);

    const regex = /([^,:]+):([^,]*)(?:, |$)/g;
    const result = {};

    let match;
    while ((match = regex.exec(req.body.pretty)) !== null) {
      const key = match[1].trim().replace(/$.*$/, '').replace(/\s+/g, '_').toLowerCase();

      const value = match[2].trim();
      result[key] = value;
    }

    console.log(JSON.stringify(result, null, 2));
  }
}
