import { Entity, Column, PrimaryColumn, BeforeInsert } from "typeorm";
import { v4 } from "uuid";

@Entity("customer")
export class Customer {
    @PrimaryColumn()
    id: string;
    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
    })
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;
    @Column({
        type: 'varchar',
        length: 150,
    })
    fullName: string;
    @Column()
    billingAddress: string;
    @Column()
    shippingAddress: string;
    @Column()
    phone: string;
    @Column()
    gender: string;
    @Column({
        type: 'varchar',
        nullable: true,
    })
    @Column({
        type: 'bool',
        default: false,
    })
    isActive: boolean;
    profilePhotoPath: string | null;


    @BeforeInsert()
    generateId() {
        this.id = v4();
        console.log(this.id);
    }
}
