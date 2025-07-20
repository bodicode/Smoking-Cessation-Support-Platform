import { SignupForm } from "@/validations/signupSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function signupHandler({
    data,
    signup,
    router,
    error,
    parseSignupError,
}: {
    data: SignupForm,
    signup: (options: { variables: { signupInput: SignupForm } }) => Promise<any>,
    router: AppRouterInstance,
    error: (msg: string) => string,
    parseSignupError: (msg: string) => string,
}) {
    try {
        const res = await signup({
            variables: {
                signupInput: {
                    email: data.email,
                    username: data.username,
                    name: data.name,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                }
            }
        });
        if (res?.data?.signup?.message) {
            setTimeout(() => {
                router.push("/login");
            }, 1200);
            return res.data.signup.message; // trả message thành công
        }
        throw new Error("Đăng ký thất bại!");
    } catch (err: any) {
        const gqlErr = err?.graphQLErrors?.[0];
        const originalError = gqlErr?.extensions?.originalError;
        let rawMessage = "";
        if (originalError?.message && Array.isArray(originalError.message)) {
            rawMessage = originalError.message.map((m: any) => m.message).join(", ");
        } else if (gqlErr?.message) {
            rawMessage = gqlErr.message;
        }
        throw new Error(error(parseSignupError(rawMessage)));
    }
}

