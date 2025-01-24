import { join } from "path";
import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
  type: "mysql",
  host: process.env.ORM_HOST,
  port: Number(process.env.ORM_PORT),
  username: process.env.ORM_USERNAME,
  password: process.env.ORM_PASSWORD,
  database: process.env.ORM_DATABASE,
  synchronize: false,
  logging: true,
  entities: [join(__dirname, "src/database/entities/*.ts")],
  migrations: [join(__dirname, "src/database/migrations/*.ts")],
  subscribers: [],
  charset: "utf8mb4",
});
