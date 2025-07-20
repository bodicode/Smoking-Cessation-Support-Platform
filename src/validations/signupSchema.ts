import { z } from "zod";

export const signupSchema = () => z.object({
    name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    username: z.string().min(5, { message: "Tên người dùng phải có ít nhất 5 ký tự" }),
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type SignupForm = z.infer<ReturnType<typeof signupSchema>>;