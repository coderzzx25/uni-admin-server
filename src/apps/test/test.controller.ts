import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';

interface IInquiryData {
  No_Label_name: string;
  No_Label_email: string;
  No_Label_message: string;
  No_Label_field_c70cdcb: string;
  No_Label_field_b127923: string;
  No_Label_field_18f8b6d: string;
  No_Label_field_e063889: string;
  form_id: string;
}

@Controller('test')
export class TestController {
  /**
   * 西语询盘
   */
  @Post('inquiry')
  @HttpCode(200)
  inquiry(@Body() body: any, @Req() req: any) {
    console.log(body, req);
    return 'ok';
  }
}
