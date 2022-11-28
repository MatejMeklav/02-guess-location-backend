import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { GuessModule } from '../src/guess/guess.module';
import { LocationModule } from '../src/location/location.module';
import { UsersModule } from '../src/users/users.module';
import * as request from 'supertest';
import { userSignin } from './stubs/userSignin.stub';
import {
  createGuess,
  createGuessInvalid,
} from './stubs/guess/create-guess.stub';

describe('Guess controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, LocationModule, GuessModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Create, update, get all, get all guesses of location', () => {
    let jwtToken: string;
    const expiredJwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrY2pndGV1ZWdua3pjenNvZEB0bW1jdi5jb20iLCJpZCI6ImZkYzFkOWZkLWMzY2ItNDkwNS04Y2QxLTgwNzcwMTkyYTJjMyIsImlhdCI6MTY2NjAxODEzNiwiZXhwIjoxNjY2MDIwODM2fQ.0oBkOehc7cPwcpyu69YaG7vUo0er85iOsQrxRSgfX9U';
    it('signin user with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/signin')
        .send(userSignin)
        .expect(201);
      jwtToken = response.body.key;
    });
    describe('create guess', () => {
      it('tries to create new guess but is unauthorized', async () => {
        await request(app.getHttpServer())
          .post('/guess/create')
          .send(createGuess)
          .set('Authorization', 'bearer ' + expiredJwtToken)
          .expect(401);
      });
      it('tries to create new guess but data is invalid', async () => {
        await request(app.getHttpServer())
          .post('/guess/create')
          .send(createGuessInvalid)
          .set('Authorization', 'bearer ' + jwtToken)
          .expect(400);
      });

      it('creates new guess', async () => {
        const response = await request(app.getHttpServer())
          .post('/guess/create')
          .send(createGuess)
          .set('Authorization', 'bearer ' + jwtToken)
          .expect(201);
        expect(response.body).toHaveProperty('latitude', createGuess.latitude);
        expect(response.body).toHaveProperty(
          'longtitude',
          createGuess.longtitude,
        );
        expect(response.body).toHaveProperty('meters', createGuess.meters);
        expect(response.body).toHaveProperty(
          'locationId',
          createGuess.locationId,
        );
        console.log(response.body);
      });
    });
    describe('update guess', () => {
      it('tries to update guess but is unauthorized', async () => {
        await request(app.getHttpServer())
          .put('/guess/update')
          .send(createGuess)
          .set('Authorization', 'bearer ' + expiredJwtToken)
          .expect(401);
      });
    });
    afterAll(async () => {
      await app.close();
    });
  });
});
