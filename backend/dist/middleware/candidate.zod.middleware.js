import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { candidateSchema } from "../libs/schemas/candidate-schema.js";
import { formatZodErrors } from "../libs/utils/zod-errors.js";
export async function validateCandidateSchema(req, res, next) {
    try {
        // For creation, require all fields
        if (req.method === "POST") {
            const result = candidateSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    errors: formatZodErrors(result.error.issues),
                });
            }
        }
        else if (req.method === "PATCH") {
            // For editing, allow optional fields
        }
        else {
            throw new Error("Unsupported HTTP method");
        }
        next();
    }
    catch (err) {
        logger.error({
            message: `Failed to validate: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: err.message ?? "Invalid data",
        });
    }
}
//# sourceMappingURL=candidate.zod.middleware.js.map