import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: string;

  @Column()
  price: number;

  @Column()
  teacherId: number;

  @ManyToMany(() => User, (user) => user.enrolledCourses, { cascade: true })
  @JoinTable()
  users: User[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
