import { z } from "zod";
import { HTTP_STATUS_CODES } from "../libs/http-status.js";
const shortlistSchema = z.object({
    name: z
        .string({ required_error: "name is required" })
        .max(20, {
        message: "Name must be at most 20 characters long",
    })
        .refine((value) => value.trim().length > 0, {
        message: "Name must not be empty or only spaces",
    })
        .transform((value) => value.trim()),
});
export function validateShortlistSchema(req, res, next) {
    try {
        // For creation, require all fields
        if (req.method === "POST") {
            shortlistSchema.parse(req.body);
        }
        else if (req.method === "PATCH") {
            // For editing, allow optional fields
            shortlistSchema.partial().parse(req.body);
        }
        else if (req.method === "DELETE") {
            return next();
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
//# sourceMappingURL=shortlist.middleware.js.map