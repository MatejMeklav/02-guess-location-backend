import { Guess } from '../../guess/entity/guess.entity';
import { User } from '../../users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  image: string;
  @Column()
  latitude: number;
  @Column()
  longtitude: number;
  @Column()
  address: string;
  @ManyToOne(() => User, (user) => user.locations)
  user: User;

  @OneToMany(() => Guess, (guess) => guess.location)
  guesses: Guess[];

  @Column({ type: 'string', nullable: true })
  userId?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  date_time_with_timezone: Date;
}
