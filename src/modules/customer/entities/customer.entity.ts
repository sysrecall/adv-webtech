import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";

@Entity("customer")
export class Customer {
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
        type: 'bool',
        default: false,
    })
    isActive: boolean;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    profilePhotoPath: string | null;

    
    
  @ManyToOne(() => Admin, admin => admin.customers)
  admin: Admin;
}
