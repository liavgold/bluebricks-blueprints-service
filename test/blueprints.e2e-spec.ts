import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('BlueprintsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'blueprints_db_test',
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/blueprints (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/blueprints')
      .send({
        name: 'aws_neptune',
        version: '1.1.0',
        author: 'bluebricks@example.com',
        blueprint_data: {
          description: 'AWS Neptune Blueprint',
          manifest_version: 1,
          packages: [],
          props: {},
          outs: {},
        },
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('aws_neptune');
  });

  it('/api/blueprints (GET)', async () => {
    await request(app.getHttpServer())
      .post('/api/blueprints')
      .send({
        name: 'aws_neptune',
        version: '1.1.0',
        author: 'bluebricks@example.com',
        blueprint_data: { description: 'Test' },
      });

    const response = await request(app.getHttpServer())
      .get('/api/blueprints')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/api/blueprints/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/blueprints')
      .send({
        name: 'aws_neptune',
        version: '1.1.0',
        author: 'bluebricks@example.com',
        blueprint_data: { description: 'Test' },
      });

    const id = createResponse.body.id;
    const response = await request(app.getHttpServer())
      .get(`/api/blueprints/${id}`)
      .expect(200);

    expect(response.body.id).toBe(id);
    expect(response.body.name).toBe('aws_neptune');
  });
});