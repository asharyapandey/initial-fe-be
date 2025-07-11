import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { mediumService } from "../services/medium.service.js";
async function create(req, res) {
    try {
        const { name } = req.body;
        const nameExists = await mediumService.findByName(name);
        if (nameExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Medium name already exists",
            });
        }
        const medium = await mediumService.create(name);
        return res.status(HTTP_STATUS_CODES.CREATED).json({
            data: medium,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to create medium: ${err.message}`,
        });
        return res
            .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
    }
}
async function update(req, res) {
    try {
        const mediumId = req.params.mediumId;
        const { name } = req.body;
        //Only allow edit if medium is not disabled
        const medium = await mediumService.find(parseInt(mediumId), false);
        if (!medium) {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                message: "The medium to be updated is not found!",
            });
        }
        if (name && medium.name !== name) {
            const exist = await mediumService.findByName(name);
            if (exist) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "name",
                    message: "Medium name already exists",
                });
            }
        }
        const updatedMedium = await mediumService.update(medium, {
            name,
        });
        res.status(HTTP_STATUS_CODES.OK).json({
            data: updatedMedium,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to update medium: ${err.message}`,
        });
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function listPaginated(req, res) {
    try {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const { paginatedResult } = await mediumService.listPaginated({
            page,
            pageSize,
        });
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: paginatedResult,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list paginated medium: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function list(_req, res) {
    try {
        const result = await mediumService.list();
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: result,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list medium: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function toggleDisableEnable(req, res) {
    try {
        const id = Number(req.params.mediumId);
        const medium = await mediumService.find(id);
        if (!medium) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "medium doesnot exist",
            });
        }
        if (medium.deletedAt) {
            await mediumService.enable(medium);
            return res.status(HTTP_STATUS_CODES.OK).json({
                message: "medium enabled",
            });
        }
        await mediumService.disable(id);
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: "medium disabled",
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to disable or enable medium: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
export const mediumController = {
    create,
    update,
    listPaginated,
    list,
    toggleDisableEnable,
};
//# sourceMappingURL=medium.controller.js.map