import { z } from "zod";
import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import { REGEX } from "../libs/utils/constants.js";
const statusSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, {
        message: "Status name must be aleast 2 characters long",
    })
        .max(20, {
        message: "Status name must be at most 20 characters long",
    })
        .transform((value) => value.trim()),
    color: z.string().min(1, "Color cannot be empty").regex(REGEX.COLOR_REGEX, {
        message: "Invalid hex color code",
    }),
});
export function validateStatusSchema(req, res, next) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Please fill up the required fields",
            });
        }
        if (req.method === "POST") {
            statusSchema.parse(req.body);
        }
        else if (req.method === "PATCH") {
            statusSchema.partial().parse(req.body);
        }
        else {
            throw new Error("Unsupported HTTP method");
        }
        next();
    }
    catch (error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: error.errors?.[0]?.message ?? "Invalid data",
        });
    }
}
//# sourceMappingURL=status.middleware.js.map