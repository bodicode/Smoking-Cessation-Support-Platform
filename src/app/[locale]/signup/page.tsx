"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { SignupForm, signupSchema } from "@/schemas/signupSchema";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { parseSignupError } from "@/utils/parseGraphqlError";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useSignup } from "@/graphql/hooks/useSignup";
import { signupHandler } from "@/services/signupService";

export default function SignupPage() {
    const t = useTranslations('signup');
    const tError = useTranslations('signup.error');

    const [signup, { loading, error }] = useSignup()
    const [successMsg, setSuccessMsg] = useState("");
    const [fieldError, setFieldError] = useState("");
    const router = useRouter()

    const schema = signupSchema(t);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: SignupForm) => {
        await signupHandler({
            data,
            signup,
            setSuccessMsg,
            setFieldError,
            router,
            tError,
            parseSignupError,
        });
    };

    const fadeLeft = {
        hidden: { opacity: 0, x: -80 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f7f4ee]">
            <motion.div
                variants={fadeLeft}
                initial="hidden"
                animate="visible"
                className="hidden lg:block my-auto"
            >
                <Image
                    src="/images/signup.jpg"
                    alt="Signup"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover rounded-r-3xl"
                />
            </motion.div>

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
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="text-3xl font-bold mb-2"
                    >
                        {t("title")}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="text-sm text-gray-600 mb-6"
                    >
                        {t("description")}
                    </motion.p>

                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 text-sm mb-2"
                        >
                            {successMsg}
                        </motion.div>
                    )}
                    {(fieldError || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mb-2"
                        >
                            {fieldError || (error as any)?.message || t("error.generic")}
                        </motion.div>
                    )}

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">{t("nameLabel")}</label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder={t("namePlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                                disabled={loading}
                            />
                            <AnimatePresence>
                                {errors.name?.message && (
                                    <motion.p
                                        key="name-error"
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-red-600 mt-1"
                                    >
                                        {errors.name.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("usernameLabel")}</label>
                            <input
                                {...register("username")}
                                type="text"
                                placeholder={t("usernamePlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                                disabled={loading}
                            />
                            <AnimatePresence>
                                {errors.username?.message && (
                                    <motion.p
                                        key="username-error"
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-red-600 mt-1"
                                    >
                                        {errors.username.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("emailLabel")}</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder={t("emailPlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                                disabled={loading}
                            />
                            <AnimatePresence>
                                {errors.email?.message && (
                                    <motion.p
                                        key="email-error"
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-red-600 mt-1"
                                    >
                                        {errors.email.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("passwordLabel")}</label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder={t("passwordPlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                                disabled={loading}
                            />
                            <AnimatePresence>
                                {errors.password?.message && (
                                    <motion.p
                                        key="password-error"
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-red-600 mt-1"
                                    >
                                        {errors.password.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">{t("confirmPasswordLabel")}</label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder={t("confirmPasswordPlaceholder")}
                                className="w-full border border-gray-300 px-4 py-2 rounded"
                                disabled={loading}
                            />
                            <AnimatePresence>
                                {errors.confirmPassword?.message && (
                                    <motion.p
                                        key="confirmPassword-error"
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-sm text-red-600 mt-1"
                                    >
                                        {errors.confirmPassword.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02 }}
                            className="w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-bold py-2 rounded cursor-pointer transition duration-150"
                            disabled={loading}
                        >
                            {loading ? <Loading /> : t("signUp")}
                        </motion.button>
                    </motion.form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">{t("or")}</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="space-y-3"
                    >
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.03 }}
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 cursor-pointer transition duration-150"
                        >
                            <FaGoogle />
                            {t("signUpWithGoogle")}
                        </motion.button>
                    </motion.div>

                    <div className="text-sm text-center mt-6">
                        {t("haveAccount")}{" "}
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
            </motion.div>
        </div>
    );
}
