import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password-dto';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['locations'],
    });
    console.log(user);
    return user;
  }

  async getByIdNoRelations(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    return user;
  }
  async findOne(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['locations'],
    });
    return user;
  }
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
      user.image = null;
      await this.usersRepository.save(user);
      user.password = null;
      return user;
    } else {
      throw new BadRequestException();
    }
  }

  async updateUserInformation(
    userId: string,
    updateUserInformationDto: UpdateUserInformationDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (user) {
      user.email = updateUserInformationDto.email;
      user.firstName = updateUserInformationDto.firstName;
      user.lastName = updateUserInformationDto.lastName;
      await this.usersRepository.save(user);
      user.password = null;
      return user;
    } else {
      throw new BadRequestException();
    }
  }

  async updateUserPassword(
    userId: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    if (
      this.checkPassword(
        updateUserPasswordDto.password,
        updateUserPasswordDto.repeatedPassword,
      ) === false
    ) {
      throw new BadRequestException();
    }
    const hash = await this.hashPassword(updateUserPasswordDto.password);
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (
      user &&
      (await bcrypt.compare(updateUserPasswordDto.oldPassword, user.password))
    ) {
      user.password = hash;
      await this.usersRepository.save(user);
      user.password = null;
      return user;
    } else {
      throw new BadRequestException();
    }
  }

  async saveImage(userId: string, image: string) {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (user) {
      user.image = null;
      user.image = image;
      this.usersRepository.save(user);
      return user;
    }
  }

  async isEmailConfirmed(id: any) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    });
    if (user && user.isEmailConfirmed) {
      return true;
    } else {
      return false;
    }
  }

  async getSecureUrl() {
    const s3 = new S3({
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_ID'),
      secretAccessKey: this.configService.get<string>('AWS_ACCESS_KEY'),
      signatureVersion: 'v4',
    });
    const imageName = uuidv4();
    const params = {
      Bucket: '02-geotagger',
      Key: imageName,
      Expires: 60,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
  }
}
