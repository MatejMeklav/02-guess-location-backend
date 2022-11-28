import { userStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getUser: jest.fn().mockReturnValue(userStub().user),
  getById: jest.fn().mockReturnValue(userStub().user),
});
