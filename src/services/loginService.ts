import { jwtDecode } from "jwt-decode";
import { LoginForm } from "@/validations/loginSchema";
import { setUser } from "@/store/userSlice";
import { parseLoginError } from "@/utils/parseGraphqlError";
import { Dispatch } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function loginHandler({
  data,
  login,
  dispatch,
  router,
  setCustomError,
}: {
  data: LoginForm;
  login: (options: {
    variables: { loginInput: { email: string; password: string } };
  }) => Promise<any>;
  dispatch: Dispatch;
  router: AppRouterInstance;
  setCustomError: (msg: string | null) => void;
}) {
  setCustomError(null);
  try {
    const response = await login({
      variables: {
        loginInput: {
          email: data.email,
          password: data.password,
        },
      },
    });

    const accessToken = response.data?.login?.data?.session?.access_token;
    if (!accessToken) throw new Error("Không nhận được token!");

    const decoded: any = jwtDecode(accessToken);

    const userData = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.user_metadata?.name,
      role: decoded.user_metadata?.role || decoded.role || "",
      accessToken,
    };

    dispatch(setUser(userData));
    localStorage.setItem("access_token", accessToken);

    if (userData.role === 'ADMIN') {
      router.push("/admin");
    } else if (userData.role === 'COACH') {
      router.push("/coach");
    } else {
      router.push("/");
    }
  } catch (err: any) {
    const msg = parseLoginError(err);
    setCustomError(msg);
    throw new Error(msg);
  }
}
