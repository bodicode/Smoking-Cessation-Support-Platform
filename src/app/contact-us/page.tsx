'use client';

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";

const contactSchema = z.object({
    name: z.string().min(2, "validation.name"),
    email: z.string().email("validation.email"),
    subject: z.string().min(2, "validation.subject"),
    message: z.string().min(10, "validation.message"),
});

export default function ContactUs() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const result = contactSchema.safeParse(form);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }
        setSuccess('Gửi thành công');
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    const container = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.5,
                type: "spring",
            }
        })
    };

    return (
        <div className="w-full">
            <div className="mt-10 flex justify-center">
                <Breadcrumbs
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Liên hệ chúng tôi", active: true }
                    ]}
                />
            </div>
            <div className="flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-4xl bg-white rounded-2xl px-8 py-12 flex flex-col md:flex-row gap-8 shadow-xl"
                >

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="flex-1"
                    >
                        <h1 className="text-3xl font-bold text-[#60C3A4] mb-3">Liên hệ chúng tôi</h1>
                        <p className="text-gray-500 mb-8">Liên hệ chúng tôi để nhận được sự hỗ trợ tốt nhất</p>
                        <div className="space-y-8 text-gray-700 text-base mb-8">
                            <div className="flex items-center gap-3">
                                <Mail className="text-[#60C3A4]" /> <span>reair@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-[#60C3A4]" /> <span>+84 123 456 789</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-[#60C3A4]" size={50} /> <span>123 Đường ABC, Quận XYZ, TP. HCM</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form
                        className="flex-1 space-y-5"
                        onSubmit={handleSubmit}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        <motion.div variants={container} custom={2.1}>
                            <label className="block text-gray-700 mb-1 font-medium">Tên</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nhập tên..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                required
                            />
                        </motion.div>
                        <motion.div variants={container} custom={2.2}>
                            <label className="block text-gray-700 mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Nhập email..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                required
                            />
                        </motion.div>
                        <motion.div variants={container} custom={2.3}>
                            <label className="block text-gray-700 mb-1 font-medium">Tiêu đề</label>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Nhập tiêu đề..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                required
                            />
                        </motion.div>
                        <motion.div variants={container} custom={2.4}>
                            <label className="block text-gray-700 mb-1 font-medium">Nội dung</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Nhập nội dung..."
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                required
                            />
                        </motion.div>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ x: -40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -40, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                                    className="text-red-500 font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="text-green-600 font-medium"
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.03 }}
                            className="cursor-pointer w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-semibold py-2 rounded-lg transition"
                        >
                            Gửi
                        </motion.button>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
}
