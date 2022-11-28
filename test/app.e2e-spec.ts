import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/users/auth/auth.module';
import { userSignin } from '../test/stubs/userSignin.stub';
import { userSignup } from '../test/stubs/userSignup.stub';
import { userSigninFalse } from './stubs/userSigninFalse.stub';
import { userSignupExists } from './stubs/userSignupExists.stub';
import { userInfoUpdate } from './stubs/userInfoUpdate.stub';
import { userInfoUpdateEmpty } from './stubs/userInfoUpdateEmpty.stub';
import {
  userPasswordUpdate,
  userPasswordUpdateDontMatch,
  userPasswordUpdateWrongOldPass,
} from './stubs/user-password-update.stub';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('signup authentication', () => {
    it('signup user and return user information', async () => {
      const response = await request(app.getHttpServer())
        .post('/signup')
        .send(userSignup)
        .expect(201);
      expect(response.body).toHaveProperty('email', userSignup.email);
    });
  });
  describe('signin authentication and protected routes testing', () => {
    it('tries to signup but email already exists', async () => {
      await request(app.getHttpServer())
        .post('/signup')
        .send(userSignupExists)
        .expect(400);
    });

    let jwtToken: string;
    it('signin user with email and password and return jwt bareer token', async () => {
      const response = await request(app.getHttpServer())
        .post('/signin')
        .send(userSignin)
        .expect(201);
      jwtToken = response.body.key;
      expect(jwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });
    it('tries to signin user but gets unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/signin')
        .send(userSigninFalse)
        .expect(401);
    });
    describe('update user information', () => {
      it('tries to update first, last name and email but is unauthorized', async () => {
        await request(app.getHttpServer())
          .put('/me/update-user-info')
          .send(userInfoUpdate)
          .expect(401);
      });
      it('tries to update but data missing', async () => {
        await request(app.getHttpServer())
          .put('/me/update-user-info')
          .send(userInfoUpdateEmpty)
          .set('Authorization', 'bearer ' + jwtToken)
          .expect(400);
      });
      it('update first, last name and email', async () => {
        const response = await request(app.getHttpServer())
          .put('/me/update-user-info')
          .send(userInfoUpdate)
          .set('Authorization', 'bearer ' + jwtToken)
          .expect(200);
        expect(response.body).toHaveProperty('email', userInfoUpdate.email);
        expect(response.body).toHaveProperty(
          'firstName',
          userInfoUpdate.firstName,
        );
        expect(response.body).toHaveProperty(
          'lastName',
          userInfoUpdate.lastName,
        );
      });
      describe('update users password', () => {
        it('changes password of user', async () => {
          const response = await request(app.getHttpServer())
            .put('/me/update-user-password')
            .send(userPasswordUpdate)
            .set('Authorization', 'bearer ' + jwtToken)
            .expect(200);
          expect(response.body).toHaveProperty('email', userSignin.email);
          expect(response.body).toHaveProperty('password', null);
        });
        it('tries to change password of user but is unauthorized', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-password')
            .send(userPasswordUpdate)
            .expect(401);
        });
        it('tries to change password but password and repeated password dont match', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-password')
            .send(userPasswordUpdateDontMatch)
            .set('Authorization', 'bearer ' + jwtToken)
            .expect(400);
        });
        it('tries to change password but old password is wrong', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-password')
            .send(userPasswordUpdateWrongOldPass)
            .set('Authorization', 'bearer ' + jwtToken)
            .expect(400);
        });
      });
      describe('update users profile image(url)', () => {
        let secureUrl: string;
        it('returns secure url', async () => {
          const response = await request(app.getHttpServer())
            .get('/secure-url')
            .set('Authorization', 'bearer ' + jwtToken)
            .expect(200);
          secureUrl = response.text;
          secureUrl = secureUrl.split('?')[0];
          const UUIDv4 = secureUrl.split('/')[3];
          expect(UUIDv4).toMatch(
            /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
          );
        });
        it('tries to get secure url but is unauthorized', async () => {
          await request(app.getHttpServer()).get('/secure-url').expect(401);
        });
        it('tries to save secure url to database but is unauthorized', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-profile-image')
            .send({ image: secureUrl })
            .expect(401);
        });
        it('tries to save secure url to database but is unauthorized', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-profile-image')
            .send({ image: secureUrl })
            .expect(401);
        });
        it('saves secure url to database', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-profile-image')
            .send({ image: secureUrl })
            .set('Authorization', 'bearer ' + jwtToken)
            .expect(200);
        });
        it('tries to save secure url but url is not valid', async () => {
          await request(app.getHttpServer())
            .put('/me/update-user-profile-image')
            .send({ image: '' })
            .set('Authorization', 'bearer ' + jwtToken)
            .expect(400);
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
