import { z } from "zod";
import { Gender } from "../types/index.js";
import { CONTACT_REGEX } from "../utils/constants.js";
export const candidateSchema = z.object({
    firstName: z
        .string({ required_error: "firstName is required" })
        .min(3, "The firstName must be atleast 3 characters long"),
    middleName: z.string().optional(),
    lastName: z
        .string({ required_error: "lastName is required" })
        .min(3, "The middleName must be atleast 3 characters long"),
    email: z
        .string({ required_error: "email is required" })
        .email({ message: "invalid email" }),
    phone: z
        .string({ required_error: "phone number is required" })
        .regex(CONTACT_REGEX, "Invalid phone numbers"),
    address: z.string().min(1, "address is required"),
    gender: z.nativeEnum(Gender, { message: "Gender is required" }),
    shortlistId: z.preprocess((val) => Number(val), z.number().positive({ message: "shortlistId can only be positive number" })),
    mediumId: z.preprocess((val) => Number(val), z.number().positive({ message: "mediumId can only be a positive number" })),
    recievedAt: z
        .string({ required_error: "recieved Date is required" })
        .date("Please enter vaild date"),
});
//# sourceMappingURL=candidate-schema.js.map