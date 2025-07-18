"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import Loading from "@/components/common/Loading";
import Breadcrumbs from "@/components/common/BreadCrumb";
import { getPlanTemplates } from "@/services/templateService";
import { useLazyPlanStages } from "@/services/planStageTemplate";
import { StageModal } from "@/components/template/StageModal";
import { translateDifficulty } from "@/utils";
import ConfirmModal from "@/components/common/ModalConfirm";
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";
import useTemplateSelection from "@/hooks/useTemplateSelection";
import { useSubscription } from "@/context/SubscriptionContext";
import { getAllCoaches } from "@/services/userService";
import { Crown } from "lucide-react";
import { getQuizAttemptOnCurrentUser } from '@/services/quizService';
import { useRouter } from 'next/navigation';

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.13,
      type: "spring",
      stiffness: 170,
      damping: 17,
    },
  }),
};

function renderStars(rating: number, max = 5) {
  return Array.from({ length: max }, (_, i) => {
    const index = i + 1;
    if (rating >= index)
      return <BsStarFill key={index} className="text-yellow-400 w-5 h-5" />;
    if (rating >= index - 0.5)
      return <BsStarHalf key={index} className="text-yellow-400 w-5 h-5" />;
    return <BsStar key={index} className="text-gray-300 w-5 h-5" />;
  });
}

function SuccessBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-sky-100 rounded-full h-3 relative mt-2 mb-1">
      <div
        className="absolute h-3 rounded-full bg-gradient-to-r from-sky-400 to-green-400 transition-all"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}

const difficultyLevels = [
  { value: "", label: "Tất cả mức độ" },
  { value: "EASY", label: "Dễ" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HARD", label: "Khó" },
];

export default function PlanTemplatesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    getAllCoaches().then(setCoaches).catch(() => setCoaches([]));
  }, []);

  useEffect(() => {
    async function checkQuizAttempt() {
      try {
        const attempt = await getQuizAttemptOnCurrentUser();
        setHasCompletedQuiz(!!(attempt?.length > 0));
      } catch (err) {
        setHasCompletedQuiz(false);
      }
    }
    checkQuizAttempt();
  }, []);


  const { templates, loading, error } = getPlanTemplates({
    filters: {
      difficultyLevel: selectedDifficulty || undefined,
      coachId: selectedCoach || undefined,
    },
  });
  const { fetchStages, stages, loading: stageLoading } = useLazyPlanStages();
  const {
    openStageModal,
    setOpenStageModal,
    showConfirm,
    setShowConfirm,
    selectedTemplate,
    handleUseTemplate,
    handleConfirmCreate,
    loadingCreate,
    reason,
    setReason,
    isCustom,
    setIsCustom,
    successMsg,
    errorMsg,
    setSuccessMsg,
    setErrorMsg,
  } = useTemplateSelection();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription(); // Sử dụng useSubscription

  useEffect(() => {
    if (successMsg) {
      toast.custom(<SuccessToast message={successMsg} />);
      setSuccessMsg(null);
    }
    if (errorMsg) {
      toast.custom(<ErrorToast message={errorMsg} />);
      setErrorMsg(null);
    }
  }, [successMsg, errorMsg, setSuccessMsg, setErrorMsg]);

  const handleViewStages = (templateId: string) => {
    setOpenStageModal(true);
    fetchStages({ variables: { templateId } });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Mẫu kế hoạch bỏ thuốc", active: true },
        ]}
      />
      {hasCompletedQuiz === false && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-center justify-between">
          <span className="text-yellow-800 font-semibold">
            Bạn có thể hoàn thành bài kiểm tra sức khỏe trước khi sử dụng các mẫu kế hoạch và nhận được gợi ý từ AI cho kế hoạch bỏ thuốc.
          </span>
          <button
            className="ml-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded transition cursor-pointer text-nowrap"
            onClick={() => router.push('/quiz')}
          >
            Kiểm tra
          </button>
        </div>
      )}
      <motion.h1
        className="text-4xl font-extrabold text-center mb-7 bg-gradient-to-r from-sky-600 to-green-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Danh sách mẫu kế hoạch bỏ thuốc
      </motion.h1>
      <motion.p
        className="text-center text-gray-500 mb-8 text-lg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        Chọn một kế hoạch bên dưới để xem chi tiết các giai đoạn và bắt đầu hành
        trình bỏ thuốc của bạn!
      </motion.p>

      <div className="flex justify-start mb-10 gap-4">
        <div className="relative w-full max-w-xs">
          <select
            id="difficulty-filter"
            className="block w-full pl-4 pr-10 py-2.5 text-base border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficultyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-full max-w-xs">

          <select
            id="coach-filter"
            className="block w-full pl-4 pr-10 py-2.5 text-base border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
          >
            <option value="">Tất cả Coach</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>{coach.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading || subscriptionLoading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-600 py-10">Lỗi tải dữ liệu</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {templates.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12 text-lg font-semibold">
              Chưa có mẫu kế hoạch nào!
            </div>
          ) : (
            templates.map((tpl: any, idx: number) => (
              <motion.div
                key={tpl.id}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="relative bg-gradient-to-br from-sky-50 to-green-50 shadow-xl rounded-2xl p-7 flex flex-col gap-2 border-t-4 border-transparent hover:border-sky-400 transition-all group"
                whileHover={{
                  y: -7,
                  scale: 1.035,
                  boxShadow: "0 10px 38px 0 #60C3A428",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-xl text-sky-800 text-nowrap">
                    {tpl.name}
                  </span>
                </div>

                <div className="text-gray-600 mb-2 min-h-[44px]">
                  {tpl.description?.length > 60
                    ? tpl.description.slice(0, 60) + "..."
                    : tpl.description}
                </div>

                <div className="flex items-center gap-2">
                  <b className="text-gray-500">Mức độ:</b>
                  <span
                    className={`mr-auto px-3 py-1 rounded-full text-xs font-bold shadow-sm
                                        ${tpl.difficulty_level === "HARD"
                        ? "bg-red-100 text-red-700"
                        : tpl.difficulty_level === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {translateDifficulty(tpl.difficulty_level)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <b className="text-gray-500">Đánh giá:</b>
                    {tpl.average_rating ? (
                      <span className="inline-flex items-center gap-1">
                        {renderStars(Number(tpl.average_rating))}
                        <span className="ml-1 font-semibold text-yellow-600">
                          {tpl.average_rating}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa có</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <b className="text-gray-500">Lượt đánh giá:</b>
                    <span className="text-sky-600 font-bold">
                      {tpl.total_reviews ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <b className="text-gray-500">Tỉ lệ thành công:</b>
                    <span className="text-blue-700 font-bold">
                      {tpl.success_rate ?? 0}%
                    </span>
                  </div>
                  <SuccessBar percent={tpl.success_rate ?? 0} />
                </div>
                <div className="flex flex-wrap justify-between gap-2 mt-3">
                  <motion.button
                    className="flex-1 cursor-pointer text-nowrap bg-gradient-to-r from-green-500 to-sky-400 hover:from-green-600 hover:to-sky-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all"
                    whileHover={{ scale: 1.055, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUseTemplate(tpl)}
                  >
                    Sử dụng mẫu này
                  </motion.button>
                  <motion.button
                    className="flex-1 cursor-pointer text-nowrap bg-white border border-sky-300 text-sky-600 hover:bg-sky-50 py-2 px-4 rounded-xl font-semibold shadow-sm transition-all"
                    whileHover={{ scale: 1.035 }}
                    onClick={() => handleViewStages(tpl.id)}
                  >
                    Xem các giai đoạn mẫu
                  </motion.button>
                  <Link
                    href={`/template/${tpl.id}`}
                    className="flex-1 text-center cursor-pointer bg-sky-100 border border-sky-300 text-sky-700 hover:bg-sky-200 py-2 px-4 rounded-xl font-semibold shadow-sm transition-all"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/plan"
          className="text-blue-600 underline hover:text-blue-800 font-medium text-lg"
        >
          ← Quay lại trang kế hoạch
        </Link>
      </div>

      <StageModal
        open={openStageModal}
        onClose={() => setOpenStageModal(false)}
        stages={stages}
        loading={stageLoading}
      />

      <ConfirmModal
        open={showConfirm}
        title="Xác nhận sử dụng mẫu"
        message={
          loadingCreate ? (
            <Loading />
          ) : (
            <div>
              <p>
                Bạn có chắc chắn muốn tạo kế hoạch mới từ mẫu{" "}
                <b>{selectedTemplate?.name}</b>?
              </p>
              <div className="mt-4">
                <label
                  className="block font-semibold mb-1 text-left"
                  htmlFor="plan-reason"
                >
                  Lý do bỏ thuốc:
                </label>
                <input
                  id="plan-reason"
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do cá nhân..."
                />
              </div>
              <div className="relative flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  className={`accent-sky-600 w-4 h-4 ${!isSubscribed ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  checked={isSubscribed ? isCustom : false}
                  onChange={(e) =>
                    isSubscribed && setIsCustom(e.target.checked)
                  }
                  disabled={!isSubscribed}
                  id="custom-plan"
                />
                <label
                  htmlFor="custom-plan"
                  className={`text-sky-700 group relative cursor-pointer ${!isSubscribed ? "cursor-not-allowed" : ""
                    }`}
                >
                  <Crown className="inline-block" color="#FFFF00" width={16} height={16} /> Tùy chỉnh kế hoạch
                  {!isSubscribed && (
                    <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 shadow-lg z-10">
                      <div className="absolute left-0 -top-10 w-full h-full bg-transparent rounded-lg" />
                      <Link
                        href="/membership"
                        className="hover:text-sky-400"
                      >
                        Nâng cấp gói thành viên ngay
                      </Link>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )
        }
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmCreate}
      />
    </div>
  );
}
