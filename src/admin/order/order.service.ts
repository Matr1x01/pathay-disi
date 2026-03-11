import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { OrderResponseDto } from './dto/order-response.dto';
import {
  serialize,
  serializePaginated,
} from '../../common/utils/serialize.util';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(createOrderDto: CreateOrderDto) {
    return serialize(
      OrderResponseDto,
      await this.orderRepository.create(createOrderDto),
    );
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    status?: string,
  ) {
    const orders = await this.orderRepository.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
    );

    return serializePaginated(OrderResponseDto, orders);
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return serialize(OrderResponseDto, order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id); // ensure order exists
    return serialize(
      OrderResponseDto,
      await this.orderRepository.update(id, updateOrderDto),
    );
  }

  async remove(id: string) {
    await this.findOne(id); // ensure order exists
    return this.orderRepository.remove(id);
  }
}
