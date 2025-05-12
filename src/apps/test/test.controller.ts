import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('test')
export class TestController {
  /**
   * 西语询盘
   */
  @Post('inquiry')
  @HttpCode(200)
  inquiry(@Body() body: any) {
    console.log(body);
    return 'ok';
  }
}
