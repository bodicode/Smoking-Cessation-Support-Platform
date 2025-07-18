'use client';

import { useState, FormEvent } from "react";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

enum Step {
    Email,
    VerifyCode,
    NewPassword,
    Success
}


export default function ForgotPassword() {
    const [step, setStep] = useState<Step>(Step.Email);
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);

    const emailSchema = z.object({
        email: z.string().email()
    });

    const codeSchema = z.object({
        code: z.string().length(6, { message: "codeInvalid" }).regex(/^\d+$/, { message: "codeInvalid" })
    });

    const passwordSchema = z.object({
        password: z.string().min(6, { message: "passwordLength" }),
        confirmPassword: z.string()
    }).refine(data => data.password === data.confirmPassword, {
        message: "passwordMismatch",
        path: ["confirmPassword"]
    });

    const handleSendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = emailSchema.safeParse({ email });
        if (!result.success) {
            setMessage("Email không hợp lệ");
            return;
        }
        setStep(Step.VerifyCode);
        setMessage(null);
    };

    const handleVerifyCode = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = codeSchema.safeParse({ code });
        if (!result.success) {
            setMessage(result.error.issues[0].message);
            return;
        }
        setStep(Step.NewPassword);
        setMessage(null);
    };

    const handleSetPassword = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = passwordSchema.safeParse({ password, confirmPassword });
        if (!result.success) {
            setMessage(result.error.issues[0].message);
            return;
        }
        setStep(Step.Success);
        setMessage(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa]">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center">
                {step === Step.Email && (
                    <>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-200 mb-5">
                            <Lock size={36} className="text-[#60C3A4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#60C3A4] text-center mb-2">Quên mật khẩu</h2>
                        <p className="text-[#60C3A4] text-center mb-8">Nhập email để lấy mã xác thực</p>
                        <form className="w-full" onSubmit={handleSendEmail}>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Nhập email..."
                                className="w-full mb-5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            {message && <div className="text-red-500 mb-3">{message}</div>}
                            <button
                                type="submit"
                                className="w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-semibold py-2 rounded-lg mb-6 transition cursor-pointer"
                            >
                                Xác nhận
                            </button>
                        </form>
                        <div className="w-full flex items-center">
                            <Link
                                href="/login"
                                className="flex items-center text-[#60C3A4] hover:underline text-sm cursor-pointer"
                            >
                                <svg className="mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </>
                )}

                {step === Step.VerifyCode && (
                    <>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-200 mb-5">
                            <ShieldCheck size={36} className="text-[#60C3A4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#60C3A4] text-center mb-2">Quên mật khẩu</h2>
                        <p className="text-[#60C3A4] text-center mb-8">Nhập mã xác thực đã gửi đến email</p>
                        <form className="w-full" onSubmit={handleVerifyCode}>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="code">
                                Mã xác thực
                            </label>
                            <input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                pattern="\d{6}"
                                placeholder="Nhập mã xác thực..."
                                className="w-full mb-5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                value={code}
                                onChange={e => setCode(e.target.value.replace(/\D/, ""))}
                                maxLength={6}
                                required
                            />
                            {message && <div className="text-red-500 mb-3">{message}</div>}
                            <button
                                type="submit"
                                className="w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-semibold py-2 rounded-lg mb-6 transition cursor-pointer"
                            >
                                Xác nhận
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => setStep(Step.Email)}
                            className="text-[#60C3A4] hover:underline text-sm cursor-pointer"
                        >
                            &larr; Thay đổi email
                        </button>
                    </>
                )}

                {step === Step.NewPassword && (
                    <>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-200 mb-5">
                            <KeyRound size={36} className="text-[#60C3A4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#60C3A4] text-center mb-2">Quên mật khẩu</h2>
                        <p className="text-[#60C3A4] text-center mb-8">Nhập mật khẩu mới</p>
                        <form className="w-full" onSubmit={handleSetPassword}>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Nhập mật khẩu..."
                                className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Nhập lại mật khẩu..."
                                className="w-full mb-5 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            {message && <div className="text-red-500 mb-3">{message}</div>}
                            <button
                                type="submit"
                                className="w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-semibold py-2 rounded-lg mb-6 transition  cursor-pointer"
                            >
                                Thay đổi mật khẩu
                            </button>
                        </form>
                    </>
                )}

                {step === Step.Success && (
                    <>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
                            <ShieldCheck size={36} className="text-[#60C3A4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#60C3A4] text-center mb-2">Thành công</h2>
                        <p className="text-[#60C3A4] text-center mb-6">Mật khẩu đã được thay đổi thành công</p>
                        <Link
                            href="/login"
                            className=" cursor-pointer w-full flex justify-center bg-[#60C3A4] hover:bg-[#2eac84] text-white font-semibold py-2 rounded-lg transition"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
