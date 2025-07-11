import z from "zod";

const envSchema = z.object({
  BACKEND_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse({
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
});

if (!parsedEnv.success) {
  console.error(parsedEnv.error.issues);
  throw new Error("There is an error with the environment variables");
}

export const ENV = parsedEnv.data;
