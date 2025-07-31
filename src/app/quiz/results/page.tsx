"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home, RefreshCw, TrendingUp, Award, Target, Heart } from 'lucide-react';
import Link from 'next/link';
import { getQuizAttemptOnCurrentUser, getAIRecommendation } from '@/services/quizService';
import { quizResultService } from '@/services/quizResultService';

interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  completed_at: string;
  total_score: number;
  recommendations: string[];
}

export default function QuizResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult | null>(null);
  const [matchingResult, setMatchingResult] = useState<any>(null);
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
          router.push('/quiz');
        }
      } catch (err) {
        router.push('/quiz');
      }

      setLoadingMatching(true);
      quizResultService.getMyTemplateMatchingResults()
        .then(async (arr) => {
          if (Array.isArray(arr) && arr.length > 0) {
            // Sort by createdAt desc, take the latest
            const sorted = [...arr].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setMatchingResult(sorted[0]);
            setAIRecommendation(null);
          } else {
            setMatchingResult(null);
            setLoadingAI(true);
            try {
              const aiRes = await getAIRecommendation();
              setAIRecommendation(aiRes);
            } catch (err: any) {
              setAIError(err?.message || 'Lỗi lấy gợi ý AI');
            } finally {
              setLoadingAI(false);
            }
          }
        })
        .catch((err) => setMatchingError(err.message || 'Lỗi lấy gợi ý AI'))
        .finally(() => setLoadingMatching(false));
    }
    fetchQuizResult();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">Đang tải kết quả...</h2>
        </div>
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

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >

          </motion.div>

          {loadingMatching && !matchingResult && !aiRecommendation && (
            <div className="mt-8 flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-blue-600 font-semibold">Đang lấy gợi ý AI...</span>
            </div>
          )}
          {matchingResult && (
            <motion.div
              variants={itemVariants}
              className="mt-8 bg-white rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Gợi ý từ AI cho kế hoạch bỏ thuốc dựa trên kết quả bài kiểm tra của bạn
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-green-500" />
                <span className="font-bold text-lg">Độ tin cậy AI:</span>
                <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
                  <div
                    className={`h-3 rounded ${matchingResult.matchingFactors?.confidence > 0.8 ? 'bg-green-500' : matchingResult.matchingFactors?.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(matchingResult.matchingFactors?.confidence || 0) * 100}%` }}
                  />
                </div>
                <span className="font-bold">{Math.round((matchingResult.matchingFactors?.confidence || 0) * 100)}%</span>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Award className="text-blue-500" />
                    <h4 className="font-semibold text-blue-700 text-lg">Phân tích & cân nhắc</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {matchingResult.matchingFactors?.reasoning?.considerations?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Target className="text-blue-500" />
                    <h4 className="font-semibold text-blue-700 text-lg">Yếu tố phù hợp</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {matchingResult.matchingFactors?.reasoning?.matchingFactors?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Heart className="text-red-500" />
                    <h4 className="font-semibold text-red-700 text-lg">Rủi ro</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {matchingResult.matchingFactors?.reasoning?.risks?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <TrendingUp className="text-green-500" />
                    <h4 className="font-semibold text-green-700 text-lg">Đề xuất hành động</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {matchingResult.matchingFactors?.reasoning?.suggestions?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-center mt-8 gap-4">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Quay về trang chủ
                </Link>

                <Link
                  href="/quiz?retry=1"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Làm lại bài kiểm tra
                </Link>
                <button
                  disabled={loadingMatching || !matchingResult?.template?.id}
                  onClick={() => {
                    if (matchingResult?.template?.id) {
                      router.push(`/template/${matchingResult.template.id}`);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all
                    hover:from-green-600 hover:to-green-700 cursor-pointer
                    ${loadingMatching || !matchingResult?.template?.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Target className="w-4 h-4" />
                  {loadingMatching ? 'Đang lấy gợi ý...' : matchingResult?.template?.id ? 'Lấy mẫu kế hoạch dựa trên AI' : 'Không có gợi ý phù hợp'}
                </button>
              </div>
            </motion.div>
          )}
          {!matchingResult && aiRecommendation && (
            <motion.div
              variants={itemVariants}
              className="mt-8 bg-white rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Gợi ý từ AI cho kế hoạch bỏ thuốc dựa trên kết quả bài kiểm tra của bạn
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-green-500" />
                <span className="font-bold text-lg">Độ tin cậy AI:</span>
                <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
                  <div
                    className={`h-3 rounded ${aiRecommendation.confidence > 0.8 ? 'bg-green-500' : aiRecommendation.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${aiRecommendation.confidence * 100}%` }}
                  />
                </div>
                <span className="font-bold">{Math.round(aiRecommendation.confidence * 100)}%</span>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Award className="text-blue-500" />
                    <h4 className="font-semibold text-blue-700 text-lg">Phân tích & cân nhắc</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {aiRecommendation.reasoning?.considerations?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Target className="text-blue-500" />
                    <h4 className="font-semibold text-blue-700 text-lg">Yếu tố phù hợp</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {aiRecommendation.reasoning?.matchingFactors?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Heart className="text-red-500" />
                    <h4 className="font-semibold text-red-700 text-lg">Rủi ro</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {aiRecommendation.reasoning?.risks?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <TrendingUp className="text-green-500" />
                    <h4 className="font-semibold text-green-700 text-lg">Đề xuất hành động</h4>
                  </div>
                  <ul className="list-disc ml-7 text-gray-700 space-y-1 text-left">
                    {aiRecommendation.reasoning?.suggestions?.map((c: string, i: number) => (
                      <li className='mb-2' key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-center mt-8 gap-4">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Quay về trang chủ
                </Link>

                <Link
                  href="/quiz?retry=1"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Làm lại bài kiểm tra
                </Link>
                <button
                  disabled={loadingAI || !aiRecommendation?.recommendedTemplate}
                  onClick={() => {
                    if (aiRecommendation?.recommendedTemplate) {
                      router.push(`/template/${aiRecommendation.recommendedTemplate}`);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all
                    hover:from-green-600 hover:to-green-700 cursor-pointer
                    ${loadingAI || !aiRecommendation?.recommendedTemplate ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Target className="w-4 h-4" />
                  {loadingAI ? 'Đang lấy gợi ý...' : aiRecommendation?.recommendedTemplate ? 'Lấy mẫu kế hoạch dựa trên AI' : 'Không có gợi ý phù hợp'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Bước tiếp theo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Tạo kế hoạch</h4>
              <p className="text-sm text-blue-600 mt-1">Chọn mẫu kế hoạch phù hợp</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Theo dõi tiến độ</h4>
              <p className="text-sm text-green-600 mt-1">Ghi lại hành trình hàng ngày</p>
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
