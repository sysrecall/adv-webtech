import { Art } from "src/modules/art/entities/art.entity";
import { Cart } from "src/modules/cart/entities/cart.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('cartItem')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal' })
    price: number;

    @ManyToOne(() => Art)
    art: Art;

    @ManyToOne(() => Cart, cart => cart.cartItems)
    cart: Cart;
}

