import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class LookHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  usage: string;

  @Column()
  season: string;

  @Column()
  lowConfiability: boolean;

  @Column()
  topImage: string;

  @Column()
  bottomImage: string;

  @Column()
  footwearImage: string;

  @CreateDateColumn()
  createdDate: Date;
}
