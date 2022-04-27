import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './entity/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [
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
