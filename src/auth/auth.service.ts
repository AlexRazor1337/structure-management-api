import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.input';

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto) {
    return registerDto;
  }
}
