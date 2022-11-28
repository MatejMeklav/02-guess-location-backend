import { CreateGuessDto } from 'src/guess/dto/create-guess-dto';

export const createGuess: CreateGuessDto = {
  latitude: 90,
  longtitude: 180,
  meters: 300,
  locationId: '2fe697e6-fbf5-4098-a419-032f2d9233c5',
};
export const createGuessInvalid: CreateGuessDto = {
  latitude: null,
  longtitude: null,
  meters: 300,
  locationId: '2fe697e6-fbf5-4098-a419-032f2d9233c5',
};
