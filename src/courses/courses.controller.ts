import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Req,
  Param,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/types/user-role.enum';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('/')
  @UseInterceptors(LoggingInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: Request,
  ) {
    const teacherId = (req as any).user.user_id;
    return this.coursesService.create(createCourseDto, teacherId);
  }

  @Get('/')
  @UseInterceptors(TransformInterceptor)
  async findAll() {
    return this.coursesService.findAll();
  }

  @Post('/:id/:enroll')
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async enroll(@Param('id') courseId: number, @Req() req: Request) {
    const studentId = (req as any).user.user_id;
    return this.coursesService.enroll(courseId, studentId);
  }
}
