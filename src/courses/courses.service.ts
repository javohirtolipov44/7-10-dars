import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { log } from 'console';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createCourseDto: CreateCourseDto, teacherId: number) {
    const data = {
      ...createCourseDto,
      teacherId,
    };
    log(data);
    const course = this.courseRepo.create(data);
    return await this.courseRepo.save(course);
  }

  async findAll() {
    const course = await this.courseRepo.find();
    const res = course.map(async (data) => {
      const user = await this.userRepo.findOne({
        where: { id: data.teacherId },
      });
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
        teacherName: user?.fullname,
      };
    });
    return await Promise.all(res);
  }

  async enroll(courseId: number, studentId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: {
        users: true,
      },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
    const user = course.users.find((user) => user.id === studentId);
    if (user) {
      throw new BadRequestException("Siz bu kursga avval ro'yxatdan o'tgansiz");
    }
    course.users.push({ id: studentId } as any);
    log(course);
    return await this.courseRepo.save(course);
  }
}
