"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useState } from "react";

export default function ProfilePage() {
    const t = useTranslations("profile");
    const params = useParams();
    const locale = (params.locale as string) || 'vi';
    
    // State for edit modes
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // Mock user data - in a real app, this would come from an API or context
    const [user, setUser] = useState({
        name: "Nguyễn Văn A",
        username: "nguyenvana",
        email: "nguyen.van.a@gmail.com",
        joinDate: "01/03/2024",
        daysSmokeFree: 45,
        lastDaySmoked: "20/03/2024",
        avatarUrl: "https://i.pravatar.cc/100?img=1",
        badges: ["🔥 7-Day Streak", "🎯 First Week Complete", "⭐ 30-Day Achievement"]
    });
      // State for name input
    const [nameInput, setNameInput] = useState(user.name);
    
    // State for password inputs
    const [passwordInputs, setPasswordInputs] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });    // Toggle edit profile mode
    const toggleEditProfile = () => {
        // If we're turning on edit mode, sync the name input with current value
        if (!isEditingProfile) {
            setNameInput(user.name);
        }
        setIsEditingProfile(!isEditingProfile);
        // Close password form if it's open
        if (isChangingPassword) setIsChangingPassword(false);
    };
    
    // Toggle change password mode
    const toggleChangePassword = () => {
        setIsChangingPassword(!isChangingPassword);
        // Close profile editing if it's open
        if (isEditingProfile) setIsEditingProfile(false);
    };
    
    // Handle save profile changes
    const handleSaveProfile = () => {
        // Update user data and exit edit mode
        setUser({
            ...user,
            name: nameInput
        });
        setIsEditingProfile(false);
    };
    
    // Handle save password changes
    const handleSavePassword = () => {
        // In a real app, you would validate passwords and send them to an API
        if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        
        // Reset form and exit edit mode
        setPasswordInputs({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setIsChangingPassword(false);
    };

    return (
        <div className="min-h-screen bg-[#fefcf6]">
            <Header />
            
            <div className="max-w-4xl mx-auto p-6 my-10">
                <h1 className="text-3xl font-bold mb-8 text-[#03256C]">{t("title")}</h1>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-[#60C3A4] p-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 relative group">
                                <img 
                                    src={user.avatarUrl}
                                    alt="Profile"
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                />
                                {isEditingProfile && (
                                    <div 
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                    >
                                        <p className="text-xs text-center px-2">{t("clickToChange")}</p>
                                        <input 
                                            type="file" 
                                            id="avatar-upload" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    // In a real app, you'd upload this file
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        if (event.target && event.target.result) {
                                                            setUser({
                                                                ...user,
                                                                avatarUrl: event.target.result.toString()
                                                            });
                                                        }
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="bg-white text-[#03256C] text-center px-3 py-1 rounded-md w-full mb-2"
                                    placeholder={t("name")}
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                            )}
                            <p className="text-white opacity-75 mt-1">{user.email}</p>
                            <p className="text-sm text-white mt-4">
                                {t("memberSince")}: {user.joinDate}
                            </p>
                            
                            {!isEditingProfile && !isChangingPassword ? (
                                <div className="mt-6 flex flex-col gap-2">
                                    <button
                                        onClick={toggleEditProfile}
                                        className="bg-white text-[#60C3A4] px-4 py-2 rounded-md font-medium hover:bg-gray-100 w-full"
                                    >
                                        {t("edit")}
                                    </button>
                                    <button
                                        onClick={toggleChangePassword}
                                        className="bg-white text-[#03256C] px-4 py-2 rounded-md font-medium hover:bg-gray-100 w-full"
                                    >
                                        {t("changePassword")}
                                    </button>
                                </div>
                            ) : isEditingProfile ? (
                                <div className="mt-6 flex gap-2">
                                    <button
                                        onClick={handleSaveProfile}
                                        className="bg-white text-[#60C3A4] px-4 py-2 rounded-md font-medium hover:bg-gray-100"
                                    >
                                        {t("save")}
                                    </button>
                                    <button
                                        onClick={toggleEditProfile}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
                                    >
                                        {t("cancel")}
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 flex gap-2">
                                    <button
                                        onClick={handleSavePassword}
                                        className="bg-white text-[#60C3A4] px-4 py-2 rounded-md font-medium hover:bg-gray-100"
                                    >
                                        {t("save")}
                                    </button>
                                    <button
                                        onClick={toggleChangePassword}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
                                    >
                                        {t("cancel")}
                                    </button>
                                </div>
                            )}
                        </div>
                            <div className="md:w-2/3 p-6">
                            {!isChangingPassword ? (
                                <>
                                    <h3 className="text-xl font-semibold mb-4 text-[#03256C]">
                                        {t("progressHeader")}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-500">{t("daysSmokeFree")}</p>
                                            <p className="text-2xl font-bold text-[#03256C]">
                                                {user.daysSmokeFree} {t("days")}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-500">{t("lastDaySmoked")}</p>
                                            <p className="text-2xl font-bold text-[#03256C]">
                                                {user.lastDaySmoked}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold mb-4 text-[#03256C]">
                                        {t("badges")}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {user.badges.map((badge, index) => (
                                            <span 
                                                key={index}
                                                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold mb-4 text-[#03256C]">
                                        {t("changePassword")}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t("currentPassword")}
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordInputs.currentPassword}
                                                onChange={(e) => setPasswordInputs({...passwordInputs, currentPassword: e.target.value})}
                                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                                placeholder="••••••"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t("newPassword")}
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordInputs.newPassword}
                                                onChange={(e) => setPasswordInputs({...passwordInputs, newPassword: e.target.value})}
                                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                                placeholder="••••••"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t("confirmPassword")}
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordInputs.confirmPassword}
                                                onChange={(e) => setPasswordInputs({...passwordInputs, confirmPassword: e.target.value})}
                                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                                                placeholder="••••••"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            <div className="mt-8">
                                <Link 
                                    href={`/${locale}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {t("backToHome")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
