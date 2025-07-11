import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { designationService } from "../services/designation.service.js";
async function listPaginated(req, res) {
    try {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const { paginatedResult } = await designationService.listPaginated({
            page,
            pageSize,
        });
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: paginatedResult,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list paginated designation: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function update(req, res) {
    try {
        const designationId = Number(req.params.designationId);
        const { name, code, color } = req.body;
        //Only allow edit if the designation is not disabled
        const designation = await designationService.find(designationId, false);
        if (!designation) {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                message: "The designation to be updated is not found!",
            });
        }
        if (name && name !== designation.name) {
            const designationNameExists = await designationService.findByName(name);
            if (designationNameExists) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "name",
                    message: "Designation name already exists",
                });
            }
        }
        if (color && color !== designation.color) {
            const designationColorExists = await designationService.findByColor(color);
            if (designationColorExists) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "color",
                    message: "Designation color already exists",
                });
            }
        }
        if (code && code !== designation.code) {
            const designationCodeExists = await designationService.findByCode(code);
            if (designationCodeExists) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    code: "code",
                    message: "Designation code already exists",
                });
            }
        }
        const updatedDesignation = await designationService.update(designation, {
            name: name || designation.name,
            color: color || designation.color,
            code: code || designation.code,
        });
        if (updatedDesignation) {
            res.status(HTTP_STATUS_CODES.OK).json({
                data: updatedDesignation,
            });
        }
    }
    catch (err) {
        logger.error({
            message: `Failed to update designation: ${err.message}`,
        });
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function create(req, res) {
    try {
        const { name, color, code } = req.body;
        const nameExists = await designationService.findByName(name);
        if (nameExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "name",
                message: "Designation name already exists",
            });
        }
        const colorExists = await designationService.findByColor(color);
        if (colorExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "color",
                message: "Designation color already exists",
            });
        }
        const codeExists = await designationService.findByCode(code);
        if (codeExists) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                code: "code",
                message: "Designation code already exists",
            });
        }
        const designation = await designationService.create(name, color, code);
        return res.status(HTTP_STATUS_CODES.CREATED).json({ data: designation });
    }
    catch (err) {
        logger.error({
            message: `Failed to create designation: ${err.message}`,
        });
        return res
            .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
    }
}
async function toggleDisableEnable(req, res) {
    try {
        const id = Number(req.params.designationId);
        const designation = await designationService.find(id);
        if (!designation) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "designation doesnot exist",
            });
        }
        if (designation.deletedAt) {
            await designationService.enable(designation);
            return res.status(HTTP_STATUS_CODES.OK).json({
                message: "designation enabled",
            });
        }
        await designationService.disable(id);
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: "designation disabled",
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to disable or enable designation: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function list(_req, res) {
    try {
        const result = await designationService.list();
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: result,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list designation: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
export const designationController = {
    update,
    listPaginated,
    create,
    toggleDisableEnable,
    list,
};
//# sourceMappingURL=designation.controller.js.map