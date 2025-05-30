export function parseGraphqlError(err: any): string {
    if (!err) return "Đã xảy ra lỗi!";
    if (err?.graphQLErrors?.[0]?.message?.includes("Cannot read properties of null")) {
        return "Email hoặc mật khẩu không đúng!";
    }
    if (err?.graphQLErrors?.[0]?.message) {
        return err.graphQLErrors[0].message;
    }
    return "Đăng nhập thất bại!";
}
