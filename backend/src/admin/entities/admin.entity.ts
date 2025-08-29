import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Customer } from "src/modules/customer/entities/customer.entity";
import { Art } from "src/modules/art/entities/art.entity";
import { Order } from "src/modules/order/entities/order.entity";
@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    fullName: string;

    @Column({ type: 'int', unsigned: true })
    age: number;

    @Column({ type: 'varchar', default: 'active', enum: ['active', 'inactive'] })
    status: string;

    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;
    @Column()
    phone: string;
    @Column()
    gender: string;
    @Column()
    nid: string;
    
    @Column({ type: 'bytea', nullable: true })
    @Exclude() // Exclude nidImage from serialization by default
    nidImage: Buffer; //

    @OneToMany(() => Customer, customer=> customer.admin)
    customers: Customer[];

    @OneToMany(() => Art, art => art.admin)
    art: Art[];

    @OneToMany(() => Order, order => order.admin)
      orders: Order[];

}
