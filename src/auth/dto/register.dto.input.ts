import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

enum Role {
  ADMIN,
  BOSS,
  USER,
}

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
