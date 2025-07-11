import express from "express";
import { login } from "../controllers/admin.controller.js";
import { routes } from "../libs/routes.js";
import { validateLogin } from "../middleware/login.validation.js";
const loginRoute = express.Router();
loginRoute.post(routes.login, validateLogin, login);
export { loginRoute };
//# sourceMappingURL=auth.route.js.map