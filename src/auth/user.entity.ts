import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true }) //unique is an option which define there should not be any duplicate
  username: string;
  @Column()
  password: string;
  // eager allow to connect for example: when you fetch user it will fetch task of that user too. that what eager:
  // ture do;
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
