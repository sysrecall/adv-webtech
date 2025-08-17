import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Entity('art')
export class Art {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => Artist, artist => artist.arts, { onDelete: 'CASCADE' })
  artist: Artist;

  @ManyToOne(() => Admin, admin => admin.art, { nullable: true, onDelete: 'SET NULL' })
  admin?: Admin | null;
}
