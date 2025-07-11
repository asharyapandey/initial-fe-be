import { z } from "zod";
import { HTTP_STATUS_CODES } from "../libs/http-status.js";
import { REGEX } from "../libs/utils/constants.js";
const designationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, {
        message: "Designation must contain atleast 2 character(s)",
    })
        .max(50, {
        message: "Characters cannot exceed 50 characters",
    })
        .transform((value) => value.trim()),
    code: z
        .string()
        .trim()
        .min(2, {
        message: "Code cannot be less than 2 character(s)",
    })
        .max(10, {
        message: "Cannot be more than 10 characters",
    })
        .transform((value) => value.trim()),
    color: z.string().min(1, "Color cannot be empty").regex(REGEX.COLOR_REGEX, {
        message: "Invalid hex color code",
    }),
});
export function validateDesignationSchema(req, res, next) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Please fill up the required fields",
            });
        }
        if (req.method === "POST") {
            designationSchema.parse(req.body);
        }
        else if (req.method === "PATCH") {
            designationSchema.partial().parse(req.body);
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
//# sourceMappingURL=designation.middleware.js.map