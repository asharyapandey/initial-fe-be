import { z } from "zod";
export const vacancySchema = z.object({
    designationId: z
        .number({
        required_error: "designationId is required",
        message: "designationId can only be number",
    })
        .positive({
        message: "designationId can only be positive number",
    }),
    noOfOpenings: z
        .number({
        required_error: "numberOfOpenings is required",
        message: "numberOfOpenings can only be number",
    })
        .positive({
        message: "numberOfOpenings can only be positive number",
    })
        .int({ message: "numberOfOpenings must be an integer" }),
    openingDate: z
        .string({ required_error: "openingDate is required" })
        .date("invalid openingDate"),
    closingDate: z.string().date("invalid closingDate").optional(),
    mediums: z
        .array(z.object({
        mediumURL: z
            .string({ required_error: "mediumURL is required" })
            .url({ message: "invalid mediumURL" }),
        mediumId: z
            .number({
            required_error: "mediumId is required",
            message: "mediumId can only be number",
        })
            .positive({
            message: "mediumId can only be positive number",
        }),
    }))
        .refine((data) => {
        const mediumIds = data.map((item) => item.mediumId);
        const mediumUrls = data.map((item) => item.mediumURL);
        const areMediumIdsUnique = new Set(mediumIds).size === mediumIds.length;
        const areMediumUrlsUnique = new Set(mediumUrls).size === mediumUrls.length;
        return areMediumIdsUnique && areMediumUrlsUnique;
    }, {
        message: "mediumId and mediumURL must be unique",
    }),
    description: z
        .string({ required_error: "description is required" })
        .trim()
        .min(1, {
        message: "description cannot be empty",
    })
        .max(2000, {
        message: "description cannot be exceed 2000 characters",
    })
        .transform((value) => value.trim()),
});
//# sourceMappingURL=vacancy-schema.js.map