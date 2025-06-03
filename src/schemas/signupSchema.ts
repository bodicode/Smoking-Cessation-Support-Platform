import { z } from "zod";

export const signupSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(2, { message: t("schema.name") }),
    email: z.string().email({ message: t("schema.email") }),
    username: z.string().min(5, { message: t("schema.username") }),
    password: z.string().min(6, { message: t("schema.password") }),
    confirmPassword: z.string().min(6, { message: t("schema.confirmPassword") }),
});

export type SignupForm = z.infer<ReturnType<typeof signupSchema>>;