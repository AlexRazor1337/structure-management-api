import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.input';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userReposiory: Repository<User>,
  ) {}
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userReposiory.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const user = await this.userReposiory.save({
      ...registerDto,
      password: hashedPassword,
    });

    return user;
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
