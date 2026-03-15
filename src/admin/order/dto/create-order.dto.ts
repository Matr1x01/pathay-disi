import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  raiderId?: string;

  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @IsNotEmpty()
  @IsString()
  recipientPhone: string;

  @IsNotEmpty()
  @IsString()
  pickupAddress: string;

  @IsOptional()
  @IsNumber()
  pickupLat?: number;

  @IsOptional()
  @IsNumber()
  pickupLng?: number;

  @IsNotEmpty()
  @IsString()
  dropoffAddress: string;

  @IsOptional()
  @IsNumber()
  dropoffLat?: number;

  @IsOptional()
  @IsNumber()
  dropoffLng?: number;

  @IsOptional()
  @IsString()
  packageDescription?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationMinutes?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
