import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(protected prisma: PrismaService) {}

  async getActiveByEmail(email: string) {
    return this.prisma.admin.findFirst({
      where: { email, isActive: true },
    });
  }

  async findById(id: string) {
    return this.prisma.admin.findFirst({
      where: { id },
    });
  }
}
