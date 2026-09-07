import { Controller, Get } from '@nestjs/common';

import {
  AppService,
  HealthStatus,
} from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async getHealth(): Promise<HealthStatus> {
    return this.appService.getHealth();
  }
}