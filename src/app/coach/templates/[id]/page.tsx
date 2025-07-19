'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    ArrowLeft, Edit, Clock, Zap, Star, ChartNoAxesColumnDecreasing, 
    Calendar, User, TrendingUp, FileText, CheckCircle, MessageSquare
} from "lucide-react";
import Loading from "@/components/common/Loading";
import { getPlanTemplateById } from "@/services/templateService";
import { ErrorToast } from "@/components/common/CustomToast";
import { StageList } from "@/components/coach/StageList";
import { FeedbackList } from "@/components/feedback/FeedbackList";
import { TemplateUsageStats } from "@/components/template/TemplateUsageStats";

export default function TemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const templateId = params.id as string;

    const {
        template,
        loading,
        error
    } = getPlanTemplateById(templateId);

    if (loading) {
        return (
            <div className="py-12 text-center text-sky-600 font-semibold">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center text-red-600 font-semibold">
                Lỗi tải thông tin template.
            </div>
        );
    }

    if (!template) {
        return (
            <div className="py-12 text-center text-gray-600 font-semibold">
                Không tìm thấy template.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/coach/templates"
                        className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </Link>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <h1 className="text-3xl font-bold text-sky-800">{template.name}</h1>
                </div>
                <Link
                    href={`/coach/templates/new?edit=${template.id}`}
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow transition"
                >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                </Link>
            </div>

            {/* Template Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-sky-200">
                        <h2 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Mô tả
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{template.description}</p>
                    </div>

                    {/* Stages */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-green-200">
                        <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Các giai đoạn
                        </h2>
                        <StageList templateId={template.id} />
                    </div>

                    {/* Template Usage Stats */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-indigo-200">
                        <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Thống kê sử dụng
                        </h2>
                        <TemplateUsageStats templateId={template.id} />
                    </div>

                    {/* Feedback */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-purple-200">
                        <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Đánh giá từ người dùng
                        </h2>
                        <FeedbackList templateId={template.id} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-blue-200">
                        <h3 className="text-lg font-bold text-blue-700 mb-4">Thông tin chi tiết</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Thời lượng</p>
                                    <p className="font-semibold text-gray-800">{template.estimated_duration_days} ngày</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-red-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Độ khó</p>
                                    <p className="font-semibold text-gray-800">{template.difficulty_level}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                                    <p className="font-semibold text-gray-800">{template.average_rating ?? "0"}/5</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ChartNoAxesColumnDecreasing className="w-5 h-5 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Lượt đánh giá</p>
                                    <p className="font-semibold text-gray-800">{template.total_reviews ?? "0"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Tỷ lệ thành công</p>
                                    <p className="font-semibold text-gray-800">{template.success_rate ?? "0"}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coach Info */}
                    {template.coach && (
                        <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-orange-200">
                            <h3 className="text-lg font-bold text-orange-700 mb-4">Thông tin Coach</h3>
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Tạo bởi</p>
                                    <p className="font-semibold text-gray-800">{template.coach.name}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Created Date */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-gray-200">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Thông tin tạo</h3>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Ngày tạo</p>
                                <p className="font-semibold text-gray-800">
                                    {template.created_at ? new Date(template.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 