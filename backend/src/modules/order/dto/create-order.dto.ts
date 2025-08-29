import { IsString } from "class-validator";
import { CreateOrderItemDto } from "src/modules/order-item/dto/create-order-item.dto";

export class CreateOrderDto {
    @IsString()
    customerId: string;

    @IsString()
    billingAddress: string;

    @IsString()
    shippingAddress: string;

    @IsString()
    paymentType: string;

    orderItems: CreateOrderItemDto[]
}
