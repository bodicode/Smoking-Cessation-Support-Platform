'use client';

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { useTranslations } from "next-intl";

const contactSchema = z.object({
    name: z.string().min(2, "validation.name"),
    email: z.string().email("validation.email"),
    subject: z.string().min(2, "validation.subject"),
    message: z.string().min(10, "validation.message"),
});

export default function ContactUs() {
    const t = useTranslations('contact');

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
            setError(t(result.error.issues[0].message));
            return;
        }
        setSuccess(t('success'));
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-10">
            <div className="w-full max-w-4xl bg-white rounded-2xl px-8 py-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#60C3A4] mb-3">{t('title')}</h1>
                    <p className="text-gray-500 mb-8">{t('subtitle')}</p>
                    <div className="space-y-8 text-gray-700 text-base mb-8">
                        <div className="flex items-center gap-3">
                            <Mail className="text-[#60C3A4]" /> <span>reair@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="text-[#60C3A4]" /> <span>+84 123 456 789</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-[#60C3A4]" size={50} /> <span>{t('address')}</span>
                        </div>
                    </div>
                </div>
                <form className="flex-1 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">{t('form.name')}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t('form.namePlaceholder')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">{t('form.email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder={t('form.emailPlaceholder')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">{t('form.subject')}</label>
                        <input
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder={t('form.subjectPlaceholder')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">{t('form.message')}</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder={t('form.messagePlaceholder')}
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 font-medium">{error}</div>}
                    {success && <div className="text-green-600 font-medium">{success}</div>}
                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-[#60C3A4] hover:bg-[#2eac84] text-white font-semibold py-2 rounded-lg transition"
                    >
                        {t('form.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}
