import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './entity/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';
import { Guess } from '../guess/entity/guess.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess]),
    TypeOrmModule.forFeature([Location]),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    LocationModule,
  ],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
