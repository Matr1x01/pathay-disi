import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import * as userInterface from '../common/interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.getUserToken(loginDto.email, loginDto.password);
  }

  @Patch('refresh')
  @UseGuards(AuthGuard('jwt'))
  refreshToken(@CurrentUser() user: userInterface.UserProfile) {
    return this.usersService.getRefreshToken(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@CurrentUser() user: userInterface.UserProfile) {
    return this.usersService.logout(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@CurrentUser() user: userInterface.UserProfile) {
    return this.usersService.getUserProfile(user);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @CurrentUser() user: userInterface.UserProfile,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserProfile(user, updateUserDto);
  }
}
