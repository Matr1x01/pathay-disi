import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class PlaceOrderDto {
  @IsNotEmpty()
  pickupAddress: string;

  @IsNotEmpty()
  pickupLat: number;

  @IsNotEmpty()
  pickupLng: number;

  @IsNotEmpty()
  dropoffAddress: string;

  @IsNotEmpty()
  dropoffLat: number;

  @IsNotEmpty()
  dropoffLng: number;

  @IsNotEmpty()
  recipientName: string;

  @IsNotEmpty()
  recipientPhone: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsOptional()
  @Min(0)
  discount: number;

  @IsNotEmpty()
  @Min(0)
  packageWeightKg: number;

  @IsNotEmpty()
  packageType: string;

  @IsOptional()
  @Min(0)
  packageValue: number;

  @IsOptional()
  notes: string;

  @IsOptional()
  packageDescription: string;

  @IsOptional()
  paymentMethod: string;

  @IsOptional()
  hasCod: boolean;

  @IsOptional()
  @Min(0)
  codAmount: number;
}
