import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './users/auth/auth.service';
import { EmailConfirmationService } from './users/auth/email-confirmation.service';
import { JwtAuthGuard } from './users/auth/jwt-auth.guard';
import { LocalAuthGuard } from './users/auth/local-auth-guard';
import { CreateUserDto } from './users/dto/create-user-dto';
import { UpdateUserImageDto } from './users/dto/update-user-image-dto';
import { UpdateUserInformationDto } from './users/dto/update-user-information.dto';
import { UpdateUserPasswordDto } from './users/dto/update-user-password-dto';
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
  async getHello(): Promise<any> {
    return 'Hello World!';
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(createUserDto);
    const response = await this.emailConfirmationService.sendVerificationLink(
      createUserDto.email,
    );
    console.log(response);
    return user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@Request() req) {
    const user = await this.usersService.getById(req.user.id);
    const token = await Promise.resolve(this.authService.login(user));
    return { key: token };
  }
  //make authentication
  @Post('/signin-face-recognition/:id')
  async signinFaceRecognition(@Param() params) {
    const user = await this.usersService.getById(params.id);
    const token = await Promise.resolve(this.authService.login(user));
    return { key: token };
  }
  @UseGuards(JwtAuthGuard)
  @Put('/me/update-user-info')
  updateProfileInfo(
    @Request() req,
    @Body() updateUserInformationDto: UpdateUserInformationDto,
  ) {
    return this.usersService.updateUserInformation(
      req.user.id,
      updateUserInformationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('secure-url')
  async getSecureUrl() {
    return await this.usersService.getSecureUrl();
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me/update-user-password')
  updateProfilePassword(
    @Request() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(
      req.user.id,
      updateUserPasswordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me/update-user-profile-image')
  async updateProfileImage(
    @Request() req,
    @Body() updateUserImageDto: UpdateUserImageDto,
  ) {
    return await this.usersService.saveImage(
      req.user.id,
      updateUserImageDto.image,
    );
  }
}
