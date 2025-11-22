/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
