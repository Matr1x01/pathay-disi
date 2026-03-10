import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permission } from '../../common/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Permission(['Create Orders'])
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Permission(['View Orders'])
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
    @Query('status') status?: string,
  ) {
    return this.orderService.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
    );
  }

  @Permission(['View Orders'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Permission(['Edit Orders'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Permission(['Delete Orders'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
