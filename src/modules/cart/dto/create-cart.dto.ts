import { CreateCartItemDto } from "src/modules/cart-item/dto/create-cart-item.dto";

export class CreateCartDto {
    customerId: string;
    cartItems?: CreateCartItemDto[];
}
