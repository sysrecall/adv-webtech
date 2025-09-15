import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Art } from 'src/modules/art/entities/art.entity';
import User from 'src/common/interfaces/user';

@Entity('artist')
export class Artist implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @OneToMany(() => Art, art => art.artist)
  arts: Art[];
}