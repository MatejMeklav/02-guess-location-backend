import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { AuthService } from './users/auth/auth.service';
import { EmailConfirmationService } from './users/auth/email-confirmation.service';
import { JwtAuthGuard } from './users/auth/jwt-auth.guard';
import { LocalAuthGuard } from './users/auth/local-auth-guard';
import { CreateUserDto } from './users/dto/create-user-dto';
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
  async getHello(): Promise<User[]> {
    return await this.usersService.findAll();
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
    const token = await Promise.resolve(this.authService.login(req.user));
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
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(JSON.stringify(image));
    return await this.usersService.saveImage(req.user.id, image);
  }
}
