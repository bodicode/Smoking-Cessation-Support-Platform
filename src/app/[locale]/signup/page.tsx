"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { SignupForm, signupSchema } from "@/schemas/signupSchema";

export default function SignupPage() {
    const t = useTranslations("signup");

    const schema = signupSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: SignupForm) => {
        console.log("Đăng ký:", data);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f7f4ee]">
            <div className="hidden lg:block my-auto">
                <Image
                    src="/images/signup.jpg"
                    alt="Signup"
                    width={600}
                    height={600}
                    className="w-full h-[100vh] object-cover rounded-r-3xl"
                />
            </div>

            <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-24">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2">{t("title")}</h2>
                    <p className="text-sm text-gray-600 mb-6">{t("description")}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{t("nameLabel")}</label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder={t("namePlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                            />
                            {errors.name?.message && (
                                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("emailLabel")}</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder={t("emailPlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                            />
                            {errors.email?.message && (
                                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("passwordLabel")}</label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder={t("passwordPlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                            />
                            {errors.password?.message && (
                                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-bold py-2 rounded cursor-pointer transition duration-150"
                        >
                            {t("signUp")}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">{t("or")}</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 cursor-pointer transition duration-150">
                            <FaGoogle />
                            {t("signUpWithGoogle")}
                        </button>
                    </div>

                    <div className="text-sm text-center mt-6">
                        {t("haveAccount")} {" "}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            {t("signIn")}
                        </Link>
                    </div>

                    <div className="text-sm text-center mt-6">
                        <Link href="/" className="text-blue-600 hover:underline">
                            {t("back")}
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
