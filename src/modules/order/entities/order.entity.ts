import { Customer } from "src/modules/customer/entities/customer.entity";
import { OrderItem } from "src/modules/order-item/entities/order-item.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    orderTime: string;

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer;

    @Column()
    billingAddress: string;

    @Column()
    shippingAddress: string;

    @Column()
    paymentType: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true})
    orderItems: OrderItem[]
}
