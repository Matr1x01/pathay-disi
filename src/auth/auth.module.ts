import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomerModule } from '../customer/customer.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-change-me-2026',
      signOptions: { expiresIn: '1h' }, // Example: token expires in 1 hour
    }),
    forwardRef(() => CustomerModule),
    forwardRef(() => AdminModule),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
