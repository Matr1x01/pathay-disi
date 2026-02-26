import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../common/interfaces/user.interface'; // Changed from UserProfile
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './customer.repository';
import { AppCacheService } from '../app-cache/app-cache.service';

@Injectable()
export class CustomerService {
  constructor(
    private jwtService: JwtService,
    private customersRepository: CustomerRepository,
    private appCache: AppCacheService,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.customersRepository.findByEmail(
      createCustomerDto.email,
    );

    if (existingCustomer) {
      if (existingCustomer.status === 'PENDING') {
        await this.appCache.set(
          `email-otp:${existingCustomer.email}`,
          '123456',
          30000,
        ); // Store OTP for 5 minutes

        return {
          message:
            'Customer already registered but email not verified. Please verify your email.',
          data: { email: existingCustomer.email },
        };
      }

      throw new BadRequestException('Email is already in use');
    }

    try {
      const customer = await this.customersRepository.createCustomer({
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone_number,
        password: createCustomerDto.password,
      });

      await this.appCache.set(`email-otp:${customer.email}`, '123456', 30000); // Store OTP for 5 minutes

      return {
        message: 'Customer registered successfully. Please verify your email.',
        data: { email: customer.email },
      };
    } catch (error) {
      const prismaError = error as {
        code?: string;
        meta?: { target?: string[] };
      };
      if (prismaError.code === 'P2002') {
        const field = prismaError.meta?.target?.[0];
        throw new BadRequestException(`${field} is already in use`);
      }
      throw error;
    }
  }

  async verifyEmail(email: string, otp: string) {
    const customer = await this.customersRepository.findByEmail(email);

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    try {
      const cachedOtp = await this.appCache.get(`email-otp:${email}`);

      if (cachedOtp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      await this.customersRepository.markEmailAsVerified(customer.id);
      await this.appCache.del(`email-otp:${email}`);

      return {
        message: 'Email verified successfully',
        data: { token: this.generateCustomerToken(customer) },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.log(error);
      throw new BadRequestException('Email verification failed');
    }
  }

  async getCustomerToken(email: string, password: string) {
    const customer = await this.customersRepository.findActiveByEmail(email);

    if (!customer || customer.password !== password) {
      throw new BadRequestException('Invalid email or password');
    }

    return { token: this.generateCustomerToken(customer) };
  }

  getCustomerProfile(customer: IUser) {
    return {
      message: 'Profile retrieved successfully',
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    };
  }

  async updateCustomerProfile(
    customer: IUser,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const customerData = await this.customersRepository.findById(customer.id);

    if (!customerData) {
      throw new BadRequestException('Customer not found');
    }

    try {
      const updatedCustomer = await this.customersRepository.updateCustomer(
        customer.id,
        updateCustomerDto,
        customerData,
      );

      return {
        message: 'Profile updated successfully',
        data: {
          id: updatedCustomer.id,
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
        },
      };
    } catch (error) {
      const prismaError = error as {
        code?: string;
        meta?: { target?: string[] };
      };
      if (prismaError.code === 'P2002') {
        const field = prismaError.meta?.target?.[0];
        throw new BadRequestException(`${field} is already in use`);
      }
      throw error;
    }
  }

  private generateCustomerToken(customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  }) {
    const payload = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      type: 'customer',
    };
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600'); // default to 1 hour if not set

    return this.jwtService.sign(payload, { expiresIn: expiresIn });
  }

  async validateUser(customerId: string): Promise<IUser | null> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      return null;
    }
    const { id, name, email } = customer;
    return { id, name, email, type: 'customer' };
  }

  getRefreshToken(customer: IUser) {
    return { token: this.generateCustomerToken(customer) };
  }

  logout(customer: IUser) {
    return {
      message:
        'Logged out successfully' +
        (customer ? ` for customer ${customer.email}` : ''),
    };
  }
}
