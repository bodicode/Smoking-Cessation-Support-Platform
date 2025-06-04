import { SignupForm } from "@/schemas/signupSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function signupHandler({
    data,
    signup,
    setSuccessMsg,
    setFieldError,
    router,
    tError,
    parseSignupError,
}: {
    data: SignupForm,
    signup: (options: { variables: { signupInput: SignupForm } }) => Promise<any>,
    setSuccessMsg: (msg: string) => void,
    setFieldError: (msg: string) => void,
    router: AppRouterInstance,
    tError: (msg: string) => string,
    parseSignupError: (msg: string) => string,
}) {
    setSuccessMsg("");
    setFieldError("");
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
            setSuccessMsg(res.data.signup.message);
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        }
    } catch (err: any) {
        const gqlErr = err?.graphQLErrors?.[0];
        const originalError = gqlErr?.extensions?.originalError;
        let rawMessage = "";
        if (originalError?.message && Array.isArray(originalError.message)) {
            rawMessage = originalError.message.map((m: any) => m.message).join(", ");
        } else if (gqlErr?.message) {
            rawMessage = gqlErr.message;
        }
        setFieldError(tError(parseSignupError(rawMessage)));
    }
}
