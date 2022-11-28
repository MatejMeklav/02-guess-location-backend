import { CreateUserDto } from '../../src/users/dto/create-user-dto';

export const userSignup: CreateUserDto = {
  email: 'test@email.si',
  password: 'passwordtest',
  repeatedPassword: 'passwordtest',
  firstName: 'testFirstName',
  lastName: 'testLastName',
};
