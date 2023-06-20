import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.input';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() registerDto: RegisterDto): RegisterDto {
    return registerDto;
  }
}
