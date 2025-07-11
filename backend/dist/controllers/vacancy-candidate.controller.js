import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { vacancyCandidateService } from "../services/vacancy-candidate.service.js";
async function listCandidates(req, res) {
    try {
        const { vacancyId } = req.params;
        const shortlistId = req.query.shortlistId
            ? Number(req.query.shortlistId)
            : undefined;
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const statuses = req.query.status;
        const candidates = await vacancyCandidateService.listCandidates(Number(vacancyId), shortlistId, { page, pageSize }, statuses);
        res.status(HTTP_STATUS_CODES.OK).json({
            data: candidates,
        });
    }
    catch (err) {
        logger.error(`Failed to list VacancyCandidates: ${err.message}`);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
}
async function removeCandidate(req, res) {
    try {
        const candidateId = Number(req.params.candidateId);
        const vacancyId = Number(req.params.vacancyId);
        const vacancyCandidate = await vacancyCandidateService.findCandidate({
            vacancyId,
            candidateId,
        });
        if (!vacancyCandidate) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Candidate does not exist in vacancy",
            });
        }
        await vacancyCandidateService.removeCandidate(vacancyCandidate.id);
        res.status(HTTP_STATUS_CODES.OK).json({
            message: "Candidate removed successfully",
        });
    }
    catch (err) {
        logger.error(`Failed to remove Candidate: ${err.message}`);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
export const vacancyCandidateController = {
    listCandidates,
    removeCandidate,
};
//# sourceMappingURL=vacancy-candidate.controller.js.map