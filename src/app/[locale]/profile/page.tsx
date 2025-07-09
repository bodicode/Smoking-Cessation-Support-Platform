"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MyBadge } from "@/types/api/badge";
import { getMyAwardedBadges } from "@/services/badgesService";
import MembershipInfo from "@/components/profile/MembershipInfo";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ProfilePage() {
    const t = useTranslations("profile");
    const params = useParams();
    const locale = (params.locale as string) || "vi";
    const { user: authUser } = useAuth();

    // Get user profile from API
    const { userProfile, loading: profileLoading, error: profileError, refetch } = useUserProfile();

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
    const [nameInput, setNameInput] = useState("");
    const [avatarInput, setAvatarInput] = useState<string | null>(null);
    const [passwordInputs, setPasswordInputs] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Update form when profile loads
    useEffect(() => {
        if (userProfile) {
            setNameInput(userProfile.name || "");
        }
    }, [userProfile]);

    // Calculate days smoke free (mock calculation - you may need to adjust based on your data structure)
    const calculateDaysSmokeFree = () => {
        if (!userProfile?.member_profile?.recorded_at) return 0;
        const recordedDate = new Date(userProfile.member_profile.recorded_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - recordedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Handlers
    const handleSaveProfile = () => {
        // TODO: Implement API call to update profile
        if (userProfile) {
            // Update local state for now
            setModal(null);
            refetch(); // Refetch profile data
        }
    };

    const handleSavePassword = () => {
        // TODO: Implement API call to change password
        setPasswordInputs({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setModal(null);
    };

    // Avatar upload
    const handleAvatarUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => setAvatarInput(event.target?.result as string);
        reader.readAsDataURL(file);
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Profile</h2>
                    <p className="text-gray-600 mb-4">{profileError}</p>
                    <button
                        onClick={refetch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-600">Profile Not Found</h2>
                </div>
            </div>
        );
    }

    const daysSmokeFree = calculateDaysSmokeFree();
    const joinDate = new Date(userProfile.created_at).toLocaleDateString(locale);
    const lastDaySmoked = userProfile.member_profile?.recorded_at 
        ? new Date(userProfile.member_profile.recorded_at).toLocaleDateString(locale)
        : "N/A";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#fefcf6] to-[#fff7f1] relative pb-20">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                background: 'url("/bg-pattern.svg") repeat'
            }} />
            <div className="max-w-4xl mx-auto px-4 py-14">
                {/* Section Header */}
                <div className="mb-12 flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-[#03256c] mb-2 drop-shadow-sm">{t("title")}</h1>
                    <p className="text-gray-500">Cập nhật hành trình bỏ thuốc của bạn</p>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-7 relative border border-gray-100">
                    {/* Avatar */}
                    <div className="relative group">
                        <Image
                            src={avatarInput || userProfile.avatar_url || "https://i.pravatar.cc/300?img=1"}
                            width={144}
                            height={144}
                            alt="Avatar"
                            className="rounded-full border-4 border-[#b8ede3] shadow-xl object-cover w-36 h-36 transition-all duration-300 group-hover:scale-105"
                        />
                        <button
                            title={t("changeAvatar")}
                            className="cursor-pointer absolute bottom-2 right-2 bg-[#60c3a4] text-white rounded-full p-2 border-2 border-white opacity-90 hover:opacity-100 shadow-md hover:scale-110 transition"
                            onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
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
                        <h2 className="text-3xl font-bold text-[#03256c] mb-2">{userProfile.name}</h2>
                        <div className="text-gray-400 text-base mb-1">@{userProfile.user_name}</div>
                        <div className="text-gray-500">{authUser?.email}</div>
                        <div className="text-xs text-gray-400 mt-2">{t("memberSince")}: {joinDate}</div>
                        <div className="text-xs text-green-600 mt-1 font-medium">
                            {t("role")}: {userProfile.role}
                        </div>
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
                        <span className="text-5xl font-black text-[#03256c] mb-1 animate-fadeIn">{daysSmokeFree}</span>
                        <span className="text-[#03256c]">{t("days")}</span>
                    </div>
                    <div className="bg-gradient-to-tr from-[#ffe9b8] to-[#fffbea] rounded-2xl p-8 shadow-md flex flex-col items-center gap-2 relative overflow-hidden">
                        <span className="absolute right-4 top-4 text-[#e6b34c] opacity-10 text-7xl font-black select-none">📅</span>
                        <span className="text-sm text-[#e6b34c] font-semibold mb-1">{t("lastDaySmoked")}</span>
                        <span className="text-2xl font-bold text-[#e8a400] mb-2">{lastDaySmoked}</span>
                    </div>
                    <div className="md:col-span-1">
                        <MembershipInfo />
                    </div>
                </div>

                {/* MEMBER PROFILE INFO (if available) */}
                {userProfile.member_profile && (
                    <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
                        <h3 className="text-2xl font-bold text-[#03256c] mb-6">Member Profile Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <span className="text-3xl font-bold text-blue-600">{userProfile.member_profile.cigarettes_per_day}</span>
                                <p className="text-blue-800 font-medium">Cigarettes per Day</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <span className="text-3xl font-bold text-green-600">{userProfile.member_profile.sessions_per_day}</span>
                                <p className="text-green-800 font-medium">Sessions per Day</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                <span className="text-3xl font-bold text-yellow-600">{userProfile.member_profile.price_per_pack.toLocaleString()}₫</span>
                                <p className="text-yellow-800 font-medium">Price per Pack</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* COACH PROFILE INFO (if available) */}
                {userProfile.coach_profile && (
                    <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
                        <h3 className="text-2xl font-bold text-[#03256c] mb-6">Coach Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <span className="text-3xl font-bold text-purple-600">{userProfile.coach_profile.experience_years}</span>
                                <p className="text-purple-800 font-medium">Years of Experience</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-semibold text-gray-800 mb-2">Bio</h4>
                                <p className="text-gray-600">{userProfile.coach_profile.bio}</p>
                            </div>
                        </div>
                    </div>
                )}

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
                            <Image src="/empty-badge.svg" alt="No badges" width={10} height={10} className="w-36 opacity-60" />
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
                        <h3 className="text-xl font-bold text-[#03256c] mb-2">{t("edit")}</h3>
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
