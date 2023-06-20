import { Controller, Get, Param, Patch } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Patch(':id')
    update(@Param('id') id: string): string {
      return 'This action updates a user';
    }
}
