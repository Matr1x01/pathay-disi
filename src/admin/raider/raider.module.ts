import { Module } from '@nestjs/common';
import { RaiderService } from './raider.service';
import { RaiderController } from './raider.controller';
import { RaiderRepository } from './raider.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RaiderController],
  providers: [RaiderService, RaiderRepository],
})
export class AdminRaiderModule {}
