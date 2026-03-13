import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as userInterface from '../common/interfaces/user.interface';
import { PlaceOrderDto } from './dto/place-order.dto';
import { EstimateCostDto } from './dto/estimate-cost-dto';
import { serialize } from '../common/utils/serialize.util';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  placeOrder(
    @CurrentUser() customer: userInterface.IUser,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    return serialize(
      OrderResponseDto,
      this.ordersService.placeOrder(customer, placeOrderDto),
    );
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  getOrders(@CurrentUser() customer: userInterface.IUser) {
    return this.ordersService.getOrders(customer);
  }

  @Post('estimate-cost')
  estimateCost(@Body() estimateCost: EstimateCostDto) {
    return this.ordersService.estimateCost(estimateCost);
  }
}
