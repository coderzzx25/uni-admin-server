import { Controller, Post, Req } from '@nestjs/common';

@Controller('jotform')
export class JotformController {
  @Post('webhook')
  async jotFormWebhook(@Req() req: any) {
    console.log('jotFormWebhook', req.body);
  }
}
