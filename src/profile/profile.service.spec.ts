import { Test } from '@nestjs/testing';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PrismaService } from '../prisma/prisma.service.js';
import { ProfileModel } from './models/profile.model.js';
import { PROFILE_SLUG } from './profile.constants.js';
import { ProfileService } from './profile.service.js';

describe('ProfileService', () => {
  let service: ProfileService;

  const findUniqueOrThrowMock =
    vi.fn<(args: unknown) => Promise<ProfileModel>>();

  const prismaMock = {
    profile: {
      findUniqueOrThrow: findUniqueOrThrowMock,
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = moduleRef.get<ProfileService>(ProfileService);

    vi.clearAllMocks();
  });

  it('should return profile with nested relations', async () => {
    const profile: ProfileModel = {
      name: 'Максим Малютин',
      description: 'Frontend-разработчик',
      links: [],
      skills: [],
      experience: [],
      projects: [],
    };

    findUniqueOrThrowMock.mockResolvedValue(profile);

    await expect(service.getProfile()).resolves.toEqual(profile);

    expect(findUniqueOrThrowMock).toHaveBeenCalledWith({
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
  });
});