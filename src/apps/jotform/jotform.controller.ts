import { Body, Controller, Post } from '@nestjs/common';

@Controller('jotform')
export class JotformController {
  @Post('webhook')
  async jotFormWebhook(@Body() body: any) {
    console.log('jotFormWebhook', body);
  }
}
