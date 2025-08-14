import { Artist } from "src/artist/entities/artist.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('orderItem')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @ManyToOne(() => Artist)
    artist: Artist;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ nullable: true })
    url?: string;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;
}
