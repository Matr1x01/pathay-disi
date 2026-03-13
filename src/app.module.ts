import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { AppCacheModule } from './app-cache/app-cache.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    AuthModule,
    CustomerModule,
    AdminModule,
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis('redis://localhost:6379'),
          ],
        };
      },
    }),
    AppCacheModule,
    LocationModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
