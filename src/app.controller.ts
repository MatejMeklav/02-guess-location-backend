import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/entity/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getHello(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
