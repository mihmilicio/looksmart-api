import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  imageUrl: string;

  @Column()
  imageDescription: string;

  @Column()
  body: string;

  @Column()
  category: string;
}
