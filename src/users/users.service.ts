import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }
  async getByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      email: email,
    });
  }
  async findOne(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      email: email,
    });
  }
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  checkPassword(password: string, repeatedPassword: string): any {
    if (password != repeatedPassword) {
      return false;
    }
    return true;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (
      this.checkPassword(
        createUserDto.password,
        createUserDto.repeatedPassword,
      ) === false
    ) {
      throw new BadRequestException();
    }
    const hash = await this.hashPassword(createUserDto.password);
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (!user) {
      const user = new User();
      user.email = createUserDto.email;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.password = hash;
      user.isEmailConfirmed = false;
      await this.usersRepository.save(user);
      user.password = null;
      return user;
    } else {
      throw new BadRequestException();
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (
      this.checkPassword(
        updateUserDto.password,
        updateUserDto.repeatedPassword,
      ) === false
    ) {
      throw new BadRequestException();
    }
    const hash = await this.hashPassword(updateUserDto.password);
    if (user) {
      user.email = updateUserDto.email;
      user.firstName = updateUserDto.firstName;
      user.lastName = updateUserDto.lastName;
      user.password = hash;
      await this.usersRepository.save(user);
      user.password = null;
      return user;
    } else {
      throw new BadRequestException();
    }
  }
}
