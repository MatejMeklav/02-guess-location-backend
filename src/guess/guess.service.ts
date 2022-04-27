import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocationDto } from 'src/location/dto/create-location-dto';
import { LocationService } from 'src/location/location.service';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateGuessDto } from './dto/create-guess-dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { Guess } from './entity/guess.entity';

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(Guess)
    private guessesRepository: Repository<Guess>,
    private userService: UsersService,
    private locationService: LocationService,
  ) {}

  async createGuess(userId: string, createGuessDto: CreateGuessDto) {
    const guess = new Guess();
    const user = await this.userService.getById(userId);
    guess.latitude = createGuessDto.latitude;
    guess.longtitude = createGuessDto.longtitude;
    guess.meters = createGuessDto.meters;
    guess.user = user;
    guess.userId = userId;
    guess.locationId = createGuessDto.locationId;
    const location = await this.locationService.getLocationById(
      createGuessDto.locationId,
    );
    if (location.guesses === undefined) {
      location.guesses = new Array<Guess>();
      location.guesses.push(guess);
    } else {
      location.guesses.push(guess);
    }
    await this.guessesRepository.save(guess);
    return await this.locationService.saveLocation(location);
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
}
