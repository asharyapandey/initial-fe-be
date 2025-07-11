import "reflect-metadata";
import { BaseEntity, DataSource } from "typeorm";
import { Admin } from "../entities/admin.entity.js";
import { Candidate } from "../entities/candidate.entity.js";
import { CV } from "../entities/cv.entity.js";
import { Designation } from "../entities/designation.entity.js";
import { Medium } from "../entities/medium.entity.js";
import { Shortlist } from "../entities/shortlist.entity.js";
import { Status } from "../entities/status.entity.js";
import { Vacancy } from "../entities/vacancy.entity.js";
import { VacancyCandidate } from "../entities/vacancy-candidate.entity.js";
import { VacancyMedium } from "../entities/vacancy-medium.entity.js";
import env from "./env.js";
export const AppDataSource = new DataSource({
    type: "mariadb",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        Designation,
        Vacancy,
        Medium,
        VacancyMedium,
        Candidate,
        VacancyCandidate,
        CV,
        Admin,
        Shortlist,
        Status,
        BaseEntity,
    ],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map