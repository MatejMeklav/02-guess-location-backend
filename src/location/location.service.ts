import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateLocationDto } from '../location/dto/create-location-dto';
import { EditLocationDto } from '../location/dto/edit-location-dto';
import { Location } from '../location/entity/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { DeleteLocationDto } from '../location/dto/delete-location-dto';
import { Guess } from '../guess/entity/guess.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Guess)
    private guessesRepository: Repository<Guess>,
    private readonly usersService: UsersService,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createLocation(userId: any, createLocationDto: CreateLocationDto) {
    const location = new Location();
    location.address = createLocationDto.address;
    location.latitude = parseInt(createLocationDto.latitude);
    location.longtitude = parseInt(createLocationDto.longtitude);
    location.image = createLocationDto.image;
    location.userId = userId;
    location.date_time_with_timezone = new Date();
    const user = await this.usersService.getById(userId);
    console.log(user);
    await this.locationRepository.save(location);
    if (user.locations === undefined) {
      user.locations = new Array<Location>();
      user.locations.push(location);
    } else {
      user.locations.push(location);
    }
    return await this.usersRepository.save(user);
  }

  async editLocation(editLocationDto: EditLocationDto) {
    const location = await this.locationRepository.findOneBy({
      id: editLocationDto.id,
    });

    location.image = editLocationDto.image;
    this.locationRepository.save(location);
    return location;
  }
  async deleteLocation(userId: string, deleteLocationDto: DeleteLocationDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['locations'],
    });

    await this.guessesRepository.delete({
      locationId: deleteLocationDto.id,
    });
    const location = await this.locationRepository.findOneBy({
      id: deleteLocationDto.id,
    });
    console.log(user);
    user.locations = user.locations.filter(
      (item) => !user.locations.includes(location),
    );
    console.log(user);
    await this.usersRepository.save(user);
    await this.locationRepository.delete({
      id: deleteLocationDto.id,
    });
    return { status: 'success' };
  }

  async getLocationById(locationId: string) {
    return await this.locationRepository.findOne({
      where: {
        id: locationId,
      },
    });
  }

  async saveLocation(location: Location) {
    console.log(location);
    return await this.locationRepository.save(location);
  }

  async allLocationsOfUser(userId: string) {
    return await this.locationRepository.find({
      where: { userId: userId },
    });
  }
  async allLocations() {
    const locations = await this.locationRepository.find({
      order: {
        date_time_with_timezone: 'DESC',
      },
    });
    console.log(locations);
    return locations;
  }
}
