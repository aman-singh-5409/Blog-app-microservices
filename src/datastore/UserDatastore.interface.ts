import { EntityManager } from "typeorm";
import { User } from "../database/entities/User";

export interface IUserDatastore {
  saveUser(object: User, transaction?: EntityManager): Promise<User>;
  getUserByEmail(email: string, transaction?: EntityManager): Promise<User | null>;
}
