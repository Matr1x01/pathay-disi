import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as userInterface from '../common/interfaces/user.interface';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.adminService.login(email, password);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  async getProfile(@CurrentUser() admin: userInterface.IUser) {
    return this.adminService.getProfile(admin.id);
  }

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  getDashboard(@CurrentUser() admin: userInterface.IUser) {
    // This is a placeholder for actual dashboard data
    return {
      message: `Welcome to the admin dashboard, ${admin.name}!`,
      stats: {
        users: 1000,
        orders: 500,
        revenue: 100000,
      },
    };
  }
}
