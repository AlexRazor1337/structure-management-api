import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  BOSS = 'BOSS',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false })
  role: Role;

  @ManyToOne(() => User, { nullable: true })
  boss: User;
}
