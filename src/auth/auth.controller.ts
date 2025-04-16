import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TimeoutInterceptor } from 'src/common/interceptors/timeout.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @UseInterceptors(LoggingInterceptor)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.login(loginUserDto, res);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @UseInterceptors(TimeoutInterceptor)
  async getProfile(@Req() req: Request) {
    const userId = req['user']?.user_id;
    return this.userService.getProfile(userId);
  }
}
