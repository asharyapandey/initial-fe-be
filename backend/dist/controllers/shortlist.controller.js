import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { shortlistService } from "../services/shortlist.service.js";
import { vacancyService } from "../services/vacancy.service.js";
import { vacancyCandidateService } from "../services/vacancy-candidate.service.js";
async function create(req, res) {
    try {
        const vacancyId = Number(req.params.vacancyId);
        const { name } = req.body;
        const vacancyExists = await vacancyService.find(vacancyId);
        if (!vacancyExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Vacancy not found!",
            });
        }
        if (vacancyExists.deletedAt !== null) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Vacancy is disabled",
            });
        }
        const nameExists = await shortlistService.findByName(name, vacancyId);
        if (nameExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Shortlist name already exists",
            });
        }
        const newShortlist = await shortlistService.create(name, vacancyId);
        res.status(HTTP_STATUS_CODES.CREATED).json({
            shortlist: newShortlist,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to create shortlist: ${err.message}`,
        });
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function update(req, res) {
    try {
        const shortlistId = req.params.shortlistId;
        const vacancyId = Number(req.params.vacancyId);
        const { name } = req.body;
        const shortlist = await shortlistService.find(parseInt(shortlistId));
        if (!shortlist) {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                status: "error",
                message: "The shortlist to be updated is not found!",
            });
        }
        if (shortlist.vacancy.id !== vacancyId) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "vacancyId",
                message: "Shortlist does not belong to the specified vacancy",
            });
        }
        const vacancyExists = await vacancyService.find(vacancyId);
        if (!vacancyExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Vacancy not found!",
            });
        }
        if (name && shortlist.name !== name) {
            const exist = await shortlistService.findByName(name, vacancyId);
            if (exist) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "name",
                    message: "shortlist name already exists",
                });
            }
        }
        const updatedShortlist = await shortlistService.update(shortlist, {
            name,
        });
        res.status(HTTP_STATUS_CODES.OK).json({
            data: updatedShortlist,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to update shortlist: ${err.message}`,
        });
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
        });
    }
}
async function remove(req, res) {
    try {
        const shortlistId = Number(req.params.shortlistId);
        const vacancyId = Number(req.params.vacancyId);
        const candidates = await vacancyCandidateService.findCandidatesByShortlistId([shortlistId]);
        if (candidates.length > 0) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Shortlist is not empty and cannot be deleted",
            });
        }
        await shortlistService.remove(shortlistId, vacancyId);
        res.status(HTTP_STATUS_CODES.OK).json({
            message: "Shortlist entry successfully deleted",
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to remove shortlist: ${err.message}`,
        });
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function find() { }
export const shortlistController = {
    create,
    update,
    remove,
    find,
};
//# sourceMappingURL=shortlist.controller.js.map