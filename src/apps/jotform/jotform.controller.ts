import { Body, Controller, Headers, Post, Req } from '@nestjs/common';

@Controller('jotform')
export class JotformController {
  @Post('webhook')
  async jotFormWebhook(@Body() body: any) {
    console.log('jotFormWebhook', body);
  }
}
