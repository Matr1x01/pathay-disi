import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '../common/interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    try {
      const user = await this.usersRepository.createUser({
        name: createUserDto.username,
        email: createUserDto.email,
        phone: createUserDto.phone_number,
        password: createUserDto.password,
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
    const user = await this.usersRepository.findByEmail(email);

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
    const userData = await this.usersRepository.findById(user.id);

    if (!userData) {
      throw new BadRequestException('User not found');
    }

    try {
      const updatedUser = await this.usersRepository.updateUser(
        user.id,
        updateUserDto,
        userData,
      );

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

  private generateUserToken(user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  }) {
    const payload = { id: user.id, name: user.name, email: user.email };
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600'); // default to 1 hour if not set

    return this.jwtService.sign(payload, { expiresIn: expiresIn });
  }

  async validateUser(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return null;
    }
    const { id, name, email } = user;
    return { id, name, email };
  }

  getRefreshToken(user: UserProfile) {
    return { token: this.generateUserToken(user) };
  }

  logout(user: UserProfile) {
    return {
      message:
        'Logged out successfully' + (user ? ` for user ${user.email}` : ''),
    };
  }
}
