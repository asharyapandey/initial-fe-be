import { HTTP_STATUS_CODES } from "../libs/responses/status-codes.js";
import { generateToken } from "../libs/utils/auth.js";
import { authenticateAdmin } from "../services/admin.service.js";
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await authenticateAdmin(username, password);
        const token = generateToken(admin.id);
        res.status(HTTP_STATUS_CODES.OK).json({
            status: "success",
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        if (error.message === "Admin not found" ||
            error.message === "Invalid credentials") {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                status: "error",
                message: "invalid credentials",
            });
        }
        else {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: "internal server error",
            });
        }
    }
};
//# sourceMappingURL=admin.controller.js.map