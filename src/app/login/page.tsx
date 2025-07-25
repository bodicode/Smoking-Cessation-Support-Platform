"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { LoginForm, loginSchema } from "@/validations/loginSchema";
import { useParams, useRouter } from "next/navigation";
import { useLogin } from "@/graphql/hooks/useLogin";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "@/components/common/Loading";
import { motion } from "framer-motion";
import { loginHandler } from "@/services/loginService";
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";

export default function LoginPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'vi';
    const router = useRouter();
    const dispatch = useDispatch();

    const [login, { loading, error }] = useLogin();
    const [customError, setCustomError] = useState<string | null>(null);

    const schema = loginSchema();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            await loginHandler({
                data,
                login,
                dispatch,
                router,
                setCustomError,
            });
            toast.custom(<SuccessToast message="Đăng nhập thành công!" />);
        } catch (err: any) {
            toast.custom(<ErrorToast message={err?.message} />);
        }
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
                        Đăng nhập
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-sm text-gray-600 mb-6"
                    >
                        Đăng nhập để tiếp tục
                    </motion.p>

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
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
                            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Nhập mật khẩu..."
                                className={`w-full border border-gray-300 px-4 py-2 rounded ${errors.password ? "border-red-500" : ""}`}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="text-right text-sm text-blue-600 hover:underline">
                            <Link href="/forgot-password">Quên mật khẩu?</Link>
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
                                "Đăng nhập"
                            )}
                        </motion.button>
                    </motion.form>

                    <div className="text-sm text-center mt-6">
                        Bạn chưa có tài khoản?{" "}
                        <Link href={`/signup`} className="text-blue-600 hover:underline">
                            Đăng ký
                        </Link>
                    </div>

                    <div className="text-sm text-center mt-6">
                        <button
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => window.location.href = "/"}
                        >
                            Quay lại trang chủ
                        </button>
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
