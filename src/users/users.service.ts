import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (findUser) {
      throw new BadRequestException("Bu Email avval ro'yxatdan o'tgan");
    }
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const user = await this.userRepo.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new BadRequestException('Foydalanuvchi topilmadi!');
    }

    // const isPasswordValid = bcrypt.compareSync(loginUserDto.password, user.password);

    // if (!isPasswordValid) {
    //   throw new BadRequestException('Parol xato!');
    // }
    const payload = { role: user.role, user_id: user.id };
    const token = this.jwt.sign(payload);

    res.cookie('token', token, {
      httpOnly: true,
    });
    return {
      accessToken: token,
      user,
    };
  }

  async getProfile(userId: number) {
    return await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        enrolledCourses: true,
      },
    });
  }
}
