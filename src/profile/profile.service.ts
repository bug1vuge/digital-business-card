import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { PROFILE_SLUG } from './profile.constants.js';
import { ProfileModel } from './models/profile.model.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(): Promise<ProfileModel> {
    return this.prisma.profile.findUniqueOrThrow({
      where: {
        slug: PROFILE_SLUG,
      },
    });
  }
}