import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { statusService } from "../services/status.service.js";
// create status controller
async function create(req, res) {
    try {
        const { name, color } = req.body;
        const nameExists = await statusService.findByName(name);
        if (nameExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Status name already exists",
            });
        }
        const colorExists = await statusService.findByColor(color);
        if (colorExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "color",
                message: "Status color already exists",
            });
        }
        const status = await statusService.create(name, color);
        return res.status(HTTP_STATUS_CODES.CREATED).json({
            data: status,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to create status: ${err.message}`,
        });
        return res
            .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
    }
}
async function update(req, res) {
    try {
        const statusId = parseInt(req.params.statusId);
        const { name, color } = req.body;
        //only allow editing if status is not disabled
        const status = await statusService.find(statusId, false);
        if (!status) {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                message: "The status to be updated is not found",
            });
        }
        if (name && name !== status.name) {
            const statusNameExists = await statusService.findByName(name);
            if (statusNameExists) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "name",
                    message: "Status name already exists",
                });
            }
        }
        if (color && color !== status.color) {
            const statusColorExists = await statusService.findByColor(color);
            if (statusColorExists) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "color",
                    message: "Status color already exists",
                });
            }
        }
        const updatedStatus = await statusService.update(status, {
            name: name || status.name,
            color: color || status.color,
        });
        res.status(HTTP_STATUS_CODES.OK).json({
            data: updatedStatus,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to update satus: ${err.message}`,
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
        const { paginatedResult } = await statusService.listPaginated({
            page,
            pageSize,
        });
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: paginatedResult,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list paginated status: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function list(_req, res) {
    try {
        const result = await statusService.list();
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: result,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list status: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
}
async function find() { }
async function toggleDisableEnable(req, res) {
    try {
        const id = Number(req.params.statusId);
        const status = await statusService.find(id);
        if (!status) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Status does not exist",
            });
        }
        if (status.deletedAt) {
            await statusService.enable(status);
            return res.status(HTTP_STATUS_CODES.OK).json({
                message: "Status enabled",
            });
        }
        await statusService.disable(id);
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: "Status disabled",
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to disable or enable status: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
export const statusController = {
    create,
    update,
    listPaginated,
    find,
    list,
    toggleDisableEnable,
};
//# sourceMappingURL=status.controller.js.map