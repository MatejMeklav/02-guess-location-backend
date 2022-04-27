import { Guess } from 'src/guess/entity/guess.entity';
import { User } from 'src/users/entity/user.entity';
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
  @Column({
    type: 'bytea',
    nullable: true,
  })
  image: Uint8Array;
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
