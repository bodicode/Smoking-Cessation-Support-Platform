import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
    z.object({
        email: z.string().email({ message: t("schema.email") }),
        password: z.string().min(6, { message: t("schema.password") }),
    });

export type LoginForm = z.infer<ReturnType<typeof loginSchema>>;
