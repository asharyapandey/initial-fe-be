import express from "express";
import { vacancyController } from "../controllers/vacancy.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validatePaginationQueries } from "../middleware/pagination-queries.validation.js";
import { validateVacancySchema } from "../middleware/vacancy.middleware.js";
import { validateVacancyCandidateStatus } from "../middleware/vacancy-candidate.middleware.js";
const vacancyRoutes = express.Router();
vacancyRoutes.post(routes.vacancy.base, verifyToken, validateVacancySchema, vacancyController.create);
vacancyRoutes.get(routes.vacancy.base, verifyToken, validatePaginationQueries, vacancyController.listPaginated);
vacancyRoutes.patch(routes.vacancy.toggleStatus, verifyToken, vacancyController.toggleDisableEnable);
vacancyRoutes.get(routes.vacancy.single, verifyToken, vacancyController.details);
vacancyRoutes.patch(routes.vacancy.single, verifyToken, validateVacancySchema, vacancyController.update);
vacancyRoutes.patch(routes.vacancy.candidate.updateStatus, verifyToken, validateVacancyCandidateStatus, vacancyController.updateStatus);
export default vacancyRoutes;
//# sourceMappingURL=vacancy.route.js.map