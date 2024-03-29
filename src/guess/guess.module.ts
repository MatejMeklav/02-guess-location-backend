import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from '../location/location.module';
import { UsersModule } from '../users/users.module';
import { Guess } from './entity/guess.entity';
import { GuessController } from './guess.controller';
import { GuessService } from './guess.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guess]), UsersModule, LocationModule],
  providers: [GuessService],
  controllers: [GuessController],
  exports: [GuessService],
})
export class GuessModule {}
