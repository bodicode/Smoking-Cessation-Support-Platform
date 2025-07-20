import { Users, TrendingUp, Calendar, Target, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useTemplateUsageStats } from "@/hooks/useTemplateUsageStats";
import { TemplateUsageStats as TemplateUsageStatsType } from "@/types/api/templateUsageStats";

interface TemplateUsageStatsProps {
  templateId: string;
}

export function TemplateUsageStats({ templateId }: TemplateUsageStatsProps) {
  const { stats, loading, error } = useTemplateUsageStats({
    templateId,
    params: {
      page: 1,
      limit: 10,
      orderBy: "created_at",
      sortOrder: "desc"
    },
    filters: {
      status: "",
      search: ""
    }
  });

  if (loading) {
    return (
      <div className="py-8 text-center text-sky-600 font-semibold">
        Đang tải thống kê...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600 font-semibold">
        Lỗi tải thống kê: {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-8 text-center text-gray-500">
        Không có dữ liệu thống kê.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-100";
      case "NOT_STARTED":
        return "text-gray-600 bg-gray-100";
      case "PAUSED":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <TrendingUp className="w-4 h-4" />;
      case "NOT_STARTED":
        return <Clock className="w-4 h-4" />;
      case "PAUSED":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-200">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-200">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.stats_by_status.find(s => s.status === "COMPLETED")?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Đang thực hiện</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.stats_by_status.find(s => s.status === "IN_PROGRESS")?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Phân bố trạng thái</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.stats_by_status.map((statusStat) => (
            <div key={statusStat.status} className="text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(statusStat.status)}`}>
                {getStatusIcon(statusStat.status)}
                {statusStat.status.replace("_", " ")}
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{statusStat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User List */}
      {stats.users.data.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách người dùng</h3>
          <div className="space-y-4">
            {stats.users.data.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold">
                      {user.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.user.name}</p>
                    <p className="text-sm text-gray-500">@{user.user.user_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tiến độ</p>
                    <p className="font-semibold text-gray-800">{user.completion_percentage}%</p>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    {user.status.replace("_", " ")}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(user.start_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 