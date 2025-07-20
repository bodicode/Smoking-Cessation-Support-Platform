"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MyBadge } from "@/types/api/badge";
import { getMyAwardedBadges } from "@/services/badgesService";
import MembershipInfo from "@/components/profile/MembershipInfo";
import { getUserProfileNew } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ProfilePage() {
    const params = useParams();
    const locale = (params.locale as string) || "vi";
    const { user: authUser } = useAuth();

    const [userProfile, setUserProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);

    const [badges, setBadges] = useState<MyBadge[]>([]);
    const [loadingBadges, setLoadingBadges] = useState(false);

    useEffect(() => {
        setLoadingBadges(true);
        getMyAwardedBadges({ page: 1, limit: 20 })
            .then((res) => setBadges(res.data))
            .finally(() => setLoadingBadges(false));
    }, []);

    const [modal, setModal] = useState<"profile" | "password" | null>(null);
    const [nameInput, setNameInput] = useState("");
    const [avatarInput, setAvatarInput] = useState<string | null>(null);
    const [passwordInputs, setPasswordInputs] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const fetchUserProfile = async () => {
        setProfileLoading(true);
        setProfileError(null);
        try {
            const data = await getUserProfileNew();
            setUserProfile(data);
        } catch (err: any) {
            setProfileError(err.message || "Lỗi tải profile");
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (userProfile) {
            setNameInput(userProfile.name || "");
        }
    }, [userProfile]);

    const handleSaveProfile = () => {
        // TODO: Implement API call to update profile
        if (userProfile) {
            setModal(null);
            fetchUserProfile(); // Refetch profile data
        }
    };

    const handleSavePassword = () => {
        // TODO: Implement API call to change password
        setPasswordInputs({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setModal(null);
    };

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
                    <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải profile</h2>
                    <p className="text-gray-600 mb-4">{profileError}</p>
                    <button
                        onClick={fetchUserProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-600">Không tìm thấy profile</h2>
                </div>
            </div>
        );
    }

    const mp = userProfile.member_profile?.[0];

    const cardClass = "bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center min-h-[120px]";

    return (
        <div className="min-h-screen relative pb-20">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                background: 'url("/bg-pattern.svg") repeat'
            }} />
            <div className="max-w-7xl mx-auto px-4 py-14">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl px-8 py-10 flex flex-col items-center gap-7 relative border border-gray-100">
                    <div className="relative group">
                        <Image
                            src={avatarInput || userProfile.avatar_url || "/images/avatar.png"}
                            width={144}
                            height={144}
                            alt="Avatar"
                            className="rounded-full border-4 border-[#b8ede3] object-cover w-36 h-36 transition-all duration-300 group-hover:scale-105"
                        />
                        <button
                            title="Đổi ảnh đại diện"
                            className="cursor-pointer absolute bottom-2 right-2 bg-[#60c3a4] text-white rounded-full p-2 border-2 border-white opacity-90 hover:opacity-100 hover:scale-110 transition"
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
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#03256c] mb-2">{userProfile.name}</h2>
                        <div className="text-gray-400 text-base mb-1">@{userProfile.user_name}</div>
                        <div className="text-gray-500">{authUser?.email}</div>
                    </div>

                    <div className="flex gap-4 mt-3">
                        <button
                            onClick={() => setModal("profile")}
                            className="cursor-pointer flex items-center gap-2 bg-[#60c3a4] hover:bg-[#4ca885] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
                            </svg>
                            Chỉnh sửa
                        </button>
                        <button
                            onClick={() => setModal("password")}
                            className="cursor-pointer flex items-center gap-2 bg-white border border-[#03256c] text-[#03256c] hover:bg-[#f0f4ff] px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 17v.01" />
                                <rect x="6" y="7" width="12" height="13" rx="2" />
                                <path d="M12 11v-4a2 2 0 0 1 4 0" />
                            </svg>
                            Thay đổi mật khẩu
                        </button>
                    </div>
                </div>

                <div className="flex flex-col mt-12">
                    <MembershipInfo />
                </div>

                {userProfile.member_profile?.length > 0 && (
                    <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-3xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <span className="text-3xl font-bold text-blue-600">{mp?.cigarettes_per_day ?? '-'}</span>
                                <p className="text-blue-800 font-medium flex items-center justify-center gap-1">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
                                    Điếu/ngày
                                </p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <span className="text-3xl font-bold text-green-600">{mp?.nicotine_level ?? '-'}</span>
                                <p className="text-green-800 font-medium flex items-center justify-center gap-1">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} /></svg>
                                    Nicotine (mg)
                                </p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                <span className="text-3xl font-bold text-yellow-600">{mp?.price_per_pack?.toLocaleString() ?? '-'}₫</span>
                                <p className="text-yellow-800 font-medium flex items-center justify-center gap-1">
                                    <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth={2} /></svg>
                                    Giá/gói
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={cardClass}>
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    Thương hiệu thường dùng
                                </div>
                                <div className="text-gray-800">{mp?.brand_preference ?? 'Không có'}</div>
                            </div>
                            <div className={cardClass}>
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    Lịch làm việc
                                </div>
                                <div className="text-gray-800">
                                    Thức dậy: {mp?.daily_routine?.wake_time ?? '-'}<br />
                                    Công việc: {mp?.daily_routine?.work_type ?? '-'}<br />
                                    Ngủ: {mp?.daily_routine?.sleep_time ?? '-'}
                                </div>
                            </div>
                            <div className={cardClass}>
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    Tình trạng sức khỏe
                                </div>
                                <div className="text-gray-800">
                                    {(mp?.health_conditions?.length > 0) ? mp.health_conditions.join(', ') : 'Không có'}
                                </div>
                            </div>
                            <div className={cardClass}>
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    Dị ứng
                                </div>
                                <div className="text-gray-800">
                                    {(mp?.allergies?.length > 0) ? mp.allergies.join(', ') : 'Không có'}
                                </div>
                            </div>
                            <div className={cardClass}>
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    Thuốc
                                </div>
                                <div className="text-gray-800">
                                    {(mp?.medications?.length > 0) ? mp.medications.join(', ') : 'Không có'}
                                </div>
                            </div>
                            <div className={cardClass}>
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    Hỗ trợ
                                </div>
                                <div className="text-gray-800">
                                    {(mp?.preferred_support?.length > 0) ? mp.preferred_support.join(', ') : 'Không có'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {userProfile.coach_profile?.length > 0 && (
                    <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-[#03256c] mb-6">Coach Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <span className="text-3xl font-bold text-purple-600">{userProfile.coach_profile[0]?.experience_years ?? '-'}</span>
                                <p className="text-purple-800 font-medium">Years of Experience</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-semibold text-gray-800 mb-2">Bio</h4>
                                <p className="text-gray-600">{userProfile.coach_profile[0]?.bio ?? ''}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-[#03256c] mb-8 tracking-tight flex items-center gap-2">
                        <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24"><path d="M12 17l-5 3 1.9-6.1-5-3.9 6.2-.5L12 2l2.9 7.5 6.2.5-5 3.9L17 20z" fill="currentColor" /></svg>
                        Huy hiệu
                    </h3>
                    {loadingBadges ? (
                        <div className="flex gap-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-yellow-100 w-24 h-24 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : badges.length === 0 ? (
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-gray-500 mt-2">Bạn chưa có huy hiệu nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7">
                            {badges.map((awarded) => (
                                <div
                                    key={awarded.id}
                                    className="group bg-white border border-yellow-100 rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer relative"
                                    title={awarded.badge.description}
                                >
                                    <img
                                        src={awarded.badge.icon_url}
                                        alt={awarded.badge.name}
                                        className="w-14 h-14 mb-3 object-cover rounded-full border-2 border-yellow-200"
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

            {modal === "profile" && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-fadeIn">
                    <div className="bg-white rounded-3xl p-10 w-full max-w-sm flex flex-col gap-5 relative">
                        <button
                            onClick={() => setModal(null)}
                            className="cursor-pointer absolute right-5 top-5 text-gray-400 hover:text-red-500 text-2xl font-bold"
                            aria-label="Close"
                        >×</button>
                        <h3 className="text-xl font-bold text-[#03256c] mb-2">Chỉnh sửa</h3>
                        <label className="text-gray-700">Tên</label>
                        <input
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Tên"
                        />
                        <button
                            className="cursor-pointer bg-[#60c3a4] text-white px-6 py-2 rounded-lg font-semibold mt-4 hover:bg-[#4ca885] transition"
                            onClick={handleSaveProfile}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            )}

            {modal === "password" && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-fadeIn">
                    <div className="bg-white rounded-3xl p-10 w-full max-w-sm flex flex-col gap-5 relative">
                        <button
                            onClick={() => setModal(null)}
                            className="cursor-pointer absolute right-5 top-5 text-gray-400 hover:text-red-500 text-2xl font-bold"
                            aria-label="Close"
                        >×</button>
                        <h3 className="text-xl font-bold text-[#03256c] mb-2">Thay đổi mật khẩu</h3>
                        <label className="text-gray-700">Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={passwordInputs.currentPassword}
                            onChange={(e) => setPasswordInputs({ ...passwordInputs, currentPassword: e.target.value })}
                            placeholder="••••••"
                        />
                        <label className="text-gray-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="border rounded-lg px-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition"
                            value={passwordInputs.newPassword}
                            onChange={(e) => setPasswordInputs({ ...passwordInputs, newPassword: e.target.value })}
                            placeholder="••••••"
                        />
                        <label className="text-gray-700">Xác nhận mật khẩu</label>
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
                            Lưu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
