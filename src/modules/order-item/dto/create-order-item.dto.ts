import { IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsString()
    title: string;

    @IsString()
    artistId: string;

    @IsNumber()
    price: number;

    @IsString()
    url?: string;
}

