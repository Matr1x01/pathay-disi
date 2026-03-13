import { Expose, Transform } from 'class-transformer';

interface IOrder {
    orderKey: string;
    status: string;
    createdAt: string;
    pickupAddress: string;
    dropoffAddress: string;
    finalPrice: number;
}

export class OrderResponseDto {
    @Expose()
    @Transform(({ obj }: { obj: IOrder }) => obj.orderKey)
    id: string;

    @Expose()
    @Transform(({ obj }: { obj: IOrder }) => obj.status)
    status: string;

    @Expose()
    @Transform(({ obj }: { obj: IOrder }) => obj.createdAt)
    date: string;

    @Expose()
    @Transform(({ obj }: { obj: IOrder }) => obj.pickupAddress)
    pickup: string;

    @Expose()
    @Transform(({ obj }: { obj: IOrder }) => obj.dropoffAddress)
    dropoff: string;

    @Expose()
    @Transform(({ obj }: { obj: IOrder }) => obj.finalPrice.toFixed(2))
    amount: string;
}
