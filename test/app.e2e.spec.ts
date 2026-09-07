import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

import { AppModule } from '../src/app.module.js';

describe('Application (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      database: 'connected',
    });

    expect(response.body.timestamp).toEqual(
      expect.any(String),
    );
  });

  it('/graphql profile (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            profile {
              name
              skills {
                name
              }
              experience {
                company
                position
              }
              projects {
                name
              }
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();

    expect(response.body.data.profile.name).toBe(
      'Максим Малютин',
    );

    expect(
      response.body.data.profile.skills.length,
    ).toBeGreaterThan(0);

    expect(
      response.body.data.profile.experience.length,
    ).toBeGreaterThan(0);

    expect(
      response.body.data.profile.projects.length,
    ).toBeGreaterThan(0);
  });
});