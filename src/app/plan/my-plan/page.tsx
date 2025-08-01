"use client";

import { useEffect } from "react";
import Loading from "@/components/common/Loading";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Breadcrumbs from "@/components/common/BreadCrumb";
import ConfirmModal from "@/components/common/ModalConfirm";
import toast from "react-hot-toast";
import { useCustomStages } from "@/hooks/useCustomStage";
import { updateCessationPlan } from "@/services/cessationPlanService";
import { CessationPlanStatus } from "@/types/api/cessationPlan";
import { updatePlanStage } from "@/services/cessationPlanStageService";
import { motion } from "framer-motion";
import TemplateMyFeedbackBox from "@/components/feedback/myFeedbackTemplate";
import ProgressRecordTable from "@/components/processRecord/ProcessRecordTable";
import {
  getAvailablePlanStatusTransitions,
  getAvailableStageStatusTransitions,
  translatePlanStatus,
  translateStageStatus,
} from "@/utils";

import { useSearchParams } from "next/navigation";
import Link from "next/link";


function statusBadge(status: string, label?: string) {
  const colors: any = {
    PLANNING: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    ACTIVE: "bg-sky-200 text-sky-800 border border-sky-300",
    PAUSED: "bg-orange-100 text-orange-700 border border-orange-300",
    COMPLETED: "bg-green-200 text-green-700 border border-green-300",
    ABANDONED: "bg-gray-300 text-gray-700 border border-gray-400",
    CANCELLED: "bg-red-200 text-red-700 border border-red-300",
  };
  return (
    <span
      className={`ml-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${colors[status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}
    >
      {label || status}
    </span>
  );
}

function calcStageProgress(stages: any[]) {
  if (!stages?.length) return 0;
  const completed = stages.filter((s) => s.status === "COMPLETED").length;
  return Math.round((completed / stages.length) * 100);
}

function StatusButtonGroup({
  value,
  options,
  onChange,
  colorMap = {},
  translate,
  disabled,
  isOptionDisabled,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  colorMap?: { [key: string]: string };
  translate: (v: string) => string;
  disabled?: boolean;
  isOptionDisabled?: (status: string) => boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => {
        const isActive = value === option;
        const isDisabled = disabled || !!isOptionDisabled?.(option) || isActive;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            disabled={isDisabled}
            className={`px-3 py-1 rounded-full font-semibold border text-xs transition
              ${isActive
                ? `${colorMap[option] || "bg-sky-500 text-white"
                } border-sky-500`
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-sky-100 hover:text-sky-700"
              }
              ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {translate(option)}
          </button>
        );
      })}
    </div>
  );
}
export default function CustomStages() {
  const {
    plans,
    loading,
    loadingAction,
    editingStage,
    customForm,
    creating,
    newStage,
    deleteStageId,
    toastMsg,
    toastType,
    handleEdit,
    handleChange,
    handleCustomSave,
    handleStartCreate,
    handleCreate,
    handleDeleteStage,
    setCreating,
    setDeleteStageId,
    setToastMsg,
    setToastType,
    fetchPlans,
    PLAN_STATUS_OPTIONS,
    STAGE_STATUS_OPTIONS,
  } = useCustomStages();

  const searchParams = useSearchParams();
  const planIdFromUrl = searchParams.get("planId");

  useEffect(() => {
    if (toastMsg) {
      if (toastType === "success") toast.success(toastMsg);
      else if (toastType === "error") toast.error(toastMsg);
      setToastMsg(null);
      setToastType(null);
    }
  }, [toastMsg, toastType, setToastMsg, setToastType]);

  useEffect(() => {
    if (planIdFromUrl && plans.length > 0) {
      const targetPlanElement = document.getElementById(
        `plan-${planIdFromUrl}`
      );
      if (targetPlanElement) {
        targetPlanElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [planIdFromUrl, plans]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!plans.length)
    return (
      <div className="text-center text-red-500 py-20">
        Không tìm thấy kế hoạch nào.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Mẫu kế hoạch", href: "/template" },
          { label: "Kế hoạch của bạn", active: true },
        ]}
      />

      {plans.map((plan, i) => {
        const progress = calcStageProgress(plan.stages);
        const isCancelled = plan.status === "CANCELLED";
        return (
          <motion.div
            key={plan.id}
            id={`plan-${plan.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, type: "spring" }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
            style={{ boxShadow: "0 2px 32px 0 #1E90FF10" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-extrabold text-sky-700">
                {plan.template?.name}
              </h1>
              {plan.status && statusBadge(plan.status, translatePlanStatus(plan.status))}
            </div>
            <div className="text-gray-700 mb-1">
              <b>Lý do bắt đầu:</b> {plan.reason}
            </div>
            <div className="flex flex-wrap gap-4 mb-2 text-gray-600">
              <div>
                <b>Ngày bắt đầu:</b>{" "}
                {new Date(plan.start_date).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <b>Ngày mục tiêu:</b>{" "}
                {new Date(plan.target_date).toLocaleDateString("vi-VN")}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3">
                <b className="min-w-[80px]">Tiến độ:</b>
                <div className="flex-1 relative h-5 rounded-full bg-sky-100 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-400 to-green-400 transition-all"
                    style={{ width: `${plan.completion_percentage ?? 0}%` }}
                  ></div>
                </div>
                <span className="min-w-[50px] text-right text-sky-700 font-bold">
                  {(plan.completion_percentage ?? 0).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <label className="block font-bold mb-1">
                Chuyển trạng thái:
              </label>
              {/* PLAN STATUS BUTTONS */}
              {(() => {
                if (plan.status === "PLANNING") {
                  return (
                    <StatusButtonGroup
                      value={plan.status}
                      options={["ACTIVE", "CANCELLED"]}
                      onChange={async (newStatus) => {
                        try {
                          await updateCessationPlan({
                            id: plan.id,
                            status: newStatus as CessationPlanStatus,
                          });
                          toast.success("Cập nhật trạng thái thành công!");
                          await fetchPlans();
                        } catch (err: any) {
                          toast.error(err.message || "Cập nhật thất bại!");
                        }
                      }}
                      colorMap={{
                        ACTIVE: "bg-sky-500 text-white",
                        CANCELLED: "bg-red-400 text-white",
                      }}
                      translate={translatePlanStatus}
                      disabled={loadingAction}
                    />
                  );
                }
                if (plan.status === "ACTIVE" || plan.status === "ABANDONED") {
                  return (
                    <StatusButtonGroup
                      value={plan.status}
                      options={["CANCELLED"]}
                      onChange={async (newStatus) => {
                        try {
                          await updateCessationPlan({
                            id: plan.id,
                            status: newStatus as CessationPlanStatus,
                          });
                          toast.success("Cập nhật trạng thái thành công!");
                          await fetchPlans();
                        } catch (err: any) {
                          toast.error(err.message || "Cập nhật thất bại!");
                        }
                      }}
                      colorMap={{
                        CANCELLED: "bg-red-400 text-white",
                      }}
                      translate={translatePlanStatus}
                      disabled={loadingAction}
                    />
                  );
                }
                return null;
              })()}
            </div>

            {/* Hiển thị thông báo nếu kế hoạch bị bỏ dở */}
            {plan.status === "ABANDONED" && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                  <span className="text-lg">⚠️</span>
                  Kế hoạch của bạn đang bị bỏ dở. Hãy thêm tiến trình mới để tiếp tục kế hoạch!
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Bạn có thể thêm ghi nhận mới hoặc cập nhật các giai đoạn để kích hoạt lại kế hoạch này.
                </p>
              </div>
            )}

            {!isCancelled && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-xl text-sky-700 flex items-center gap-2">
                    Các giai đoạn của kế hoạch
                  </h3>
                  {plan.is_custom && (
                    <button
                      onClick={() => handleStartCreate(plan.id, plan.stages)}
                      className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer transition"
                      disabled={!!creating[plan.id]}
                      type="button"
                    >
                      <Plus size={18} /> Thêm giai đoạn
                    </button>
                  )}
                </div>

                {plan.is_custom && (
                  <div className="mb-6 text-gray-500 text-center italic">
                    Bạn có thể thêm hoặc chỉnh sửa các giai đoạn cho phù hợp với bản
                    thân.
                  </div>
                )}

                <ul className="space-y-4">
                  {plan.is_custom && creating[plan.id] && (
                    <li className="bg-white border rounded-xl p-6 flex-col gap-2">
                      <form
                        onSubmit={(e) => handleCreate(plan.id, e)}
                        className="flex flex-col gap-2"
                      >
                        <input
                          name="title"
                          value={newStage[plan.id]?.title || ""}
                          onChange={(e) => handleChange(plan.id, e)}
                          placeholder="Tên giai đoạn"
                          className="border rounded-xl px-4 py-2 text-base"
                          required
                        />
                        <input
                          type="date"
                          name="start_date"
                          value={newStage[plan.id]?.start_date?.slice(0, 10) || ""}
                          onChange={(e) => handleChange(plan.id, e)}
                          className="border rounded-xl px-4 py-2 text-base"
                        />
                        <input
                          type="date"
                          name="end_date"
                          value={newStage[plan.id]?.end_date?.slice(0, 10) || ""}
                          onChange={(e) => handleChange(plan.id, e)}
                          className="border rounded-xl px-4 py-2 text-base"
                        />
                        <textarea
                          name="description"
                          value={newStage[plan.id]?.description || ""}
                          onChange={(e) => handleChange(plan.id, e)}
                          placeholder="Mô tả"
                          className="border rounded-xl px-4 py-2 text-base"
                        />
                        <input
                          type="number"
                          name="stage_order"
                          placeholder="Thứ tự giai đoạn"
                          min={1}
                          value={newStage[plan.id]?.stage_order || 1}
                          onChange={(e) => handleChange(plan.id, e)}
                          className="border rounded-xl px-4 py-2 text-base"
                          required
                        />
                        <input
                          name="actions"
                          value={newStage[plan.id]?.actions || ""}
                          onChange={(e) => handleChange(plan.id, e)}
                          placeholder="Hành động"
                          className="border rounded-xl px-4 py-2 text-base"
                        />
                        <div className="flex gap-3 mt-1">
                          <button
                            type="submit"
                            className="bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-1 font-semibold cursor-pointer transition"
                          >
                            {loadingAction ? <Loading color="#fff" /> : "Lưu"}
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 underline cursor-pointer"
                            onClick={() =>
                              setCreating((prev) => ({ ...prev, [plan.id]: false }))
                            }
                            disabled={loadingAction}
                          >
                            Huỷ
                          </button>
                        </div>
                      </form>
                    </li>
                  )}

                  {plan.stages.map((stage, j) =>
                    plan.is_custom &&
                      editingStage[plan.id] === stage.id &&
                      customForm[plan.id] ? (
                      <li
                        key={stage.id}
                        className="bg-white border rounded-xl p-4 shadow flex flex-col gap-2"
                      >
                        <form
                          onSubmit={(e) => handleCustomSave(plan.id, e)}
                          className="flex flex-col gap-2"
                        >
                          <input
                            name="title"
                            value={customForm[plan.id]?.title || ""}
                            onChange={(e) => handleChange(plan.id, e)}
                            placeholder="Tên giai đoạn"
                            className="border rounded px-2 py-2 text-base"
                            required
                          />
                          <input
                            type="date"
                            name="start_date"
                            value={
                              customForm[plan.id]?.start_date?.slice(0, 10) || ""
                            }
                            onChange={(e) => handleChange(plan.id, e)}
                            className="border rounded px-2 py-2 text-base"
                          />
                          <input
                            type="date"
                            name="end_date"
                            value={
                              customForm[plan.id]?.end_date?.slice(0, 10) || ""
                            }
                            onChange={(e) => handleChange(plan.id, e)}
                            className="border rounded px-2 py-2 text-base"
                          />
                          <textarea
                            name="description"
                            value={customForm[plan.id]?.description || ""}
                            onChange={(e) => handleChange(plan.id, e)}
                            className="border rounded px-2 py-2 text-base"
                          />
                          <input
                            name="actions"
                            value={customForm[plan.id]?.actions || ""}
                            onChange={(e) => handleChange(plan.id, e)}
                            className="border rounded px-2 py-2 text-base"
                          />
                          <div className="flex gap-3 mt-1">
                            <button
                              type="submit"
                              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-1 font-semibold cursor-pointer transition"
                            >
                              {loadingAction ? <Loading color="#fff" /> : "Lưu"}
                            </button>
                            <button
                              type="button"
                              className="text-gray-500 underline cursor-pointer"
                              onClick={() => handleEdit(plan.id, stage)}
                              disabled={loadingAction}
                            >
                              Huỷ
                            </button>
                          </div>
                        </form>
                      </li>
                    ) : (
                      <motion.li
                        key={stage.id}
                        initial={{ opacity: 0, x: 32 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.09 + 0.12 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-4 rounded-2xl shadow flex justify-between items-center border border-blue-100 hover:shadow-lg transition"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>
                              <b>Bắt đầu:</b>{" "}
                              {stage.start_date
                                ? new Date(stage.start_date).toLocaleDateString(
                                  "vi-VN"
                                )
                                : "Chưa thiết lập"}
                            </span>
                            <span>
                              <b>Kết thúc:</b>{" "}
                              {stage.end_date
                                ? new Date(stage.end_date).toLocaleDateString(
                                  "vi-VN"
                                )
                                : "Chưa thiết lập"}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                                    ${stage.status === "COMPLETED"
                                  ? "bg-green-200 text-green-700"
                                  : stage.status === "ACTIVE"
                                    ? "bg-sky-200 text-sky-700"
                                    : stage.status === "SKIPPED"
                                      ? "bg-gray-200 text-gray-500"
                                      : "bg-gray-100 text-gray-600"
                                }`}
                            >
                              {translateStageStatus(stage.status ?? "")}
                            </span>
                          </div>

                          <div className="text-sky-700 text-lg mt-2">
                            <b>
                              Giai đoạn {stage.stage_order}: {stage.title}
                            </b>
                          </div>
                          <div className="text-sm mt-4">
                            <b className="text-gray-500">Mô tả:</b>
                            <span className="ml-2">{stage.description}</span>
                          </div>
                          {typeof stage.max_cigarettes_per_day === 'number' && (
                            <div className="text-xs text-red-600 mt-1">
                              Số điếu tối đa/ngày: <b>{stage.max_cigarettes_per_day}</b>
                            </div>
                          )}

                          {/* <div className="mt-2 flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-500">
                              Trạng thái:
                            </label>
                            <StatusButtonGroup
                              value={stage.status || "PENDING"}
                              options={STAGE_STATUS_OPTIONS}
                              onChange={async (newStatus) => {
                                try {
                                  await updatePlanStage({
                                    id: stage.id,
                                    status: newStatus,
                                  });
                                  toast.success(
                                    "Cập nhật trạng thái giai đoạn thành công!"
                                  );
                                  await fetchPlans();
                                } catch (err: any) {
                                  toast.error(
                                    err.message || "Cập nhật trạng thái thất bại!"
                                  );
                                }
                              }}
                              colorMap={{
                                PENDING: "bg-gray-200 text-gray-700",
                                ACTIVE: "bg-sky-500 text-white",
                                COMPLETED: "bg-green-600 text-white",
                                SKIPPED: "bg-gray-400 text-white",
                              }}
                              translate={translateStageStatus}
                              disabled={
                                loadingAction ||
                                getAvailableStageStatusTransitions(
                                  stage.status || ""
                                ).length === 0
                              }
                              isOptionDisabled={(status) =>
                                status !== stage.status &&
                                !getAvailableStageStatusTransitions(
                                  stage.status || ""
                                ).includes(status)
                              }
                            />
                          </div> */}

                          {stage.actions && (
                            <div className="text-sm mt-2">
                              <b className="text-gray-500">Hành động:</b>
                              <span className="ml-2">{stage.actions}</span>
                            </div>
                          )}
                        </div>
                        {/* STAGE STATUS BUTTONS */}
                        {stage.status === "ACTIVE" && (
                          <div className="flex gap-2">
                            <StatusButtonGroup
                              value={stage.status}
                              options={["COMPLETED"]}
                              onChange={async (newStatus) => {
                                try {
                                  await updatePlanStage({
                                    id: stage.id,
                                    status: newStatus,
                                  });
                                  toast.success(
                                    "Cập nhật trạng thái giai đoạn thành công!"
                                  );
                                  await fetchPlans();
                                } catch (err: any) {
                                  toast.error(
                                    err.message || "Cập nhật trạng thái thất bại!"
                                  );
                                }
                              }}
                              colorMap={{
                                COMPLETED: "bg-green-600 text-white",
                              }}
                              translate={translateStageStatus}
                              disabled={loadingAction}
                            />
                          </div>
                        )}
                        {plan.is_custom && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(plan.id, stage)}
                              className="text-sky-600 hover:text-sky-800 p-2 rounded-full transition cursor-pointer"
                              title="Chỉnh sửa giai đoạn"
                              type="button"
                            >
                              <Pencil size={20} />
                            </button>
                            <button
                              onClick={() => setDeleteStageId(stage.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full transition cursor-pointer"
                              title="Xoá giai đoạn"
                              type="button"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        )}
                      </motion.li>
                    )
                  )}
                </ul>

                <TemplateMyFeedbackBox templateId={plan.template?.id} />

                <div className={`${plan.status === "COMPLETED" ? "opacity-50 pointer-events-none mt-4" : ""}`}>
                  {plan.status === "COMPLETED" && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <span className="text-lg">✅</span>
                        Kế hoạch đã hoàn thành
                      </div>
                      <p className="text-green-600 text-sm mt-1">
                        Bạn đã hoàn thành tất cả các giai đoạn của kế hoạch này.
                      </p>
                    </div>
                  )}
                  <ProgressRecordTable
                    planId={plan.id}
                    coachId={plan.template.coach_id}
                    onRecordAdded={fetchPlans}
                  />
                </div>

                {plan.status === "COMPLETED" && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-sky-50 to-green-50 border border-sky-200 rounded-xl">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-sky-700 mb-2">
                        🎉 Chúc mừng bạn đã hoàn thành!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Bạn đã chứng minh được sự kiên trì và quyết tâm của mình.
                        Hãy tiếp tục duy trì thành quả này!
                      </p>
                      <Link
                        href="/template"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5" />
                        Tạo một kế hoạch khác
                      </Link>
                      <p className="text-sm text-gray-500 mt-3">
                        Nếu bạn muốn thử thách tiếp với template khác
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        );
      })}



      <ConfirmModal
        open={!!deleteStageId}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xoá giai đoạn này không?"
        onCancel={() => setDeleteStageId(null)}
        onConfirm={handleDeleteStage}
      />
    </div>
  );
}
