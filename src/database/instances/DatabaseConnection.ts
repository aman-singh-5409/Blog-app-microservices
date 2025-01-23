import { inject, injectable } from "inversify";
import { IDatabaseConnection } from "./DatabaseConnection.interface";
import { DataSource, EntityManager } from "typeorm";
import { INVERSIFY_TYPES } from "../../Inversify/InversifyTypes";
import { ILogger } from "../../utils/Logging/Logger.interface";
import { join } from "path";
import { Exception } from "../../utils/exceptions/Exception";
import { ErrorCode } from "../../utils/exceptions/ErrorCode";

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  private connection?: DataSource;

  constructor(
    @inject<ILogger>(INVERSIFY_TYPES.Logger) private logger: ILogger
  ) {
    this.initDbConnection();
  }

  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.destroy();
    }
  }

  /**
   * It will create connection with DB at the start of server
   */
  public async initDbConnection(): Promise<void> {
    return this.getConnection().then(() =>
      this.logger.info("DB connection successfull!")
    );
  }

  /**
   * Attempt a database query using a new connection, retry that connection
   * if the database connection fails whilst executing the query.
   *
   * @param exec  The database action to perform
   */
  public async usingConnection<ReturnType>(
    exec: (connection: DataSource) => Promise<ReturnType>
  ): Promise<ReturnType> {
    const maxRetries = 1;
    let attempt = 1;
    while (attempt <= maxRetries) {
      attempt += 1;
      // Force a new connection if this is the second attempt
      const connection = await this.getConnection(attempt > 2);
      try {
        return await exec(connection);
      } catch (err: any) {
        if (err && err.message === "Connection terminated unexpectedly") {
          this.logger.info(
            `Retrying connection. Attempt ${attempt} of ${maxRetries}`
          );
          continue;
        }
        throw err;
      }
    }
    throw new Exception(ErrorCode.Undefined, "Failed to complete action");
  }

  /**
   * Start a database transaction to perform batch database operations
   * @param exec
   */
  public async usingTransction<ReturnType>(
    exec: (transaction: EntityManager) => Promise<ReturnType>
  ): Promise<ReturnType> {
    return this.usingConnection((connection: DataSource) =>
      connection.transaction(async (trx) => exec(trx))
    );
  }

  private async getConnection(
    forceNewConnection: boolean = false
  ): Promise<DataSource> {
    if (
      forceNewConnection ||
      !this.connection ||
      !this.connection.isInitialized
    ) {
      this.connection = await this.retryConnect();
    }
    return this.connection;
  }

  private async retryConnect(
    maxRetries = 12,
    delayMs = 5000
  ): Promise<DataSource> {
    let connection: DataSource | undefined;
    let attempts = 1;
    while (!connection && attempts <= maxRetries) {
      attempts += 1;
      try {
        connection = await this.connect();
      } catch (error: any) {
        this.logger.error(error.message);
        switch (error.code) {
          case "28P01":
            throw new Exception(
              ErrorCode.Undefined,
              "Cannot connect to database invalid credentials"
            );
          case "ECONNREFUSED":
          case "EACCES":
          case "ENOTFOUND":
            if (attempts > maxRetries) {
              throw new Exception(
                ErrorCode.Undefined,
                "Cannot connect to database connection address"
              );
            }
            this.logger.info(
              `Retrying connection in ${delayMs} milleseconds. Attempt ${attempts} of ${maxRetries}`
            );
            await this.delay(delayMs);
            continue;
          default:
            throw new Exception(
              ErrorCode.Undefined,
              "Cannot connect to database"
            );
        }
      }
    }
    if (!connection) {
      throw new Exception(
        ErrorCode.Undefined,
        "Cannot connect to the database!"
      );
    }

    return connection;
  }

  public delay(delayMs: number) {
    return new Promise<void>((resolve: () => void) => {
      setTimeout(resolve, delayMs);
    });
  }

  private async connect(): Promise<DataSource> {
    return new DataSource({
      type: "mysql",
      host: process.env.ORM_HOST,
      port: Number(process.env.ORM_PORT),
      username: process.env.ORM_USERNAME,
      password: process.env.ORM_PASSWORD,
      database: process.env.ORM_DATABASE,
      synchronize: false,
      logging: true,
      entities: [join(__dirname, "../entities/public/*.ts")],
      migrations: [join(__dirname, "../migrations/public/*.ts")],
      subscribers: [],
      charset: "utf8mb4",
    }).initialize();
  }
}
