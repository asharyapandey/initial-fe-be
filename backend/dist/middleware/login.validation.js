import { HTTP_STATUS_CODES } from "../libs/responses/status-codes.js";
import { loginSchema } from "../libs/schemas/auth-schema.js";
export const validateLogin = (req, res, next) => {
    try {
        const { error } = loginSchema.safeParse(req.body);
        if (error) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                status: "error",
                message: "Please provide a correct username and password",
                errors: error.errors,
            });
        }
        next();
    }
    catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};
//# sourceMappingURL=login.validation.js.map