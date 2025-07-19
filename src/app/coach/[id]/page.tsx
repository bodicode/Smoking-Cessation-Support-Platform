'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/common/Loading";
import { useUserProfile } from "@/hooks/useUserProfile";
import { 
  ArrowLeft, Star, Users, TrendingUp, Calendar, 
  Award, BookOpen, Clock, Target, MessageSquare,
  CheckCircle, Award as AwardIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";

function renderStars(rating: number, max = 5) {
  return Array.from({ length: max }, (_, i) => {
    const index = i + 1;
    if (rating >= index)
      return <Star key={index} className="text-yellow-400 w-5 h-5 fill-current" />;
    return <Star key={index} className="text-gray-300 w-5 h-5" />;
  });
}

export default function CoachProfilePage() {
  const params = useParams();
  const coachId = params?.id as string;
  const { profile, loading, error } = useUserProfile(coachId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">Lỗi tải thông tin coach</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.coach_profile || profile.coach_profile.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl font-semibold mb-4">Không tìm thấy thông tin coach</div>
          <Link 
            href="/template" 
            className="text-sky-600 hover:text-sky-800 font-medium"
          >
            Quay lại trang templates
          </Link>
        </div>
      </div>
    );
  }

  const coachProfile = profile.coach_profile[0];

  return (
    <motion.div
      className="max-w-6xl mx-auto my-10 bg-white rounded-2xl p-8 border border-gray-100"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Mẫu kế hoạch bỏ thuốc", href: "/template" },
          { label: "Hồ sơ Coach", active: true },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/template"
          className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Link>
        <div className="w-px h-6 bg-gray-300"></div>
        <h1 className="text-3xl font-bold text-sky-800">Hồ sơ Coach</h1>
      </div>

      {/* Coach Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-sky-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center">
                <span className="text-sky-600 text-3xl font-bold">
                  {coachProfile.approach_description?.charAt(0) || "C"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-sky-700 mb-2">
                  Coach {coachProfile.approach_description}
                </h2>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(coachProfile.average_rating)}
                    <span className="ml-2 font-semibold text-yellow-600">
                      {coachProfile.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{coachProfile.total_clients} khách hàng</span>
                </div>
                {coachProfile.professional_bio && (
                  <p className="text-gray-700 leading-relaxed">{coachProfile.professional_bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-200">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-gray-800">{coachProfile.total_clients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-200">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ thành công</p>
                  <p className="text-2xl font-bold text-gray-800">{coachProfile.success_rate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Tổng phiên tư vấn</p>
                  <p className="text-2xl font-bold text-gray-800">{coachProfile.total_sessions}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Experience & Education */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-green-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Kinh nghiệm & Học vấn
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-800">Kinh nghiệm</p>
                  <p className="text-gray-600">{coachProfile.experience_years} năm</p>
                </div>
              </div>
              {coachProfile.education && (
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Học vấn</p>
                    <p className="text-gray-600">{coachProfile.education}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Specializations */}
          {coachProfile.specializations && coachProfile.specializations.length > 0 && (
            <motion.div 
              className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-purple-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                <AwardIcon className="w-5 h-5" />
                Chuyên môn
              </h3>
              <div className="flex flex-wrap gap-2">
                {coachProfile.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications */}
          {coachProfile.certifications && coachProfile.certifications.length > 0 && (
            <motion.div 
              className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-yellow-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Chứng chỉ
              </h3>
              <div className="space-y-2">
                {coachProfile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-blue-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Tham gia từ</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(coachProfile.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(coachProfile.updated_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Approach */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 border-l-8 border-green-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-green-700 mb-4">Phương pháp tiếp cận</h3>
            <p className="text-gray-700 leading-relaxed">
              {coachProfile.approach_description}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 