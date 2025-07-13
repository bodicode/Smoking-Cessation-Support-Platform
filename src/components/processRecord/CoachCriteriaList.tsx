import Loading from "@/components/common/Loading";
import { useHealthScoreCriteria } from "@/services/healthScoreCriteriaService";

export default function CoachCriteriaList({ coachId }: { coachId: string }) {
  const { criteriaList, loading, error } = useHealthScoreCriteria(coachId);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">Lỗi: {error.message}</div>;
  if (criteriaList.length === 0) {
    return (
      <div className="text-gray-400">Không có tiêu chí nào được thiết lập.</div>
    );
  }

  return (
    <div className="space-y-4">
      {criteriaList.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
        >
          <p className="text-lg font-bold text-sky-700">Điểm {item.title}:</p>
          <div
            className="mt-1 text-gray-700"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      ))}
    </div>
  );
}
