import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    if ((await this.usersService.isEmailConfirmed(user.id)) === false) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }
}
