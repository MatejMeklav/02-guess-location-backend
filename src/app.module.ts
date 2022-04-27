import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { DatabaseConfig } from './database.config';
import { AuthModule } from './users/auth/auth.module';
import { EmailConfirmationModule } from './users/auth/email-confirmation.module';
import { EmailConfirmationService } from './users/auth/email-confirmation.service';
import { EmailModule } from './users/auth/email.module';
import EmailService from './users/auth/email.service';
import { UsersModule } from './users/users.module';
import { LocationModule } from './location/location.module';
import { GuessController } from './guess/guess.controller';
import { GuessService } from './guess/guess.service';
import { GuessModule } from './guess/guess.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    UsersModule,
    AuthModule,
    EmailConfirmationModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        signOptions: { expiresIn: '11m' },
      }),
      inject: [ConfigService],
    }),
    LocationModule,
    GuessModule,
  ],
  controllers: [AppController, GuessController],
  providers: [AppService, EmailConfirmationService, EmailService],
})
export class AppModule {}
