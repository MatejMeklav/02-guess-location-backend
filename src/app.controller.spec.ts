import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuessController } from './guess/guess.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, GuessController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
