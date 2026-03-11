import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as userInterface from '../common/interfaces/user.interface';
import { ChangePasswordDto } from './users/dto/change-password.dto';

@Controller('')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('auth/login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.adminService.login(email, password);
  }

  @Post('auth/logout')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  logout(@CurrentUser() admin: userInterface.IUser) {
    return this.adminService.logout(admin);
  }

  @Get('auth/me')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  me(@CurrentUser() admin: userInterface.IUser) {
    return this.adminService.me(admin);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  async getProfile(@CurrentUser() admin: userInterface.IUser) {
    return this.adminService.getProfile(admin.id);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  changePassword(
    @CurrentUser() admin: userInterface.IUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.adminService.changePassword(admin.id, changePasswordDto);
  }
}
