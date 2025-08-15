import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Customer } from "src/modules/customer/entities/customer.entity";
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

}
