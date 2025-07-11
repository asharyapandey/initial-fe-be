import { z } from "zod";
export const vacancyCandidateStatusSchema = z.object({
    statusId: z.number({
        required_error: "statusId is required",
        message: "statusId can only be number",
    }),
});
export const vacancyCandidateRemarksSchema = z.object({
    remarks: z
        .string({ required_error: "remarks is required" })
        .trim()
        .min(1, { message: "remarks cannot be empty" })
        .transform((value) => value.trim()),
});
//# sourceMappingURL=vacancy-candidate-status-schema.js.map