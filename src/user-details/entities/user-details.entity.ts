import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserDetails {
  @PrimaryColumn()
  userId: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  image?: string;
}
