"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Home,
  RefreshCw,
  TrendingUp,
  Award,
  Target,
  Heart,
} from "lucide-react";
import Link from "next/link";
import {
  getQuizAttemptOnCurrentUser,
  getAIRecommendation,
} from "@/services/quizService";
import { quizResultService } from "@/services/quizResultService";
import Loading from "@/components/common/Loading";

interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  completed_at: string;
  total_score: number;
  recommendations: string[];
}

interface MatchingFactors {
  source?: string;
  confidence?: number;
  reasoning?: any;
  timestamp?: string;
}

interface MatchingResultType {
  id: string;
  template: {
    id: string;
    name: string;
    description: string;
    is_active?: boolean;
  };
  recommendationLevel: string;
  matchingScore: number;
  matchingFactors: MatchingFactors;
}

export default function QuizResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult | null>(null);
  const [matchingResults, setMatchingResults] = useState<MatchingResultType[]>(
    []
  );
  const [loadingMatching, setLoadingMatching] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [aiRecommendation, setAIRecommendation] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizResult() {
      try {
        const attempt = await getQuizAttemptOnCurrentUser();
        if (attempt?.length > 0) {
          setResults({
            id: attempt.id,
            user_id: attempt.user_id,
            quiz_id: attempt.quiz_id,
            completed_at: attempt.completed_at,
            total_score: attempt.total_score || 0,
            recommendations: attempt.recommendations || [],
          });
        } else {
          router.push("/quiz");
        }
      } catch {
        router.push("/quiz");
      }

      setLoadingMatching(true);
      try {
        const arr = await quizResultService.getMyTemplateMatchingResults();
        if (Array.isArray(arr) && arr.length > 0) {
          setMatchingResults(arr);
        } else {
          // If no matching results, trigger AI recommendation process
          setLoadingAI(true);
          try {
            // First, call getAIRecommendation to trigger the process
            await getAIRecommendation();

            // Wait for a moment (3 seconds) to allow the backend to process
            setTimeout(async () => {
              try {
                // Fetch the matching results again after waiting
                const newResults = await quizResultService.getMyTemplateMatchingResults();
                if (Array.isArray(newResults) && newResults.length > 0) {
                  setMatchingResults(newResults);
                } else {
                  // If still no results, try to get the AI recommendation directly
                  const aiRecommend = await getAIRecommendation();
                  if (aiRecommend) {
                    setAIRecommendation(aiRecommend);
                  }
                }
              } catch (error) {
                setAIError("Lỗi lấy gợi ý từ AI");
                console.error("AI recommendation error:", error);
              } finally {
                setLoadingAI(false);
              }
            }, 15000); // Wait for 3 seconds before fetching results again
          } catch (error) {
            setAIError("Lỗi lấy gợi ý từ AI");
            console.error("AI recommendation error:", error);
            setLoadingAI(false);
          }
        }
      } catch (error) {
        setMatchingError("Lỗi lấy gợi ý kế hoạch");
        // If error getting matching results, try AI recommendation
        setLoadingAI(true);
        try {
          await getAIRecommendation();

          // Wait for a moment before fetching results again
          setTimeout(async () => {
            try {
              const newResults = await quizResultService.getMyTemplateMatchingResults();
              if (Array.isArray(newResults) && newResults.length > 0) {
                setMatchingResults(newResults);
              } else {
                const aiRecommend = await getAIRecommendation();
                if (aiRecommend) {
                  setAIRecommendation(aiRecommend);
                }
              }
            } catch (error) {
              setAIError("Lỗi lấy gợi ý từ AI");
              console.error("AI recommendation error:", error);
            } finally {
              setLoadingAI(false);
            }
          }, 3000);
        } catch (error) {
          setAIError("Lỗi lấy gợi ý từ AI");
          console.error("AI recommendation error:", error);
          setLoadingAI(false);
        }
      } finally {
        setLoadingMatching(false);
      }
    }
    fetchQuizResult();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderProgressBar = (confidence: number) => (
    <div className="flex items-center gap-2 mb-4">
      <Award className="text-green-500" />
      <span className="font-bold text-lg">Độ tin cậy AI:</span>
      <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
        <div
          className={`h-3 rounded ${
            confidence > 0.8
              ? "bg-green-500"
              : confidence > 0.6
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="font-bold">{Math.round(confidence * 100)}%</span>
    </div>
  );

  const renderReasoningSection = (reasoning: any) => (
    <div className="flex flex-col gap-8 mt-4">
      {[
        {
          icon: Award,
          title: "Phân tích & cân nhắc",
          color: "text-blue-700",
          data: reasoning?.considerations,
        },
        {
          icon: Target,
          title: "Yếu tố phù hợp",
          color: "text-blue-700",
          data: reasoning?.matchingFactors,
        },
        {
          icon: Heart,
          title: "Rủi ro",
          color: "text-red-700",
          data: reasoning?.risks,
        },
        {
          icon: TrendingUp,
          title: "Đề xuất hành động",
          color: "text-green-700",
          data: reasoning?.suggestions,
        },
      ].map(({ icon: Icon, title, color, data }, index) =>
        data?.length ? (
          <div key={index}>
            <div className="flex items-center justify-start gap-2 mb-2">
              <Icon className={`${color.replace("700", "500")}`} />
              <h4 className={`font-semibold ${color} text-lg`}>{title}</h4>
            </div>
            <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
              {data.map((c: string, i: number) => (
                <li key={i} className="mb-2">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );

  const renderActionButtons = (templateId: string | null, loading: boolean) => (
    <div className="flex justify-center mt-8 gap-4">
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
      >
        <Home className="w-4 h-4" />
        Quay về trang chủ
      </Link>
      <Link
        href="/quiz?retry=1"
        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Làm lại bài kiểm tra
      </Link>
      <button
        disabled={loading || !templateId}
        onClick={() => templateId && router.push(`/template/${templateId}`)}
        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700
        ${loading || !templateId ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Target className="w-4 h-4" />
        {loading
          ? "Đang lấy gợi ý..."
          : templateId
          ? "Lấy mẫu kế hoạch dựa trên AI"
          : "Không có gợi ý phù hợp"}
      </button>
    </div>
  );

  const renderRecommendationContent = () => {
    if (
      (loadingMatching || loadingAI) &&
      !matchingResults.length &&
      !aiRecommendation
    ) {
      return (
        <div className="mt-8 flex flex-col items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (matchingResults.length > 0) {
      // Sort by confidence DESC
      const sortedResults = [...matchingResults].sort(
        (a, b) =>
          (b.matchingFactors?.confidence ?? 0) -
          (a.matchingFactors?.confidence ?? 0)
      );

      return (
        <>
          {sortedResults.map((data, idx) => (
            <motion.div
              key={data.id}
              variants={itemVariants}
              className="mt-8 bg-white rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Gợi ý #{idx + 1}: {data.template?.name}
              </h3>
              {renderProgressBar(data.matchingFactors?.confidence || 0)}
              {renderReasoningSection(data.matchingFactors?.reasoning)}
              {renderActionButtons(
                data.template?.id || null,
                loadingMatching || loadingAI
              )}
            </motion.div>
          ))}
        </>
      );
    }

    if (aiRecommendation) {
      const confidence =
        aiRecommendation.matchingFactors?.confidence ||
        aiRecommendation.confidence ||
        0;
      const reasoning =
        aiRecommendation.matchingFactors?.reasoning ||
        aiRecommendation.reasoning;
      const templateId =
        aiRecommendation.template?.id ||
        aiRecommendation.recommendedTemplate ||
        null;

      return (
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-white rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Gợi ý từ AI cho kế hoạch bỏ thuốc dựa trên kết quả bài kiểm tra của
            bạn
          </h3>
          {renderProgressBar(confidence)}
          {renderReasoningSection(reasoning)}
          {renderActionButtons(templateId, loadingMatching || loadingAI)}
        </motion.div>
      );
    }

    if (matchingError || aiError) {
      return (
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-white rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-red-600 mb-4">
            {matchingError || aiError}
          </h3>
          <p className="text-gray-600">
            Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Không tìm thấy gợi ý phù hợp
        </h3>
        <p className="text-gray-600 mb-4">
          Hệ thống không thể tìm thấy gợi ý phù hợp dựa trên kết quả bài kiểm tra của bạn.
        </p>
        {renderActionButtons(null, false)}
      </motion.div>
    );
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold text-gray-600">Đang tải kết quả...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Cảm ơn bạn đã hoàn thành bài kiểm tra
          </motion.h1>
          {renderRecommendationContent()}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Bước tiếp theo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Tạo kế hoạch</h4>
              <p className="text-sm text-blue-600 mt-1">
                Chọn mẫu kế hoạch phù hợp
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Theo dõi tiến độ</h4>
              <p className="text-sm text-green-600 mt-1">
                Ghi lại hành trình hàng ngày
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800">Nhận huy hiệu</h4>
              <p className="text-sm text-purple-600 mt-1">Đạt được thành tựu</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
