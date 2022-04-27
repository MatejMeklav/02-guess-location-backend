import { Location } from 'src/location/entity/location.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  latitude: number;
  @Column()
  longtitude: number;
  @Column()
  meters: number;
  @ManyToOne(() => Location, (location) => location.guesses)
  location: Location;

  @ManyToOne(() => User, (user) => user.guesses)
  user: User;

  @Column({ type: 'string', nullable: true })
  userId?: string | null;

  @Column({ type: 'string', nullable: true })
  locationId?: string | null;
}
