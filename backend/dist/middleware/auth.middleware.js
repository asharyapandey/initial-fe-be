import jwt from "jsonwebtoken";
import env from "../libs/env.js";
import logger from "../libs/logger.js";
import { HTTP_STATUS_CODES } from "../libs/responses/status-codes.js";
export function verifyToken(req, res, next) {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res
                .status(HTTP_STATUS_CODES.UNAUTHORIZED)
                .json({ message: "Unauthorized" });
        }
        jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res
                    .status(HTTP_STATUS_CODES.UNAUTHORIZED)
                    .json({ message: "unauthorized" });
            }
            req.user = decoded;
            next();
        });
    }
    catch (err) {
        logger.error({
            message: `Failed to verify token: ${err.message}`,
        });
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map