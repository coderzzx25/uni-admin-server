import { Body, Controller, Headers, Post, Req } from '@nestjs/common';

@Controller('jotform')
export class JotformController {
  @Post('webhook')
  async jotFormWebhook(@Body() body: any, @Headers('content-type') headers: string, @Req() req: any) {
    console.log('jotFormWebhook', body);
    console.log('req', req);
  }
}
