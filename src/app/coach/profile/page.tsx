"use client";
import { useEffect, useState } from "react";
import { getCurrentCoachProfile } from "@/services/userService";
import Loading from "@/components/common/Loading";
import { FaUsers, FaStar, FaCheckCircle, FaChalkboardTeacher, FaUserGraduate, FaHistory } from "react-icons/fa";

export default function CoachProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCurrentCoachProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Lỗi tải hồ sơ coach");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loading /></div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!profile) return <div className="text-center py-20">Không tìm thấy hồ sơ</div>;

  const coach = profile.coach_profile?.[0];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-8 mt-6 sm:mt-10 space-y-6">
      <div className="flex flex-col items-center gap-3">
        <img
          src={profile.avatar_url || "/images/avatar.png"}
          alt="Avatar"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-sky-200 object-cover shadow mx-auto"
        />
        <h2 className="text-xl sm:text-2xl font-bold text-sky-800 text-center">{profile.name}</h2>
        <div className="text-gray-500 text-sm text-center">@{profile.user_name}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-gray-700">
        <InfoBlock icon={<FaHistory />} label="Năm kinh nghiệm" value={coach?.experience_years ?? '-'} color="text-green-600" />
        <InfoBlock icon={<FaUsers />} label="Tổng khách hàng" value={coach?.total_clients ?? '-'} color="text-blue-600" />
        <InfoBlock icon={<FaChalkboardTeacher />} label="Tổng buổi tư vấn" value={coach?.total_sessions ?? '-'} color="text-purple-600" />
        <InfoBlock icon={<FaCheckCircle />} label="Tỉ lệ thành công" value={coach?.success_rate ? `${coach.success_rate}%` : '-'} color="text-emerald-600" />
        <InfoBlock icon={<FaStar />} label="Đánh giá trung bình" value={coach?.average_rating ?? '-'} color="text-yellow-600" />
        <InfoBlock icon={<FaUserGraduate />} label="Chuyên môn" value={coach?.specializations?.join(', ') ?? '-'} />
      </div>

      <div className="space-y-4">
        <Section title="Tiểu sử nghề nghiệp" content={coach?.professional_bio ?? '-'} />
        <Section title="Bằng cấp" content={coach?.certifications?.join(', ') ?? '-'} />
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value, color = "text-gray-700" }: any) {
  return (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg shadow-sm">
      <div className={`mt-1 text-lg ${color}`}>{icon}</div>
      <div>
        <div className="font-medium text-sm sm:text-base">{label}</div>
        <div className="text-base font-semibold break-words max-w-[180px] sm:max-w-none">{value}</div>
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string, content: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
      <div className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">{title}:</div>
      <div className="text-base text-gray-700 whitespace-pre-line min-h-[40px] break-words">{content}</div>
    </div>
  );
}
