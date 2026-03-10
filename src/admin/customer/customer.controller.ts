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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permission } from '../../common/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Permission(['Create Customers'])
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Permission(['View Customers'])
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
    @Query('status') status?: string,
  ) {
    return this.customerService.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
    );
  }

  @Permission(['View Customers'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Permission(['Edit Customers'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Permission(['Create Customers'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
