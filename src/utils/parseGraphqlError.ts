export function parseLoginError(err: any): string {
    if (!err) return "Đã xảy ra lỗi!";
    if (err?.graphQLErrors?.[0]?.message?.includes("Cannot read properties of null")) {
        return "Email hoặc mật khẩu không đúng!";
    }
    if (err?.graphQLErrors?.[0]?.message) {
        return err.graphQLErrors[0].message;
    }
    return "Đăng nhập thất bại!";
}

export function parseSignupError(message: string) {
    if (!message) return "generic";
    if (message.includes("Password and confirm password must match"))
        return "passwordMismatch";
    if (message.includes("email already exists"))
        return "emailTaken";
    if (message.includes("username already exists"))
        return "usernameTaken";
    return "generic";
}
