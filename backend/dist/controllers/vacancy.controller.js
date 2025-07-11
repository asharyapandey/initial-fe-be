import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import logger from "../libs/logger.js";
import { ErrorCode } from "../libs/responses/error-code.js";
import { designationService } from "../services/designation.service.js";
import { statusService } from "../services/status.service.js";
import { vacancyService } from "../services/vacancy.service.js";
async function create(req, res) {
    try {
        const { description, designationId, openingDate, closingDate, noOfOpenings, mediums, } = req.body;
        const designation = await designationService.find(designationId, false);
        if (!designation) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "designation does not exists",
            });
        }
        const referenceNo = await vacancyService.generateReference({
            openingDate,
            designationCode: designation.code,
        });
        try {
            const vacancy = await vacancyService.create({
                description,
                designationId,
                openingDate,
                closingDate,
                referenceNo,
                noOfOpenings,
                mediums,
            });
            return res.status(HTTP_STATUS_CODES.OK).json({
                data: vacancy,
            });
        }
        catch (err) {
            logger.error({
                message: `Failed to create vacancy: ${err.message}`,
            });
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }
    catch (err) {
        logger.error({
            message: `Failed to create vacancy: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function listPaginated(req, res) {
    try {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const designationIds = req.query.designationIds;
        const referenceNo = req.query.referenceNo;
        const openingDate = req.query.openingDate
            ? new Date(req.query.openingDate)
            : undefined;
        const closingDate = req.query.closingDate
            ? new Date(req.query.closingDate)
            : undefined;
        const { paginatedResult } = await vacancyService.listPaginated({ page, pageSize }, designationIds, referenceNo, openingDate, closingDate);
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: paginatedResult,
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to list paginated vacancy: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function toggleDisableEnable(req, res) {
    try {
        const id = Number(req.params.vacancyId);
        const vacancy = await vacancyService.find(id);
        if (!vacancy) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "vacancy doesnot exist",
            });
        }
        if (vacancy.deletedAt) {
            await vacancyService.enable(vacancy);
            return res.status(HTTP_STATUS_CODES.OK).json({
                message: "vacancy enabled",
            });
        }
        await vacancyService.disable(id);
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: "vacancy disabled",
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to disable or enable vacancy: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function details(req, res) {
    try {
        const vacancyId = parseInt(req.params.vacancyId);
        const vacancy = await vacancyService.details(vacancyId);
        if (!vacancy) {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                message: "Vacancy not found",
            });
        }
        const shortlists = vacancy.shortlists;
        const shortlistMap = shortlists.map((shortlist) => ({
            id: shortlist.id,
            name: shortlist.name,
            candidateCount: shortlist.vacancyCandidates.length,
        }));
        return res.status(HTTP_STATUS_CODES.OK).json({
            data: {
                ...vacancy,
                shortlists: shortlistMap,
            },
        });
    }
    catch (error) {
        logger.error("Error retrieving vacancy details:", error);
        return res
            .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
}
async function update(req, res) {
    try {
        const vacancyId = Number(req.params.vacancyId);
        const { description, closingDate, noOfOpenings, mediums, openingDate, designationId, referenceNo, } = req.body;
        const vacancy = await vacancyService.findVacancy(vacancyId, false);
        if (!vacancy) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                status: "error",
                message: "The vacancy to be updated is not found",
            });
        }
        let newReferenceNo = referenceNo;
        if (openingDate !== vacancy.openingDate ||
            designationId !== vacancy.designation.id) {
            const designation = await designationService.find(designationId);
            if (!designation) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    status: "error",
                    message: "Invalid designation",
                });
            }
            newReferenceNo = await vacancyService.generateReference({
                openingDate,
                designationCode: designation.code,
            });
        }
        const updatedVacancy = await vacancyService.update(vacancy, {
            description: description,
            designationId: designationId,
            openingDate: openingDate,
            closingDate: closingDate,
            referenceNo: newReferenceNo,
            noOfOpenings: noOfOpenings,
            mediums: mediums,
        });
        if (updatedVacancy) {
            res.status(HTTP_STATUS_CODES.OK).json({
                message: "Vacancy Updated",
            });
        }
    }
    catch (err) {
        logger.error({
            message: `Failed to update vacancy: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
async function updateStatus(req, res) {
    try {
        const vacancyId = Number(req.params.vacancyId);
        const candidateId = Number(req.params.candidateId);
        const { statusId, remarks } = req.body;
        const vacancyCandidate = await vacancyService.findCandidate({
            vacancyId,
            candidateId,
        });
        let values;
        const status = await statusService.find(statusId);
        if (status.name.toLowerCase() === "rejected") {
            values = { statusId, remarks };
        }
        else {
            values = { statusId };
        }
        const updatedVacancyCandidate = await vacancyService.updateStatus({
            vacancyCandidate,
            values,
        });
        return res
            .status(HTTP_STATUS_CODES.OK)
            .json({ data: updatedVacancyCandidate });
    }
    catch (err) {
        logger.error({
            message: `Failed to update vacancy candidate status: ${err.message}`,
        });
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
    }
}
export const vacancyController = {
    create,
    listPaginated,
    toggleDisableEnable,
    details,
    update,
    updateStatus,
};
//# sourceMappingURL=vacancy.controller.js.map