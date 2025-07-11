import express from "express";
import { statusController } from "../controllers/status.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validatePaginationQueries } from "../middleware/pagination-queries.validation.js";
import { validateStatusSchema } from "../middleware/status.middleware.js";
const statusRoutes = express.Router();
statusRoutes.get(routes.status.base, verifyToken, (req, res) => {
    const { page, pageSize } = req.query;
    if (page || pageSize) {
        validatePaginationQueries(req, res, () => {
            statusController.listPaginated(req, res);
        });
    }
    else {
        statusController.list(req, res);
    }
});
statusRoutes.patch(routes.status.toggleStatus, verifyToken, statusController.toggleDisableEnable);
statusRoutes.post(routes.status.base, verifyToken, validateStatusSchema, statusController.create);
statusRoutes.patch(routes.status.single, verifyToken, validateStatusSchema, statusController.update);
export default statusRoutes;
//# sourceMappingURL=status.route.js.map