import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email.confirmation.controller';
import EmailService from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        signOptions: { expiresIn: '11m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, EmailService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
