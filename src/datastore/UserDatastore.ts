import { inject, injectable } from "inversify";
import { IUserDatastore } from "./UserDatastore.interface";
import { EntityManager } from "typeorm";
import { User } from "../database/entities/User";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { IDatabaseConnection } from "../database/instances/DatabaseConnection.interface";

@injectable()
export class UserDatastore implements IUserDatastore {
  constructor(
    @inject(INVERSIFY_TYPES.DatabaseConnection)
    private databaseConnnection: IDatabaseConnection
  ) {}

  public async saveUser(
    object: User,
    transaction?: EntityManager
  ): Promise<void> {}
}
