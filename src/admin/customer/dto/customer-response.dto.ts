import { Expose } from 'class-transformer';
import { CustomerStatus } from '@prisma/client';

export class CustomerResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string | null;

  @Expose()
  status: CustomerStatus;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
