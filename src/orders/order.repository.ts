import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import generateUniqueString from '../common/utils/generateUniqueString';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        customerId: userId,
      },
      select: {
        id: true,
        orderKey: true,
        status: true,
        createdAt: true,
        pickupAddress: true,
        dropoffAddress: true,
        finalPrice: true,
      },
    });
  }

  async placeOrder(data: {
    customerId: string;
    status: OrderStatus;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    packageDescription: string;
    packageWeightKg: number;
    packageValue: number;
    price: number;
    discount: number;
    finalPrice: number;
    paymentStatus: PaymentStatus;
    notes?: string;
    paymentMethod: string;
  }) {
    return this.prisma.order.create({
      data: { ...data, orderKey: generateUniqueString() },
      include: {
        customer: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
