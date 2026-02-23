import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { getDiff } from '../common/utils/object-diff.util';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(createUser: {
    name: string;
    email: string;
    phone?: string | null;
    password: string;
  }) {
    return this.prisma.user.create({
      data: createUser,
      select: { id: true, name: true, email: true, phone: true },
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserData: User,
  ) {
    const dataToUpdate = getDiff(currentUserData, {
      name: updateUserDto.username,
      email: updateUserDto.email,
      phone: updateUserDto.phone_number,
    });

    if (Object.keys(dataToUpdate).length === 0) {
      const { id, name, email, phone } = currentUserData;
      return { id, name, email, phone };
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true },
    });
  }
}
