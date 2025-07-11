import express from "express";
import { vacancyCandidateController } from "../controllers/vacancy-candidate.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validatePaginationQueries } from "../middleware/pagination-queries.validation.js";
const vacancyCandidateRoutes = express.Router();
vacancyCandidateRoutes.get(routes.vacancy.shortlist.candidates.shortlistCandidates, verifyToken, validatePaginationQueries, vacancyCandidateController.listCandidates);
vacancyCandidateRoutes.delete(routes.vacancy.shortlist.candidates.singleCandidate, verifyToken, vacancyCandidateController.removeCandidate);
export default vacancyCandidateRoutes;
//# sourceMappingURL=vacancy-candidate.route.js.map