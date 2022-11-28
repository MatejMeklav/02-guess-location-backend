import { CreateUserDto } from '../../src/users/dto/create-user-dto';

export const userSignupExists: CreateUserDto = {
  email: 'mekimeklav@gmail.com',
  password: 'passwordtest',
  repeatedPassword: 'passwordtest',
  firstName: 'testFirstName',
  lastName: 'testLastName',
};
