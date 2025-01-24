import { EntityManager } from "typeorm";
import { User } from "../database/entities/User";

export interface IUserDatastore {
  saveUser(object: User, transaction?: EntityManager): Promise<void>;
}
