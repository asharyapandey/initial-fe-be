import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { candidateService } from "../services/candidate.service.js";
import { mediumService } from "../services/medium.service.js";
import { shortlistService } from "../services/shortlist.service.js";
import { vacancyService } from "../services/vacancy.service.js";
export async function validateCandidateData(req, res, next) {
    try {
        const { mediumId, shortlistId, phone, email } = req.body;
        const vacancyId = Number(req.params.vacancyId);
        if (Number.isNaN(vacancyId)) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "vacancyId must be a number",
            });
        }
        const mediumExists = await mediumService.find(mediumId, false);
        const vacancyExists = await vacancyService.find(vacancyId, false);
        const shortlistExists = await shortlistService.findShortlist(shortlistId, vacancyId);
        const existingCandidate = await candidateService.findByEmail(email);
        const candidateWithPhone = await candidateService.findByPhone(phone);
        const existingVacancyMedium = await candidateService.findVacancyMedium(vacancyId, mediumId);
        if (!mediumExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Invalid mediumId",
            });
        }
        if (!vacancyExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Invalid vacancyId",
            });
        }
        if (!shortlistExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "shortlistId does not belong to the vacancyId",
            });
        }
        if (!existingCandidate) {
            if (!req.file) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: "CV is required for new candidates",
                });
            }
        }
        if (existingCandidate) {
            if (candidateWithPhone &&
                candidateWithPhone.id !== existingCandidate.id) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "phone",
                    message: "Phone number already exists",
                });
            }
        }
        else {
            if (candidateWithPhone) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "phone",
                    message: "phone number already exists",
                });
            }
        }
        if (!existingVacancyMedium) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: `Medium with id ${mediumId} does not belong to vacancy with id ${vacancyId}`,
            });
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
//# sourceMappingURL=candidate.middleware.js.map