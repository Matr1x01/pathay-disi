import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import * as userInterface from '../common/interfaces/user.interface';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  register(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() { email, otp }: { email: string; otp: string }) {
    return this.customerService.verifyEmail(email, otp);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.customerService.getCustomerToken(
      loginDto.email,
      loginDto.password,
    );
  }

  @Patch('refresh')
  @UseGuards(AuthGuard('jwt'))
  refreshToken(@CurrentUser() customer: userInterface.IUser) {
    return this.customerService.getRefreshToken(customer);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@CurrentUser() customer: userInterface.IUser) {
    return this.customerService.logout(customer);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@CurrentUser() customer: userInterface.IUser) {
    return this.customerService.getCustomerProfile(customer);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @CurrentUser() customer: userInterface.IUser,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomerProfile(
      customer,
      updateCustomerDto,
    );
  }
}
