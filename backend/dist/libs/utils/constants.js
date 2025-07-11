import env from "../env.js";
const COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const REGEX = {
    COLOR_REGEX,
};
export const CONTACT_REGEX = /^\d{10}$/;
export const BASE_API = "/api";
export const MINIO_BASE_URL = `${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${env.MINIO_BUCKET_NAME}`;
//# sourceMappingURL=constants.js.map