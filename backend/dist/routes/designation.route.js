import express from "express";
import { designationController } from "../controllers/designation.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateDesignationSchema } from "../middleware/designation.middleware.js";
import { validatePaginationQueries } from "../middleware/pagination-queries.validation.js";
const designationRoutes = express.Router();
designationRoutes.get(routes.designation.base, verifyToken, (req, res) => {
    const { page, pageSize } = req.query;
    if (page || pageSize) {
        validatePaginationQueries(req, res, () => {
            designationController.listPaginated(req, res);
        });
    }
    else {
        designationController.list(req, res);
    }
});
designationRoutes.post(routes.designation.base, verifyToken, validateDesignationSchema, designationController.create);
designationRoutes.patch(routes.designation.single, verifyToken, validateDesignationSchema, designationController.update);
designationRoutes.patch(routes.designation.toggleStatus, verifyToken, designationController.toggleDisableEnable);
export default designationRoutes;
//# sourceMappingURL=designation.route.js.map