import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() req) {
    return await this.usersService.getById(req.user.id);
  }
}
