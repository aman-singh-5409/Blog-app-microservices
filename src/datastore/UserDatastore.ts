import { inject, injectable } from "inversify";
import { IUserDatastore } from "./UserDatastore.interface";
import { DataSource, EntityManager } from "typeorm";
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
  ): Promise<User> {
    const executeQuery = (connection: DataSource) =>
      connection.getRepository(User).save(object);
    if (transaction) {
      return executeQuery(transaction.connection);
    }
    return this.databaseConnnection.usingConnection(executeQuery);
  }

  public async getUserByEmail(
    email: string,
    transaction?: EntityManager
  ): Promise<User | null> {
    const executeQuery = (connection: DataSource) =>
      connection
        .getRepository(User)
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.email = :email", { email })
        .getOne();
    if (transaction) {
      return executeQuery(transaction.connection);
    }
    return this.databaseConnnection.usingConnection(executeQuery);
  }
}
