import "reflect-metadata";

import { DataSource } from "typeorm";

import { Admin } from "../entities/admin.entity.js";
import env from "./env.js";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Admin],
  subscribers: [],
  migrations: [],
});
