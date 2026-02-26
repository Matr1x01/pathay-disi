import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminService],
  exports: [AdminService], // Export AdminService for use in other modules (e.g., AuthModule)
})
export class AdminModule {}
