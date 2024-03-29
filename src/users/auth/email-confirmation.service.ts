import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './VertificationTokenPayload';
import EmailService from './email.service';
import { UsersService } from '../users.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly configService: ConfigService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
    const vertificationResponse = this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
    return vertificationResponse;
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    console.log('dddd');
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
    return { status: 200 };
  }
  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
