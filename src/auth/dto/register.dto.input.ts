import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { Role } from '../../entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsEnum(Role)
  role: Role;

  @IsInt()
  @IsPositive()
  @IsOptional()
  bossId: number | null;
}
