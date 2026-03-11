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
import { RaiderService } from './raider.service';
import { CreateRaiderDto } from './dto/create-raider.dto';
import { UpdateRaiderDto } from './dto/update-raider.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permission } from '../../common/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('')
export class RaiderController {
  constructor(private readonly raiderService: RaiderService) {}

  @Permission(['Create Raiders'])
  @Post()
  create(@Body() createRaiderDto: CreateRaiderDto) {
    return this.raiderService.create(createRaiderDto);
  }

  @Permission(['View Raiders'])
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
    @Query('isOnline') isOnline?: string,
  ) {
    return this.raiderService.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      isOnline,
    );
  }

  @Permission(['View Raiders'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.raiderService.findOne(id);
  }

  @Permission(['Edit Raiders'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRaiderDto: UpdateRaiderDto) {
    return this.raiderService.update(id, updateRaiderDto);
  }

  @Permission(['Delete Raiders'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raiderService.remove(id);
  }
}
