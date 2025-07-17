"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home, RefreshCw, TrendingUp, Award, Target, Heart } from 'lucide-react';
import Link from 'next/link';

interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  completed_at: string;
  total_score: number;
  recommendations: string[];
}

export default function QuizResultsPage() {
  const t = useTranslations('quiz');
  const router = useRouter();
  const [results, setResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (err) {
        console.error('Failed to parse quiz results:', err);
      }
    } else {
      // If no results found, redirect back to quiz
      router.push('/quiz');
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-8 h-8 text-green-600" />;
    if (score >= 60) return <Target className="w-8 h-8 text-yellow-600" />;
    return <Heart className="w-8 h-8 text-red-600" />;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Tuyệt vời! Bạn có động lực cao để bỏ thuốc.';
    if (score >= 60) return 'Tốt! Bạn đang trên đường đúng để bỏ thuốc.';
    return 'Đừng lo lắng! Mọi hành trình đều bắt đầu từ bước đầu tiên.';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
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
            {t('thankYou')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8"
          >
            {t('results')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {getScoreIcon(results.total_score)}
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Điểm số: <span className={getScoreColor(results.total_score)}>
                    {results.total_score}/100
                  </span>
                </h3>
                <p className="text-gray-600 mt-1">
                  {getScoreMessage(results.total_score)}
                </p>
              </div>
            </div>

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-sky-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Gợi ý cho bạn</h3>
                </div>
                <div className="text-left space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              <Home className="w-4 h-4" />
              {t('backToHome')}
            </Link>
            
            <Link
              href="/quiz"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {t('retryQuiz')}
            </Link>

            <Link
              href="/template"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
            >
              <Target className="w-4 h-4" />
              Tạo kế hoạch
            </Link>
          </motion.div>
        </motion.div>

        {/* Additional Information Card */}
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
