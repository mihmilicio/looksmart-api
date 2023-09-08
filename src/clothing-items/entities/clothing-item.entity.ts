import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClothingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  usage?: string;

  @Column({ nullable: true })
  season?: string;

  @Column()
  image: string;
}
