import { Module } from '@nestjs/common';
import { RaiderService } from './raider.service';

@Module({
  providers: [RaiderService],
  exports: [RaiderService], // Export RaiderService for use in other modules (e.g., AuthModule)
})
export class RaiderModule {}
