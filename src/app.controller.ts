import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  @SetMetadata('require-login', true)
  bbb() {
    return 'bbb';
  }
}
