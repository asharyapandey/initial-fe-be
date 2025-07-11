import { z } from "zod";
import { HTTP_STATUS_CODES } from "../libs/http-status.js";
const mediumSchema = z.object({
    name: z
        .string()
        .min(2, {
        message: "Medium name must be at least 2 characters long",
    })
        .max(30, {
        message: "Medium name must be at most 30 characters long",
    })
        .refine((value) => value.trim().length > 0, {
        message: "Medium name must not be empty or only spaces",
    })
        .transform((value) => value.trim()),
});
export function validateMediumSchema(req, res, next) {
    try {
        // For creation, require all fields
        if (req.method === "POST") {
            mediumSchema.parse(req.body);
        }
        else if (req.method === "PATCH") {
            // For editing, allow optional fields
            mediumSchema.partial().parse(req.body);
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
//# sourceMappingURL=medium.middleware.js.map