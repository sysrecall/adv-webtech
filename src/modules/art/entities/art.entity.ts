import { Artist } from "src/artist/entities/artist.entity"
import {  Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
@Entity('art')
export class Art {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;
    @ManyToOne(() => Artist)
    artist: Artist;
    @Column()
    url: string;
    @Column({
        type: 'decimal'
    })
    price: number;
    @Column()
    subject: string;
    @Column()
    style: string;
    @Column()
    desc: string;
    // admin: any;
    @ManyToOne(() => Admin, admin => admin.art)
    admin: Admin;
}
