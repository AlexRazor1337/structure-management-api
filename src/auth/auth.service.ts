import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.input';
import { LoginDto } from './dto/login.dto.input';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userReposiory: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userReposiory.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const boss = await this.userReposiory.findOne({
      where: { id: registerDto.bossId },
    });

    if (!boss) {
      throw new HttpException('Boss not found', 404);
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const user = await this.userReposiory.save({
      ...registerDto,
      password: hashedPassword,
      boss: boss,
    });

    return this.userReposiory.findOne({
      where: { id: user.id },
      select: ['id', 'email', 'role'],
    });
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async login(loginDto: LoginDto): Promise<JWTTokens> {
    const user = await this.userReposiory.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'role'],
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.getTokens(user);
  }

  private async getTokens(user: User): Promise<JWTTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
          expiresIn: this.configService.get<string>(
            'JWT_EXPIRATION_TIME_REFRESH',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<JWTTokens> {
    try {
      const { email } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      });

      const user = await this.userReposiory.findOne({ where: { email } });

      if (!user) {
        throw new HttpException('Invalid credentials', 400);
      }

      return this.getTokens(user);
    } catch (error) {
      throw new HttpException('Invalid credentials', 400);
    }
  }
}
