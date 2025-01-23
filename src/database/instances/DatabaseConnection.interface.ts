import { DataSource, EntityManager } from "typeorm";

export interface IDatabaseConnection {
  usingConnection<ReturnType>(
    exec: (connection: DataSource) => Promise<ReturnType>
  ): Promise<ReturnType>;

  usingTransction<ReturnType>(
    exec: (transaction: EntityManager) => Promise<ReturnType>
  ): Promise<ReturnType>;

  initDbConnection(): Promise<void>;

  close(): Promise<void>;
}
