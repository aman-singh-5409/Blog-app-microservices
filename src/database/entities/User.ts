import { Column, Entity } from "typeorm";
import { DefaultEntity } from "./Default";

@Entity()
export class User extends DefaultEntity {
  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  emailVerified?: boolean;
}
