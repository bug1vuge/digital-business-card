import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(): Promise<string> {
    await this.prisma.$queryRaw`SELECT 1`;

    return 'API and database are running';
  }
}