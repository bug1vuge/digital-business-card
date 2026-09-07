import { Test } from '@nestjs/testing';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { AppController } from './app.controller.js';
import {
  AppService,
  HealthStatus,
} from './app.service.js';

describe('AppController', () => {
  let controller: AppController;

  const getHealthMock =
    vi.fn<() => Promise<HealthStatus>>();

  const appServiceMock = {
    getHealth: getHealthMock,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    controller = moduleRef.get<AppController>(AppController);

    vi.clearAllMocks();
  });

  it('should return application health status', async () => {
    const healthStatus: HealthStatus = {
      status: 'ok',
      database: 'connected',
      timestamp: '2026-09-07T00:00:00.000Z',
    };

    getHealthMock.mockResolvedValue(healthStatus);

    await expect(controller.getHealth()).resolves.toEqual(
      healthStatus,
    );

    expect(getHealthMock).toHaveBeenCalledOnce();
  });
});