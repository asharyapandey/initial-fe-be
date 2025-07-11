import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true, length: 30 })
  username: string;

  @Column()
  password: string;
}
