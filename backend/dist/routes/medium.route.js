import express from "express";
import { mediumController } from "../controllers/medium.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateMediumSchema } from "../middleware/medium.middleware.js";
import { validatePaginationQueries } from "../middleware/pagination-queries.validation.js";
const mediumRoutes = express.Router();
mediumRoutes.patch(routes.medium.toggleStatus, verifyToken, mediumController.toggleDisableEnable);
mediumRoutes.get(routes.medium.base, verifyToken, (req, res) => {
    const { page, pageSize } = req.query;
    if (page || pageSize) {
        validatePaginationQueries(req, res, () => {
            mediumController.listPaginated(req, res);
        });
    }
    else {
        mediumController.list(req, res);
    }
});
mediumRoutes.post(routes.medium.base, verifyToken, validateMediumSchema, mediumController.create);
mediumRoutes.patch(routes.medium.single, verifyToken, validateMediumSchema, mediumController.update);
export default mediumRoutes;
//# sourceMappingURL=medium.route.js.map