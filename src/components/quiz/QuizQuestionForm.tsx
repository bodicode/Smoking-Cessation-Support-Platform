import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { CreateQuizQuestionInput, QuestionType } from "@/types/api/quiz";
import toast from "react-hot-toast";
import { SuccessToast } from "@/components/common/CustomToast";

interface QuizQuestionFormProps {
  quizId: string;
  onClose: () => void; // Sửa lại tên prop cho đúng chức năng
  createQuizQuestion?: (input: CreateQuizQuestionInput) => Promise<any>;
  onCreated?: () => void;
  question?: any;
  onUpdated?: () => void;
  updateQuizQuestion?: (input: any) => Promise<any>;
}

const QuizQuestionForm: React.FC<QuizQuestionFormProps> = ({
  quizId,
  onClose,
  createQuizQuestion,
  onCreated,
  question,
  onUpdated,
  updateQuizQuestion,
}) => {
  const [questionText, setQuestionText] = useState(
    question?.question_text || ""
  );
  const [description, setDescription] = useState(question?.description || "");
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.question_type || "NUMBER"
  );
  const [options, setOptions] = useState(question?.options?.join(", ") || "");
  const [order, setOrder] = useState(question?.order || 1);
  const [isRequired, setIsRequired] = useState(question?.is_required ?? true);
  const [validationRule, setValidationRule] = useState(
    question?.validation_rule ? JSON.stringify(question.validation_rule) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let parsedOptions: string[] | undefined = undefined;
      if (["MULTIPLE_CHOICE", "SCALE", "BOOLEAN"].includes(questionType)) {
        parsedOptions = options
          .split(",")
          .map((opt: string) => opt.trim())
          .filter(Boolean);
      }
      let parsedValidation: any = undefined;
      if (validationRule) {
        try {
          parsedValidation = JSON.parse(validationRule);
        } catch {
          setError("Quy tắc hợp lệ phải là chuỗi JSON hợp lệ.");
          setLoading(false);
          return;
        }
      }
      if (question && updateQuizQuestion) {
        await updateQuizQuestion({
          id: question.id,
          quiz_id: quizId,
          question_text: questionText,
          description,
          question_type: questionType,
          options: parsedOptions,
          order: Number(order),
          is_required: isRequired,
          validation_rule: parsedValidation,
        });
        setSuccess("Cập nhật câu hỏi thành công!");
        toast.custom(<SuccessToast message="Cập nhật câu hỏi thành công!" />);
        if (onUpdated) onUpdated();
      } else if (createQuizQuestion) {
        await createQuizQuestion({
          quiz_id: quizId,
          question_text: questionText,
          description,
          question_type: questionType,
          options: parsedOptions,
          order: Number(order),
          is_required: isRequired,
          validation_rule: parsedValidation,
        });
        setSuccess("Thêm câu hỏi mới thành công!");
        toast.custom(<SuccessToast message="Thêm câu hỏi mới thành công!" />);
        setQuestionText("");
        setDescription("");
        setOptions("");
        setOrder(1);
        setIsRequired(true);
        setValidationRule("");
        if (onCreated) onCreated();
      }
    } catch (err: any) {
      let msg = err.message || "Lưu câu hỏi thất bại";
      if (msg.includes("Order already exists")) {
        msg = "Đã có câu hỏi ở thứ tự này. Vui lòng chọn thứ tự khác.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuestionType(e.target.value as QuestionType);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
      >
        {/* Nút X đóng modal */}
        <button
          className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
          type="button"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-[#03256c] mb-6">
          {question ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới vào bài kiểm tra"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nội dung câu hỏi
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              placeholder="Nhập câu hỏi..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mô tả (nếu có)
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả thêm về câu hỏi (không bắt buộc)"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Loại câu hỏi
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition"
              value={questionType}
              onChange={handleQuestionTypeChange}
            >
              <option value="NUMBER">Số (NUMBER)</option>
              <option value="SCALE">Thang điểm (SCALE)</option>
              <option value="MULTIPLE_CHOICE">
                Chọn đáp án (MULTIPLE_CHOICE)
              </option>
              <option value="BOOLEAN">Đúng/Sai (BOOLEAN)</option>
            </select>
          </div>

          {["MULTIPLE_CHOICE", "SCALE", "BOOLEAN"].includes(questionType) && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Các lựa chọn{" "}
                <span className="text-gray-400 text-sm">
                  (cách nhau bằng dấu phẩy)
                </span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="Lựa chọn 1, Lựa chọn 2, Lựa chọn 3"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Thứ tự
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={1}
                required
              />
            </div>

            <div className="flex items-center h-full pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="w-4 h-4 text-[#60c3a4] rounded focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-gray-700">Bắt buộc trả lời</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Quy tắc hợp lệ{" "}
              <span className="text-gray-400 text-sm">
                (dạng JSON, ví dụ: {'{"min":0,"max":100}'})
              </span>
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition font-mono text-sm"
              value={validationRule}
              onChange={(e) => setValidationRule(e.target.value)}
              placeholder='{"min":0,"max":100,"message":"Thông báo lỗi"}'
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Đóng
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#60c3a4] to-[#4ca885] text-white font-medium hover:from-[#4ca885] hover:to-[#3a9670] transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {question ? "Đang lưu..." : "Đang tạo..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {question ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {question ? "Lưu thay đổi" : "Thêm câu hỏi"}
                </span>
              )}
            </motion.button>
          </div>
        </form>

        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizQuestionForm;
