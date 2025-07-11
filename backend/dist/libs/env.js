import { z } from "zod";
import logger from "./logger.js";
const envSchema = z.object({
    PORT: z.string().regex(/^\d+$/).transform(Number).default("5000"),
    DB_HOST: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.string().regex(/^\d+$/).transform(Number).default("3306"),
    DB_NAME: z.string(),
    NODE_ENV: z.string(),
    SALT: z.string().regex(/^\d+$/).transform(Number),
    ADMIN_USERNAME: z.string(),
    ADMIN_PASSWORD: z.string(),
    JWT_SECRET: z.string(),
    TOKEN_EXPIRATION: z.string(),
    MINIO_ENDPOINT: z.string(),
    MINIO_PORT: z.string().regex(/^\d+$/).transform(Number).default("9000"),
    MINIO_USE_SSL: z.string().transform((value) => value === "true"),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_SECRET_KEY: z.string(),
    MINIO_BUCKET_NAME: z.string(),
});
const envData = envSchema.safeParse(process.env);
if (!envData.success) {
    logger.error({
        message: `Invalid environment variables: ${envData.error.format()}`,
    });
    process.exit(1);
}
const env = envData.data;
export default env;
//# sourceMappingURL=env.js.map