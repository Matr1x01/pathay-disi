import { IsNotEmpty } from 'class-validator';

export class EstimateCostDto {
  @IsNotEmpty()
  pickupLat: number;

  @IsNotEmpty()
  pickupLon: number;

  @IsNotEmpty()
  dropOffLat: number;

  @IsNotEmpty()
  dropOffLon: number;

  @IsNotEmpty()
  weight: number;

  @IsNotEmpty()
  packageType: string;
}
