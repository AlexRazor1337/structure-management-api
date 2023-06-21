import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto.input';
import { LoginDto } from './dto/login.dto.input';
import { RefreshTokenDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): any {
    return this.authService.login(loginDto);
  }
  
  @Post('refresh')
  refresh(@Body() { refreshToken }: RefreshTokenDto): any {
    return this.authService.refresh(refreshToken);
  }
}
