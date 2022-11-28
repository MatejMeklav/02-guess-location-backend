import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from '../location/location.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateGuessDto } from './dto/create-guess-dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { Guess } from './entity/guess.entity';
import { create } from 'domain';

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(Guess)
    private guessesRepository: Repository<Guess>,
    private userService: UsersService,
    private locationService: LocationService,
  ) {}

  async createGuess(userId: string, createGuessDto: CreateGuessDto) {
    if (
      this.inRange(createGuessDto.latitude, -90, 90) &&
      this.inRange(createGuessDto.longtitude, -180, 180)
    ) {
      const guess = new Guess();
      const user = await this.userService.getByIdNoRelations(userId);
      guess.latitude = createGuessDto.latitude;
      guess.longtitude = createGuessDto.longtitude;
      guess.meters = createGuessDto.meters;
      guess.user = user;
      guess.userId = userId;
      guess.locationId = createGuessDto.locationId;
      guess.date_time_with_timezone = new Date();
      const location = await this.locationService.getLocationById(
        createGuessDto.locationId,
      );
      console.log(createGuessDto.locationId);
      console.log(location);
      await this.guessesRepository.save(guess);
      await this.locationService.saveLocation(location);
      return guess;
    } else {
      throw new BadRequestException();
    }
  }

  async updateGuess(userId: string, updateGuessDto: UpdateGuessDto) {
    const guess = await this.guessesRepository.findOneBy({
      userId: userId,
    });

    if (guess.meters < updateGuessDto.meters) {
      throw new ForbiddenException();
    }

    if (guess) {
      guess.latitude = updateGuessDto.latitude;
      guess.longtitude = updateGuessDto.longtitude;
      guess.meters = updateGuessDto.meters;
      guess.date_time_with_timezone = new Date();
      return await this.guessesRepository.save(guess);
    } else {
      throw new BadRequestException();
    }
  }

  async getGuessesByUserId(idUser: string) {
    return await this.guessesRepository.find({
      where: { userId: idUser },
      relations: ['location'],
    });
  }

  async getGuessesByLocationId(idLocation: string) {
    return await this.guessesRepository.find({
      where: { locationId: idLocation },
      relations: ['user'],
      order: { meters: 'ASC' },
    });
  }

  inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }
}
