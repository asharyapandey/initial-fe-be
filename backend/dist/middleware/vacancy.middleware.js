import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { vacancySchema } from "../libs/schemas/vacancy-schema.js";
import { formatZodErrors } from "../libs/utils/zod-errors.js";
import { designationService } from "../services/designation.service.js";
import { vacancyService } from "../services/vacancy.service.js";
export async function validateVacancySchema(req, res, next) {
    try {
        let { openingDate, closingDate } = req.body;
        // For creation, require all fields
        if (req.method === "POST") {
            const result = vacancySchema.safeParse(req.body);
            if (!result.success) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    errors: formatZodErrors(result.error.issues),
                });
            }
            try {
                if (closingDate) {
                    checkDate(openingDate, closingDate);
                }
            }
            catch (err) {
                logger.error({
                    message: `Failed to validate: ${err.message}`,
                });
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: err.message,
                });
            }
        }
        else if (req.method === "PATCH") {
            // For editing, allow optional fields
            const vacancyId = Number(req.params.vacancyId);
            vacancySchema.partial().parse(req.body);
            try {
                const vacancy = await vacancyService.find(vacancyId);
                if (!vacancy) {
                    throw new Error("vacancy does not exist");
                }
                if (req.body.designationId) {
                    const designationExists = await designationService.find(req.body.designationId, false);
                    if (!designationExists) {
                        throw new Error("designation doesnt exist");
                    }
                }
                //validate date only if opening date or closing date is present
                if (openingDate || closingDate) {
                    //get closing date if not present
                    if (!closingDate) {
                        closingDate = vacancy.closingDate;
                    }
                    //get opening date if not present
                    if (!openingDate) {
                        openingDate = vacancy.openingDate;
                    }
                    //validate the dates only if both closing and opening date are available
                    if (openingDate && closingDate) {
                        checkDate(openingDate, closingDate);
                    }
                }
            }
            catch (err) {
                logger.error({
                    message: `Failed to validate: ${err.message}`,
                });
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: err.message,
                });
            }
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
            message: err.errors?.[0]?.message ?? "Invalid data",
        });
    }
}
function checkDate(openingDate, closingDate) {
    if (new Date(closingDate) < new Date(openingDate)) {
        throw new Error("closing date cannot be before opening date");
    }
}
//# sourceMappingURL=vacancy.middleware.js.map