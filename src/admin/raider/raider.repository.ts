import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRaiderDto } from './dto/create-raider.dto';
import { UpdateRaiderDto } from './dto/update-raider.dto';
import { paginate } from '../../common/utils/prisma-pagination';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RaiderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRaiderDto: CreateRaiderDto) {
    const hashedPassword = await bcrypt.hash(createRaiderDto.password, 10);
    return this.prisma.raider.create({
      data: {
        name: createRaiderDto.name,
        email: createRaiderDto.email,
        phone: createRaiderDto.phone,
        password: hashedPassword,
        vehicleType: createRaiderDto.vehicleType,
        vehicleNumber: createRaiderDto.vehicleNumber,
        licenseNumber: createRaiderDto.licenseNumber,
        currentLat: createRaiderDto.currentLat,
        currentLng: createRaiderDto.currentLng,
        isOnline: createRaiderDto.isOnline,
        isAvailable: createRaiderDto.isAvailable,
        rating: createRaiderDto.rating,
        avatarUrl: createRaiderDto.avatarUrl,
      },
    });
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    isOnline?: string,
  ) {
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
          { vehicleNumber: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(isOnline !== undefined && { isOnline: isOnline === 'true' }),
    };

    return paginate(
      this.prisma.raider,
      { page, perPage },
      {
        where,
        orderBy: sortBy
          ? { [sortBy]: direction }
          : { createdAt: 'desc' as const },
      },
    );
  }

  async findOne(id: string) {
    return this.prisma.raider.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.raider.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return this.prisma.raider.findUnique({ where: { phone } });
  }

  async update(id: string, updateRaiderDto: UpdateRaiderDto) {
    const data: Record<string, unknown> = { ...updateRaiderDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }
    return this.prisma.raider.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.raider.delete({ where: { id } });
  }
}
