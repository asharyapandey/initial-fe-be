import express from "express";
import { candidateController } from "../controllers/candidate.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateCandidateData } from "../middleware/candidate.middleware.js";
import { validateCandidateSchema } from "../middleware/candidate.zod.middleware.js";
import { checkFileType, upload } from "../middleware/file.upload.middleware.js";
import { validatePaginationQueries } from "../middleware/pagination-queries.validation.js";
const candidateRoutes = express.Router();
candidateRoutes.get(routes.candidate.base, verifyToken, (req, res) => {
    const { page, pageSize } = req.query;
    if (page || pageSize) {
        validatePaginationQueries(req, res, () => {
            candidateController.listPaginated(req, res);
        });
    }
});
candidateRoutes.post(routes.vacancy.candidate.base, verifyToken, upload.single("cv"), checkFileType, validateCandidateSchema, validateCandidateData, candidateController.create);
candidateRoutes.get(routes.candidate.search, verifyToken, candidateController.listByEmail);
candidateRoutes.get(routes.candidate.single, verifyToken, candidateController.findById);
export default candidateRoutes;
//# sourceMappingURL=candidate.route.js.map