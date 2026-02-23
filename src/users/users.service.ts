import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '../common/interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { getDiff } from '../common/utils/object-diff.util';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.username,
          email: createUserDto.email,
          phone: createUserDto.phone_number,
          password: createUserDto.password,
        },
        select: { id: true, name: true, email: true, phone: true },
      });

      return { token: this.generateUserToken(user) };
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

  async getUserToken(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new BadRequestException('Invalid email or password');
    }

    return { token: this.generateUserToken(user) };
  }

  getUserProfile(user: UserProfile) {
    return {
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async updateUserProfile(user: UserProfile, updateUserDto: UpdateUserDto) {
    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      throw new BadRequestException('User not found');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: getDiff(userData, {
          name: updateUserDto.username,
          email: updateUserDto.email,
          phone: updateUserDto.phone_number,
        }),
        select: { id: true, name: true, email: true, phone: true },
      });

      return {
        message: 'Profile updated successfully',
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
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

  private generateUserToken(user: { id: string; name: string; email: string }) {
    const payload = { id: user.id, name: user.name, email: user.email };
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600'); // default to 1 hour if not set

    return this.jwtService.sign(payload, { expiresIn: expiresIn });
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    return user || null;
  }
}
