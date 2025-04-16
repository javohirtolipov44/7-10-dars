import { UserRole } from 'src/common/types/user-role.enum';
import { Course } from 'src/courses/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  fullname: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, enum: UserRole })
  role: string;

  @ManyToMany(() => Course)
  @JoinTable()
  enrolledCourses: Course[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
