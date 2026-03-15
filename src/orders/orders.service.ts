import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { IUser } from '../common/interfaces/user.interface';
import { PlaceOrderDto } from './dto/place-order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { EstimateCostDto } from './dto/estimate-cost-dto';
import calculateDistance from '../common/utils/calculateDistance';
import getPackageDict from '../common/utils/getPackageDict';
import { serializeArray } from '../common/utils/serialize.util';
import { OrderResponseDto } from './dto/order-response.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrderRepository) { }

  private platformCost = 10;

  async placeOrder(customer: IUser, placeOrderDto: PlaceOrderDto) {
    const finalPrice = placeOrderDto.price - placeOrderDto.discount;
    if (finalPrice < 0 || finalPrice === undefined) {
      throw new Error('Invalid final price');
    }

    return await this.ordersRepository.placeOrder({
      customerId: customer.id,
      status: OrderStatus.PENDING,
      pickupAddress: placeOrderDto.pickupAddress,
      pickupLat: placeOrderDto.pickupLat,
      pickupLng: placeOrderDto.pickupLng,
      dropoffAddress: placeOrderDto.dropoffAddress,
      dropoffLat: placeOrderDto.dropoffLat,
      dropoffLng: placeOrderDto.dropoffLng,
      recipientName: placeOrderDto.recipientName,
      recipientPhone: placeOrderDto.recipientPhone,
      packageDescription: placeOrderDto.packageDescription,
      packageWeightKg: placeOrderDto.packageWeightKg,
      packageValue: placeOrderDto.packageValue,
      price: placeOrderDto.price,
      discount: placeOrderDto.discount ?? 0,
      finalPrice:
        this.platformCost +
        this.getOrderCost(
          placeOrderDto.pickupLat,
          placeOrderDto.pickupLng,
          placeOrderDto.dropoffLat,
          placeOrderDto.dropoffLng,
          placeOrderDto.packageType,
          placeOrderDto.packageWeightKg,
        ),
      paymentStatus: PaymentStatus.PENDING,
      notes: placeOrderDto.notes,
      paymentMethod: placeOrderDto.paymentMethod,
    });
  }

  private getOrderCost(
    pickUpLat: number,
    pickUpLng: number,
    dropOffLat: number,
    dropOffLng: number,
    packageType: string,
    weight: number,
  ) {
    const costPerKilo = 1.2;
    return (
      getPackageDict()[packageType].cost +
      weight *
      costPerKilo *
      10 *
      calculateDistance(pickUpLat, pickUpLng, dropOffLat, dropOffLng)
    );
  }

  estimateCost(estimateCost: EstimateCostDto) {
    const price = this.getOrderCost(
      estimateCost.pickupLat,
      estimateCost.pickupLon,
      estimateCost.dropOffLat,
      estimateCost.dropOffLon,
      estimateCost.packageType,
      estimateCost.weight,
    );
    return {
      deliveryFee: price.toFixed(2),
      total: (price + this.platformCost).toFixed(2),
      platformFee: this.platformCost.toFixed(2),
    };
  }

  async getOrders(customer: IUser) {
    const orders = await this.ordersRepository.getUserOrders(customer.id);
    return serializeArray(OrderResponseDto, orders);
  }

  async getOrdersByKey(orderKey: string) {
    const order = await this.ordersRepository.getOrderByOrderKey(orderKey);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const timeline = [
      {
        status: OrderStatus.PENDING,
        label: 'Order Placed',
        timestamp: order.createdAt,
        completed: true,
        active: false,
      },
    ];

    const minPerHr = 4;
    const distance = calculateDistance(
      order.pickupLat ?? 0,
      order.pickupLng ?? 0,
      order.dropoffLat ?? 0,
      order.dropoffLng ?? 0,
    );
    const estimatedDelivery = distance * minPerHr;

    return {
      orderKey: order.orderKey,
      status: order.status,
      statusLabel: order.status,
      merchantName: order.customer.name,
      customerName: order.recipientName,
      customerPhone: order.recipientPhone,
      riderName: order.raider?.name,
      riderPhone: order.raider?.phone,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.dropoffAddress,
      pickupCoords: [order.pickupLat, order.pickupLng],
      deliveryCoords: [order.dropoffLat, order.dropoffLng],
      // riderCoords: [order.raider?.currentLat, order.raider?.currentLng],
      riderCoords: null,
      weight: order.packageWeightKg,
      codAmount: order.finalPrice,
      createdAt: order.createdAt,
      estimatedDelivery: estimatedDelivery,
      timeline: timeline,
    };
  }
}
