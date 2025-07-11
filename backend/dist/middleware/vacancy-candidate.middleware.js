import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { vacancyCandidateRemarksSchema, vacancyCandidateStatusSchema, } from "../libs/schemas/vacancy-candidate-status-schema.js";
import { formatZodErrors } from "../libs/utils/zod-errors.js";
import { statusService } from "../services/status.service.js";
import { vacancyService } from "../services/vacancy.service.js";
export async function validateVacancyCandidateStatus(req, res, next) {
    try {
        const result = vacancyCandidateStatusSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errors: formatZodErrors(result.error.issues),
            });
        }
        const vacancyId = Number(req.params.vacancyId);
        const candidateId = Number(req.params.candidateId);
        const statusId = Number(req.body.statusId);
        const vacancyCandidate = await vacancyService.findCandidate({
            vacancyId,
            candidateId,
        });
        if (!vacancyCandidate) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Candidate does not exist in vacancy",
            });
        }
        const status = await statusService.find(statusId);
        if (!status) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Status does not exist",
            });
        }
        if (status.name.toLowerCase() === "rejected") {
            const remarks = vacancyCandidateRemarksSchema.safeParse({
                remarks: req.body.remarks,
            });
            if (!remarks.success) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: remarks.error.issues[0].message,
                });
            }
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
//# sourceMappingURL=vacancy-candidate.middleware.js.map