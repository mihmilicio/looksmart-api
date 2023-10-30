import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  description?: string;

  @Column()
  image: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ nullable: true })
  userId?: string;
}
