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
import Loading from "@/components/common/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { loginHandler } from "@/services/loginService";

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
        await loginHandler({
            data,
            login,
            dispatch,
            router,
            setCustomError,
        });
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const fadeRight = {
        hidden: { opacity: 0, x: 80 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fefcf6]">
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col justify-center items-center px-6 py-12 lg:px-24"
            >
                <div className="w-full max-w-md">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-3xl font-bold mb-2"
                    >
                        {t("title")}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-sm text-gray-600 mb-6"
                    >
                        {t("description")}
                    </motion.p>

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                    >
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

                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02 }}
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
                        </motion.button>

                        <AnimatePresence>
                            {(customError || error) && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-red-600 text-sm mt-2"
                                >
                                    {customError || error?.message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">{t("or")}</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.03 }}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 cursor-pointer"
                    >
                        <FaGoogle />
                        {t("signInWithGoogle")}
                    </motion.button>

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
            </motion.div>

            <motion.div
                variants={fadeRight}
                initial="hidden"
                animate="visible"
                className="hidden lg:block my-auto"
            >
                <Image
                    src="/images/login.jpg"
                    alt="Login"
                    width={600}
                    height={600}
                    className="w-full h-[100vh] object-cover rounded-l-3xl"
                />
            </motion.div>
        </div>
    );
}
