import express from "express";
import { shortlistController } from "../controllers/shortlist.controller.js";
import { routes } from "../libs/routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validateShortlistSchema } from "../middleware/shortlist.middleware.js";
const shortlistRoutes = express.Router();
shortlistRoutes.post(routes.vacancy.shortlist.base, verifyToken, validateShortlistSchema, shortlistController.create);
shortlistRoutes.patch(routes.vacancy.shortlist.single, verifyToken, validateShortlistSchema, shortlistController.update);
shortlistRoutes.delete(routes.vacancy.shortlist.single, verifyToken, validateShortlistSchema, shortlistController.remove);
export default shortlistRoutes;
//# sourceMappingURL=shortlist.route.js.map