import { Location } from 'src/location/entity/location.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'decimal' })
  latitude: number;
  @Column({ type: 'decimal' })
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

  @Column({ type: 'timestamptz', nullable: true })
  date_time_with_timezone: Date;
}
