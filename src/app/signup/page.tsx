"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { SignupForm, signupSchema } from "@/validations/signupSchema";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { parseSignupError } from "@/utils/parseGraphqlError";
import Loading from "@/components/common/Loading";
import { useRouter } from "next/navigation";
import { useSignup } from "@/graphql/hooks/useSignup";
import { signupHandler } from "@/services/signupService";
import toast from "react-hot-toast";

export default function SignupPage() {
    const [signup, { loading, error }] = useSignup()
    const [successMsg, setSuccessMsg] = useState("");
    const [fieldError, setFieldError] = useState("");
    const router = useRouter()

    const schema = signupSchema();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: SignupForm) => {
        try {
            const msg = await signupHandler({
                data,
                signup,
                router,
                error: (msg: string) => msg,
                parseSignupError,
            });
            toast.success("Đăng ký thành công");
        } catch (err: any) {
            toast.error(err?.message || "Đăng ký thất bại");
        }
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
                        Đăng ký
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="text-sm text-gray-600 mb-6"
                    >
                        Đăng ký để trải nghiệm tất cả các tính năng của chúng tôi
                    </motion.p>

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên</label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Nhập tên của bạn"
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
                            <label className="block text-sm font-medium mb-1">Tên người dùng</label>
                            <input
                                {...register("username")}
                                type="text"
                                placeholder="Nhập tên người dùng"
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
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Nhập email của bạn"
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
                            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Nhập mật khẩu"
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
                            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Nhập lại mật khẩu"
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
                            {loading ? <Loading color="#FFF" /> : "Đăng ký"}
                        </motion.button>
                    </motion.form>

                    <div className="text-sm text-center mt-6">
                        Bạn đã có tài khoản?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Đăng nhập
                        </Link>
                    </div>

                    <div className="text-sm text-center mt-6">
                        <Link href="/" className="text-blue-600 hover:underline">
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
