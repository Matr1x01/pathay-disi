import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { paginate } from '../../common/utils/prisma-pagination';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        customerId: createOrderDto.customerId,
        raiderId: createOrderDto.raiderId,
        pickupAddress: createOrderDto.pickupAddress,
        pickupLat: createOrderDto.pickupLat,
        pickupLng: createOrderDto.pickupLng,
        dropoffAddress: createOrderDto.dropoffAddress,
        dropoffLat: createOrderDto.dropoffLat,
        dropoffLng: createOrderDto.dropoffLng,
        packageDescription: createOrderDto.packageDescription,
        packageWeightKg: createOrderDto.packageWeightKg,
        packageValue: createOrderDto.packageValue,
        distanceKm: createOrderDto.distanceKm,
        durationMinutes: createOrderDto.durationMinutes,
        price: createOrderDto.price,
        discount: createOrderDto.discount,
        status: createOrderDto.status,
        paymentStatus: createOrderDto.paymentStatus,
        notes: createOrderDto.notes,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        raider: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    status?: string,
  ) {
    const where = {
      ...(search && {
        OR: [
          { pickupAddress: { contains: search, mode: 'insensitive' as const } },
          {
            dropoffAddress: { contains: search, mode: 'insensitive' as const },
          },
          {
            customer: {
              name: { contains: search, mode: 'insensitive' as const },
            },
          },
        ],
      }),
      ...(status && { status: status as OrderStatus }),
    };

    const include = {
      customer: { select: { id: true, name: true, email: true } },
      raider: { select: { id: true, name: true } },
    };

    return paginate(
      this.prisma.order,
      { page, perPage },
      {
        where,
        include,
        orderBy: sortBy
          ? { [sortBy]: direction }
          : { createdAt: 'desc' as const },
      },
    );
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        raider: { select: { id: true, name: true, phone: true } },
        payment: true,
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
        acceptedAt: updateOrderDto.acceptedAt
          ? new Date(updateOrderDto.acceptedAt)
          : undefined,
        pickedUpAt: updateOrderDto.pickedUpAt
          ? new Date(updateOrderDto.pickedUpAt)
          : undefined,
        completedAt: updateOrderDto.completedAt
          ? new Date(updateOrderDto.completedAt)
          : undefined,
        cancelledAt: updateOrderDto.cancelledAt
          ? new Date(updateOrderDto.cancelledAt)
          : undefined,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        raider: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
