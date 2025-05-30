"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { LoginForm, loginSchema } from "@/schemas/loginSchema";
import { useParams, useRouter } from "next/navigation";
import { useLogin } from "@/graphql/hooks/useLogin";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/store/userSlice";
import Loading from "@/components/Loading";
import { parseGraphqlError } from "@/utils/parseGraphqlError";

export default function LoginPage() {
    const t = useTranslations("login");
    const params = useParams();
    const locale = (params.locale as string) || 'vi';
    const router = useRouter();
    const dispatch = useDispatch();

    const [login, { loading, error }] = useLogin();
    const [customError, setCustomError] = useState<string | null>(null);

    const schema = loginSchema(t);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginForm) => {
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
            if (!accessToken) {
                setCustomError("Không nhận được token!");
                return;
            }

            const decoded: any = jwtDecode(accessToken);
            const userData = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.user_metadata?.role || decoded.role || "",
                accessToken,
            };

            dispatch(setUser(userData));
            localStorage.setItem("access_token", accessToken);
            router.push('/');
        } catch (err: any) {
            setCustomError(parseGraphqlError(err));
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fefcf6]">
            <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-24">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2">{t("title")}</h2>
                    <p className="text-sm text-gray-600 mb-6">{t("description")}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{t("emailLabel")}</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="email@gmail.com"
                                className={`w-full border border-gray-300 px-4 py-2 rounded ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("passwordLabel")}</label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder={t("passwordPlaceholder")}
                                className={`w-full border border-gray-300 px-4 py-2 rounded ${errors.password ? "border-red-500" : ""}`}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="text-right text-sm text-blue-600 hover:underline">
                            <Link href="/forgot-password">{t("forgotPassword")}</Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-bold py-2 rounded cursor-pointer transition-all duration-150 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loading size={20} color="white" />
                                </span>
                            ) : (
                                t("signIn")
                            )}
                        </button>

                        {(customError || error) && (
                            <div className="text-red-600 text-sm mt-2">{customError || error?.message}</div>
                        )}
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">{t("or")}</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                        <FaGoogle />
                        {t("signInWithGoogle")}
                    </button>

                    <div className="text-sm text-center mt-6">
                        {t("noAccount")}{" "}
                        <Link href={`/${locale}/signup`} className="text-blue-600 hover:underline">
                            {t("signUp")}
                        </Link>
                    </div>

                    <div className="text-sm text-center mt-6">
                        <Link href="/" className="text-blue-600 hover:underline">
                            {t("back")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block my-auto">
                <Image
                    src="/images/login.jpg"
                    alt="Login"
                    width={600}
                    height={600}
                    className="w-full h-[100vh] object-cover rounded-l-3xl"
                />
            </div>
        </div>
    );
}
