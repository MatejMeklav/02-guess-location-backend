import { Test } from '@nestjs/testing';
import { User } from '../entity/user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    describe('when getUser (byId) is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await usersController.getUser(userStub());
      });

      test('then it should call usersService', () => {
        expect(usersService.getById).toBeCalledWith(userStub().user.id);
      });
      test('then it should return user', () => {
        expect(user).toEqual(userStub().user);
      });
    });
  });
});
