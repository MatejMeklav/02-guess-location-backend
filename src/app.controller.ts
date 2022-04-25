import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './users/auth/auth.service';
import { EmailConfirmationService } from './users/auth/email-confirmation.service';
import { JwtAuthGuard } from './users/auth/jwt-auth.guard';
import { LocalAuthGuard } from './users/auth/local-auth-guard';
import { CreateUserDto } from './users/dto/create-user-dto';
import { UpdateUserDto } from './users/dto/update-user-dto';
import { User } from './users/entity/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get()
  async getHello(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersService.createUser(createUserDto);
    const response = await this.emailConfirmationService.sendVerificationLink(
      createUserDto.email,
    );
    console.log(response);
    return user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@Request() req) {
    const token = await Promise.resolve(this.authService.login(req.user));
    return { key: token };
  }
  @UseGuards(JwtAuthGuard)
  @Put('/me/update-user')
  updateProfileInfo(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
