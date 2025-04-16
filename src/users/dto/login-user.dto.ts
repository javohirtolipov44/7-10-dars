import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: `Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi bo'lishi kerak.`,
    },
  )
  password: string;
}
