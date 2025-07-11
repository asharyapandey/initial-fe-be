import * as Minio from "minio";
import env from "../libs/env.js";
import logger from "../libs/logger.js";
const minioClient = new Minio.Client({
    endPoint: env.MINIO_ENDPOINT,
    port: env.MINIO_PORT,
    useSSL: env.MINIO_USE_SSL,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
});
export async function uploadToMinio(file) {
    const bucketName = env.MINIO_BUCKET_NAME;
    const objectName = `${Date.now()}-${file.originalname}`;
    const metaData = {
        "Content-Type": file.mimetype,
        "Content-Disposition": "inline",
    };
    try {
        await minioClient.putObject(bucketName, objectName, file.buffer, file.size, metaData);
        return {
            minioFileName: objectName,
            fileName: file.originalname,
        };
    }
    catch (err) {
        logger.error({
            message: `Error uploading file to MinIO: ${err.message}`,
        });
    }
}
//# sourceMappingURL=file.service.js.map