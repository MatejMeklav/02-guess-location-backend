import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password-dto';

export const userPasswordUpdate: UpdateUserPasswordDto = {
  password: 'testPassword',
  repeatedPassword: 'testPassword',
  oldPassword: 'testPassword',
};

export const userPasswordUpdateDontMatch: UpdateUserPasswordDto = {
  password: 'testPassword',
  repeatedPassword: 'testPasswordNotMatch',
  oldPassword: 'testPassword',
};

export const userPasswordUpdateWrongOldPass: UpdateUserPasswordDto = {
  password: 'testPassword',
  repeatedPassword: 'testPassword',
  oldPassword: 'testPasswordDontMatch',
};
