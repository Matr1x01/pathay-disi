import { Expose } from 'class-transformer';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class OrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  customerId: string;

  @Expose()
  raiderId: string | null;

  @Expose()
  status: OrderStatus;

  @Expose()
  pickupAddress: string;

  @Expose()
  pickupLat: number | null;

  @Expose()
  pickupLng: number | null;

  @Expose()
  dropoffAddress: string;

  @Expose()
  dropoffLat: number | null;

  @Expose()
  dropoffLng: number | null;

  @Expose()
  packageDescription: string | null;

  @Expose()
  packageWeightKg: number | null;

  @Expose()
  packageValue: number | null;

  @Expose()
  distanceKm: number | null;

  @Expose()
  durationMinutes: number | null;

  @Expose()
  actualDistanceKm: number | null;

  @Expose()
  actualDurationMinutes: number | null;

  @Expose()
  price: number;

  @Expose()
  discount: number | null;

  @Expose()
  finalPrice: number | null;

  @Expose()
  paymentStatus: PaymentStatus;

  @Expose()
  cancellationReason: string | null;

  @Expose()
  cancelledBy: string | null;

  @Expose()
  notes: string | null;

  @Expose()
  acceptedAt: Date | null;

  @Expose()
  pickedUpAt: Date | null;

  @Expose()
  completedAt: Date | null;

  @Expose()
  cancelledAt: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
