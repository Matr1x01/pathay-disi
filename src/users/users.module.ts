import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-change-me-2026',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, UsersRepository],
  exports: [UsersService, JwtStrategy, UsersRepository],
})
export class UsersModule {}
