import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { userInfoUpdate } from '../test/stubs/userInfoUpdate.stub';
import { userSignin } from '../test/stubs/userSignin.stub';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/users/auth/auth.module';
import { AppModule } from '../src/app.module';

describe('Users controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('get user by Id', () => {
    it('tries to get user by id but is unauthorized', async () => {
      await request(app.getHttpServer()).get('/users/user').expect(401);
    });
    let jwtToken: string;
    it('signin user with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/signin')
        .send(userSignin)
        .expect(201);
      jwtToken = response.body.key;
    });
    it('returns user who is currently logged in by Id extracted from jwt token', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/user')
        .set('Authorization', 'bearer ' + jwtToken)
        .expect(200);
      expect(response.body).toHaveProperty('email', userSignin.email);
      expect(response.body).toHaveProperty(
        'firstName',
        userInfoUpdate.firstName,
      );
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
