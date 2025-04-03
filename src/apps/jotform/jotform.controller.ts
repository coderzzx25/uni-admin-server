import { Controller, Post, Req } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('jotform')
export class JotformController {
  @Post('webhook')
  @FormDataRequest()
  async jotFormWebhook(@Req() req: any) {
    console.log('jotFormWebhook', req.body.pretty);
  }
}
