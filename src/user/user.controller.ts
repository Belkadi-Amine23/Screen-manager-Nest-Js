import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { IsRoleGuard, Role } from './auth.guard';
import { Public } from './public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ApiTags('Authentication')
  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    return this.userService.login({ email, password });
  }

  @UseGuards(IsRoleGuard(Role.ADMIN))
  @Get('')
  async getUsers() {
    return this.userService.getUsers();
  }
}
