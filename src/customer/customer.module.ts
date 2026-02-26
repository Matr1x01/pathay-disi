import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-change-me-2026',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, JwtStrategy, CustomerRepository],
  exports: [CustomerService, JwtStrategy, CustomerRepository],
})
export class CustomerModule {}
