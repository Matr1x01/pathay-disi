import { Expose } from 'class-transformer';
import { VehicleType } from '@prisma/client';

export class RaiderResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  vehicleType: VehicleType;

  @Expose()
  vehicleNumber: string | null;

  @Expose()
  licenseNumber: string | null;

  @Expose()
  currentLat: number | null;

  @Expose()
  currentLng: number | null;

  @Expose()
  isOnline: boolean;

  @Expose()
  isAvailable: boolean;

  @Expose()
  rating: number;

  @Expose()
  totalDeliveries: number;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
