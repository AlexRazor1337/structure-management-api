import {
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AccessTokenGuard } from 'src/guard/access-token.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Request() { user }) {
    return this.userService.findUsers(user);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Request() { user }): Promise<User> {
    return this.userService.updateUser(id, user);
  }
}
