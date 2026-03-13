import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-package-types')
  getPackageTypes() {
    return this.appService.getPackageTypes();
  }

  @Get('get-weight-options')
  getWeightOptions() {
    return this.appService.getWeightOptions();
  }

  @Get('get-payment-methods')
  getPaymentMethods() {
    return this.appService.getPaymentMethods();
  }
}
