import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Cart } from "src/modules/cart/entities/cart.entity";
import User from "src/common/interfaces/user";

@Entity("customer")
export class Customer implements User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
    })
    username: string;
    @Column()
    passwordHash: string;
    @Column()
    email: string;
    @Column({
        type: 'varchar',
        length: 150,
    })
    fullName: string;
    @Column({
        nullable: true,
    })
    billingAddress: string;
    @Column({
        nullable: true,
    })
    shippingAddress: string;
    @Column({
        nullable: true,
    })
    phone: string;
    @Column({
        nullable: true,
    })
    gender: string;
    
    @Column({
        type: 'varchar',
        nullable: true,
    })
    profilePhotoPath: string | null;

    @OneToOne(() => Cart, cart => cart.customer, { onDelete: 'CASCADE' })
    @JoinColumn()
    cart: Cart;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[]
    
    @ManyToOne(() => Admin, admin => admin.customers)
    admin: Admin;
}
