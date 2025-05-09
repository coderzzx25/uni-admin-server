import { Body, Controller, Post, Req } from '@nestjs/common';

@Controller('test')
export class TestController {
  /**
   * 西语询盘
   */
  @Post('inquiry')
  inquiry(@Body() body: any, @Req() req: any) {
    console.log(body, req);
  }
}
