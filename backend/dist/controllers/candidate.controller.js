import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { candidateService } from "../services/candidate.service.js";
import { uploadToMinio } from "../services/file.service.js";
async function listPaginated(req, res) {
    try {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const keyword = req.query.keyword;
        const { paginatedResult } = await candidateService.listPaginated({
            page,
            pageSize,
            keyword,
        });
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: paginatedResult,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list paginated candidate: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function listByEmail(req, res) {
    try {
        const email = req.query.email;
        const candidateEmailList = await candidateService.listByEmail(email);
        res.status(HTTP_STATUS_CODES.OK).json({
            data: candidateEmailList,
        });
    }
    catch (error) {
        logger.error({
            message: `Failed to list the candidates: ${error.message}`,
        });
    }
}
async function findById(req, res) {
    try {
        const candidateId = Number(req.params.candidateId);
        const candidate = await candidateService.findById(candidateId);
        if (!candidate) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Candidate does not exist",
            });
        }
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: candidate,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to find candidate: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function create(req, res) {
    try {
        const { firstName, middleName, lastName, email, phone, address, gender, recievedAt, } = req.body;
        const vacancyId = Number(req.params.vacancyId);
        const shortlistId = Number(req.body.shortlistId);
        const mediumId = Number(req.body.mediumId);
        const pdf = req.file;
        let cvDetails = null;
        if (req.file) {
            const fileUploadResult = await uploadToMinio(req.file);
            if (!fileUploadResult) {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    message: ErrorCode.INTERNAL_SERVER_ERROR,
                });
            }
            cvDetails = {
                fileName: fileUploadResult.fileName,
                minioFileName: fileUploadResult.minioFileName,
                recievedAt,
            };
        }
        try {
            const existingCandidate = await candidateService.findByEmail(email);
            let candidate;
            if (existingCandidate) {
                candidate = await candidateService.update(existingCandidate.id, {
                    firstName,
                    middleName,
                    lastName,
                    email,
                    phone,
                    address,
                    gender,
                    vacancyId,
                    shortlistId,
                    mediumId,
                    cv: pdf ? cvDetails : undefined,
                });
            }
            else {
                candidate = await candidateService.create({
                    firstName,
                    middleName,
                    lastName,
                    email,
                    phone,
                    address,
                    gender,
                    vacancyId,
                    shortlistId,
                    mediumId,
                    cv: cvDetails,
                });
            }
            return res.status(HTTP_STATUS_CODES.OK).json({
                data: candidate,
            });
        }
        catch (error) {
            const parsedError = JSON.parse(error.message);
            logger.error({
                message: `Failed to create/update candidate: ${parsedError.message}`,
            });
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: parsedError.code,
                message: parsedError.message,
            });
        }
    }
    catch (error) {
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function remove() { }
export const candidateController = {
    create,
    listByEmail,
    remove,
    listPaginated,
    findById,
};
//# sourceMappingURL=candidate.controller.js.map