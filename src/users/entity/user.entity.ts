import { Guess } from 'src/guess/entity/guess.entity';
import { Location } from 'src/location/entity/location.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  password: string;
  @Column()
  isEmailConfirmed: boolean;
  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @OneToMany(() => Guess, (guess) => guess.user)
  guesses: Guess[];
}
