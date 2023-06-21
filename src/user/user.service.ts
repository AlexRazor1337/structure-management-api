import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findUsers(user: any): Promise<User[]> {
    switch (user.role) {
      case Role.USER:
        return this.userRepository.find({
          where: { email: user.email },
        });
      case Role.ADMIN:
        return this.userRepository.find();
      case Role.BOSS:
        const boss = await this.userRepository.findOne({
          where: { email: user.email },
        });

        return this.findBossAndSubordinates(boss);
      default:
        return [];
    }
  }

  async findBossAndSubordinates(user: User): Promise<User[]> {
    const subordinates: User[] = await this.userRepository.find({
      where: { boss: user },
    });

    const subordinatePromises = subordinates.map((subordinate) =>
      this.findBossAndSubordinates(subordinate),
    );

    const subordinateResults: User[][] = await Promise.all(subordinatePromises);

    const flattenedSubordinates: User[] = subordinateResults.reduce(
      (prev, current) => prev.concat(current),
      [],
    );

    return [user, ...flattenedSubordinates];
  }

  async updateUser(id: number, requestUser: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (requestUser.role === Role.USER || requestUser.id === id) {
      throw new HttpException('Forbidden', 403);
    }

    if (user.boss && user.boss.id !== requestUser.id) {
      throw new HttpException('Forbidden', 403);
    }

    return user;
  }
}
