import { IsDecimal, IsNumber, IsString, Min } from "class-validator";
import { Art } from "src/modules/art/entities/art.entity";
import { Cart } from "src/modules/cart/entities/cart.entity";

export class CreateCartItemDto {
    @Min(1)
    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;

    @IsString()
    artId: string;
}
