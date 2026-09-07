import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { ProfileModel } from './models/profile.model.js';
import { PROFILE_SLUG } from './profile.constants.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(): Promise<ProfileModel> {
    return this.prisma.profile.findUniqueOrThrow({
      where: {
        slug: PROFILE_SLUG,
      },
      include: {
        links: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        skills: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        experience: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        projects: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }
}