import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("text", { nullable: true })
  customerId: string | null;

  @Column("text", { nullable: true })
  paymentId: string | null;

  @Column("text", { default: "free-trial" })
  plan: string;
}
