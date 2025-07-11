import { z } from "zod";
import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
export function validatePaginationQueries(req, res, next) {
    try {
        const paginationQueriesSchema = z.object({
            page: z.preprocess((val) => Number(val), z
                .number({ message: "page can only be number" })
                .positive({ message: "page can only be positive number" })),
            pageSize: z.preprocess((val) => Number(val), z
                .number({ message: "page size can only be number" })
                .positive({ message: "page size can only be positive number" })),
        });
        paginationQueriesSchema.parse(req.query);
        next();
    }
    catch (err) {
        logger.error({
            message: `Failed to validate pagination queries: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: err.errors[0].message,
        });
    }
}
//# sourceMappingURL=pagination-queries.validation.js.map