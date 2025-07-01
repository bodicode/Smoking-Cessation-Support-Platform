"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MyBadge } from "@/types/api/badge";
import { getMyAwardedBadges } from "@/services/badgesService";
import MembershipInfo from "@/components/profile/MembershipInfo";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ProfilePage() {
    const t = useTranslations("profile");
    const params = useParams();
    const locale = (params.locale as string) || "vi";

    // User info state (mock)
    const [user, setUser] = useState({
        name: "Nguyễn Văn A",
        username: "nguyenvana",
        email: "nguyen.van.a@gmail.com",
        joinDate: "01/03/2024",
        daysSmokeFree: 45,
        lastDaySmoked: "20/03/2024",
        avatarUrl: "https://i.pravatar.cc/300?img=1",
    });

    // Badge state
    const [badges, setBadges] = useState<MyBadge[]>([]);
    const [loadingBadges, setLoadingBadges] = useState(false);

    useEffect(() => {
        setLoadingBadges(true);
        getMyAwardedBadges({ page: 1, limit: 20 })
            .then((res) => setBadges(res.data))
            .finally(() => setLoadingBadges(false));
    }, []);

    // Modal state
    const [modal, setModal] = useState<"profile" | "password" | null>(null);
    const [nameInput, setNameInput] = useState(user.name);
    const [avatarInput, setAvatarInput] = useState<string | null>(null);
    const [passwordInputs, setPasswordInputs] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Handlers
    const handleSaveProfile = () => {
        setUser({
            ...user,
            name: nameInput,
            avatarUrl: avatarInput || user.avatarUrl,
        });
        setModal(null);
    };

    const handleSavePassword = () => {
        // Replace with API call
        setPasswordInputs({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setModal(null);
    };

    // Avatar upload
    const handleAvatarUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => setAvatarInput(event.target?.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#fefcf6] to-[#fff7f1] relative pb-20">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                background: 'url("/bg-pattern.svg") repeat'
            }} />
            <div className="max-w-4xl mx-auto px-4 py-14">
                {/* Section Header */}
                <div className="mb-12 flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-[#03256c] mb-2 drop-shadow-sm">Hồ sơ cá nhân</h1>
                    <p className="text-gray-500">Cập nhật hành trình bỏ thuốc của bạn</p>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-7 relative border border-gray-100">
                    {/* Avatar */}
                    <div className="relative group">
                        <Image
                            src={avatarInput || user.avatarUrl}
                            width={144}
                            height={144}
                            alt="Avatar"
                            className="rounded-full border-4 border-[#b8ede3] shadow-xl object-cover w-36 h-36 transition-all duration-300 group-hover:scale-105"
                        />
                        <button
                            title={"Đổi ảnh"}
                            className="cursor-pointer absolute bottom-2 right-2 bg-[#60c3a4] text-white rounded-full p-2 border-2 border-white opacity-90 hover:opacity-100 shadow-md hover:scale-110 transition"
                            onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files && handleAvatarUpload(e.target.files[0])}
                            />
                        </button>
                    </div>
                    {/* Info */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#03256c] mb-2">{user.name}</h2>
                        <div className="text-gray-400 text-base mb-1">@{user.username}</div>
                        <div className="text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400 mt-2">{t("memberSince")}: {user.joinDate}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-3">
                        <button
                            onClick={() => setModal("profile")}
                            className="cursor-pointer flex items-center gap-2 bg-[#60c3a4] hover:bg-[#4ca885] text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
                            </svg>
                            {t("edit")}
                        </button>
                        <button
                            onClick={() => setModal("password")}
                            className="cursor-pointer flex items-center gap-2 bg-white border border-[#03256c] text-[#03256c] hover:bg-[#f0f4ff] px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 17v.01" />
                                <rect x="6" y="7" width="12" height="13" rx="2" />
                                <path d="M12 11v-4a2 2 0 0 1 4 0" />
                            </svg>
                            {t("changePassword")}
                        </button>
                    </div>
                </div>

                {/* STATS AND MEMBERSHIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-gradient-to-tr from-[#b8ede3] to-[#e9faf6] rounded-2xl p-8 shadow-md flex flex-col items-center gap-2 relative overflow-hidden">
                        <span className="absolute right-4 top-4 text-[#60c3a4] opacity-10 text-7xl font-black select-none">⏳</span>
                        <span className="text-sm text-[#60c3a4] font-semibold mb-1">{t("daysSmokeFree")}</span>
                        <span className="text-5xl font-black text-[#03256c] mb-1 animate-fadeIn">{user.daysSmokeFree}</span>
                        <span className="text-[#03256c]">{t("days")}</span>
                    </div>
                    <div className="bg-gradient-to-tr from-[#ffe9b8] to-[#fffbea] rounded-2xl p-8 shadow-md flex flex-col items-center gap-2 relative overflow-hidden">
                        <span className="absolute right-4 top-4 text-[#e6b34c] opacity-10 text-7xl font-black select-none">📅</span>
                        <span className="text-sm text-[#e6b34c] font-semibold mb-1">{t("lastDaySmoked")}</span>
                        <span className="text-2xl font-bold text-[#e8a400] mb-2">{user.lastDaySmoked}</span>
                    </div>
                    <div className="md:col-span-1">
                        <MembershipInfo />
                    </div>
                </div>

                {/* BADGES */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-[#03256c] mb-8 tracking-tight flex items-center gap-2">
                        <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24"><path d="M12 17l-5 3 1.9-6.1-5-3.9 6.2-.5L12 2l2.9 7.5 6.2.5-5 3.9L17 20z" fill="currentColor" /></svg>
                        {t("badges")}
                    </h3>
                    {loadingBadges ? (
                        <div className="flex gap-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-yellow-100 w-24 h-24 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : badges.length === 0 ? (
                        <div className="flex flex-col items-center gap-3">
                            <Image src="/empty-badge.svg" alt="s" width={10} height={10} className="w-36 opacity-60" />
                            <p className="text-gray-500 mt-2">Bạn chưa có huy hiệu nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7">
                            {badges.map((awarded) => (
                                <div
                                    key={awarded.id}
                                    className="group bg-white border border-yellow-100 shadow-md rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer relative"
                                    title={awarded.badge.description}
                                >
                                    <img
                                        src={awarded.badge.icon_url}
                                        alt={awarded.badge.name}
                                        className="w-14 h-14 mb-3 object-cover rounded-full border-2 border-yellow-200 shadow"
                                    />
                                    <span className="font-bold text-yellow-700 text-center">{awarded.badge.name}</span>
                                    <span className="text-xs text-yellow-700 opacity-60 mt-1 text-center line-clamp-2">{awarded.badge.description}</span>
                                    <span className="absolute top-2 right-3 text-[10px] text-gray-400">{new Date(awarded.awarded_at).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* EDIT MODALS */}
            {modal === "profile" && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm flex flex-col gap-5 relative">
                        <button
                            onClick={() => setModal(null)}
                            className="cursor-pointer absolute right-5 top-5 text-gray-400 hover:text-red-500 text-2xl font-bold"
                            aria-label="Close"
                        >×</button>
                        <h3 className="text-xl font-bold text-[#03256c] mb-2">Chỉnh sửa hồ sơ</h3>
                        <label className="text-gray-700">{t("name")}</label>
                        <input
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder={t("name")}
                        />
                        <button
                            className="cursor-pointer bg-[#60c3a4] text-white px-6 py-2 rounded-lg font-semibold mt-4 hover:bg-[#4ca885] transition"
                            onClick={handleSaveProfile}
                        >
                            {t("save")}
                        </button>
                    </div>
                </div>
            )}
            {modal === "password" && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm flex flex-col gap-5 relative">
                        <button
                            onClick={() => setModal(null)}
                            className="cursor-pointer absolute right-5 top-5 text-gray-400 hover:text-red-500 text-2xl font-bold"
                            aria-label="Close"
                        >×</button>
                        <h3 className="text-xl font-bold text-[#03256c] mb-2">{t("changePassword")}</h3>
                        <label className="text-gray-700">{t("currentPassword")}</label>
                        <input
                            type="password"
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={passwordInputs.currentPassword}
                            onChange={(e) => setPasswordInputs({ ...passwordInputs, currentPassword: e.target.value })}
                            placeholder="••••••"
                        />
                        <label className="text-gray-700">{t("newPassword")}</label>
                        <input
                            type="password"
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={passwordInputs.newPassword}
                            onChange={(e) => setPasswordInputs({ ...passwordInputs, newPassword: e.target.value })}
                            placeholder="••••••"
                        />
                        <label className="text-gray-700">{t("confirmPassword")}</label>
                        <input
                            type="password"
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={passwordInputs.confirmPassword}
                            onChange={(e) => setPasswordInputs({ ...passwordInputs, confirmPassword: e.target.value })}
                            placeholder="••••••"
                        />
                        <button
                            className="cursor-pointer bg-[#60c3a4] text-white px-6 py-2 rounded-lg font-semibold mt-4 hover:bg-[#4ca885] transition"
                            onClick={handleSavePassword}
                        >
                            {t("save")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
