import { Artist } from "src/artist/entities/artist.entity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('art')
export class Art {
    @PrimaryGeneratedColumn('uuid');
    id: string;
    @Column()
    title: string;
    @Column()
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
}
