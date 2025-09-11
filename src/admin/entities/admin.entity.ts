import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Customer } from "src/modules/customer/entities/customer.entity";
import { Art } from "src/modules/art/entities/art.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { IsOptional } from "class-validator";
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

@Column({ type: 'varchar', length: 50, unique: true, nullable: true })
username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20 , nullable: true})
  phone: string;

  @Column({ type: 'varchar', length: 20, enum: ['male', 'female', 'other'] , nullable: true})
  gender: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nid: string;

  // @Column({ type: 'varchar', length: 255, nullable: true })
  // @IsOptional()
  // nidImage?: string;

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
