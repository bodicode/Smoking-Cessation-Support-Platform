import React from 'react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: {
    id: string;
    question_text: string;
    description?: string;
    question_type: 'NUMBER' | 'SCALE' | 'MULTIPLE_CHOICE' | 'BOOLEAN' | 'TEXT';
    options?: string[];
    is_required: boolean;
    validation_rule?: any;
  };
  answer: any;
  onAnswer: (answer: any) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onAnswer }) => {
  const renderInput = () => {
    switch (question.question_type) {
      case 'NUMBER':
        return (
          <div className="space-y-2">
            <input
              type="number"
              value={answer || ''}
              onChange={(e) => onAnswer(Number(e.target.value))}
              min={question.validation_rule?.min || 0}
              max={question.validation_rule?.max || 100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Nhập số..."
            />
            {question.validation_rule?.message && (
              <p className="text-sm text-gray-500">{question.validation_rule.message}</p>
            )}
          </div>
        );

      case 'BOOLEAN':
        const boolOptions = question.options ?? ['Có', 'Không'];
        return (
          <div className="space-y-3">
            {boolOptions.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(option === 'Có' ? true : false)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  (answer === true && option === 'Có') || (answer === false && option === 'Không')
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    (answer === true && option === 'Có') || (answer === false && option === 'Không')
                      ? 'border-sky-500 bg-sky-500' 
                      : 'border-gray-300'
                  }`}>
                    {((answer === true && option === 'Có') || (answer === false && option === 'Không')) && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const checked = Array.isArray(answer) && answer.includes(option);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!Array.isArray(answer)) {
                      onAnswer([option]);
                    } else if (checked) {
                      onAnswer(answer.filter((item: string) => item !== option));
                    } else {
                      onAnswer([...answer, option]);
                    }
                  }}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    checked
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border-2 transition-all ${
                      checked ? 'border-sky-500 bg-sky-500' : 'border-gray-300'
                    }`}>
                      {checked && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      case 'SCALE':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {question.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAnswer(index + 1)}
                  className={`p-4 text-left border-2 rounded-lg transition-all ${
                    answer === index + 1
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      answer === index + 1 ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'TEXT':
        if (question.description === 'Tên thương hiệu thuốc lá bạn thường xuyên mua') {
          const brands = [
            'Vinataba', 'Thăng Long', 'Sài Gòn', 'Bastos', '555', 'Hero', 'Craven A', 'White Horse', 'Ruby', 'Zest', 'Khánh Hội', 'Điện Biên', 'Hà Nội', 'Khánh Hội', 'Khánh Hòa', 'Khánh Bình', 'Khánh Vĩnh', 'Khánh Sơn', 'Khánh Nam', 'Khánh Trung', 'Khánh Đông', 'Khánh Tây', 'Khánh Bắc', 'Khánh Nam', 'Khánh Phú', 'Khánh An', 'Khánh Bình', 'Khánh Hòa', 'Khánh Hội', 'Khánh Lâm', 'Khánh Lộc', 'Khánh Mỹ', 'Khánh Phong', 'Khánh Sơn', 'Khánh Thạnh', 'Khánh Thịnh', 'Khánh Tiến', 'Khánh Toàn', 'Khánh Trung', 'Khánh Vĩnh', 'Khánh Xuân', 'Khánh Yên', 'Khánh Hòa', 'Khánh Hội', 'Khánh Lâm', 'Khánh Lộc', 'Khánh Mỹ', 'Khánh Phong', 'Khánh Sơn', 'Khánh Thạnh', 'Khánh Thịnh', 'Khánh Tiến', 'Khánh Toàn', 'Khánh Trung', 'Khánh Vĩnh', 'Khánh Xuân', 'Khánh Yên', 'Khác'
          ];
          return (
            <div className="space-y-2">
              <select
                value={answer || ''}
                onChange={e => onAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn thương hiệu...</option>
                {brands.map((b, index) => (
                  <option key={index} value={b}>{b}</option>
                ))}
              </select>
              {question.validation_rule?.message && (
                <p className="text-sm text-gray-500">{question.validation_rule.message}</p>
              )}
            </div>
          );
        }
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => onAnswer(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Nhập câu trả lời..."
            />
            {question.validation_rule?.message && (
              <p className="text-sm text-gray-500">{question.validation_rule.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {question.question_text}
          {question.is_required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {question.description && (
          <p className="text-gray-600">{question.description}</p>
        )}
      </div>

      {renderInput()}
    </motion.div>
  );
};

export default QuestionCard;
