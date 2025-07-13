'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { CreateBadgeInput } from "@/types/api/badge";
import { gql, useQuery } from "@apollo/client";
import RequirementForm from "./RequirementForm";
import { GET_BADGE_TYPES } from "@/graphql/queries/badgesType/getBadgesType";
import Loading from "../common/Loading";

const badgeTypeCriteriaMap: Record<string, string> = {
    "057e393f-4ad6-4d71-b9de-2219300375bb": "streak",
    "293b1519-6dac-4dab-817f-d90cb72b7223": "streak",
    "f8a9f979-e255-4695-823a-b71e6b1041eb": "streak",
    "6b948cc9-c9ca-4402-b31e-ca20b7ad518c": "streak",
    "48a58d46-f207-4949-b464-e90d89c09f1d": "streak",
    "c2f1fb64-a2a5-47d4-859d-db37a8633e4e": "first_plan_created",
};

async function uploadImage(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });
}

interface Props {
    onSubmit: (badge: CreateBadgeInput) => Promise<void>;
    onCancel: () => void;
}

export default function CreateBadgeForm({ onSubmit, onCancel }: Props) {
    const { data, loading } = useQuery(GET_BADGE_TYPES);
    const badgeTypes = data?.badgeTypes?.data ?? [];

    const [imgError, setImgError] = useState("");

    const [newBadge, setNewBadge] = useState<CreateBadgeInput>({
        name: "",
        description: "",
        sort_order: 1,
        icon_url: "",
        badge_type_id: "",
        requirements: ""
    });

    const criteria_type = badgeTypeCriteriaMap[newBadge.badge_type_id] || "";

    const requiresRequirement = criteria_type !== "first_plan_created";

    return (
        <div className="mb-6 bg-white p-4 rounded shadow w-full">
            <h2 className="text-lg font-bold mb-2">Tạo huy hiệu mới</h2>
            <input
                type="text"
                placeholder="Tên huy hiệu"
                value={newBadge.name}
                onChange={e => setNewBadge(v => ({ ...v, name: e.target.value }))}
                className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
                type="text"
                placeholder="Mô tả"
                value={newBadge.description}
                onChange={e => setNewBadge(v => ({ ...v, description: e.target.value }))}
                className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
                type="number"
                placeholder="Thứ tự hiển thị"
                value={newBadge.sort_order}
                onChange={e => setNewBadge(v => ({ ...v, sort_order: Number(e.target.value) }))}
                className="border px-3 py-2 rounded w-full mb-2"
            />

            <select
                className="border px-3 py-2 rounded w-full mb-2"
                value={newBadge.badge_type_id}
                onChange={e => setNewBadge(v => ({
                    ...v,
                    badge_type_id: e.target.value,
                    requirements: ""
                }))}
            >
                <option value="">Chọn loại badge</option>
                {badgeTypes.map((bt: any) => (
                    <option value={bt.id} key={bt.id}>{bt.name}</option>
                ))}
            </select>

            {newBadge.badge_type_id && (
                <RequirementForm
                    criteriaType={criteria_type}
                    value={newBadge.requirements || ""}
                    onChange={val => setNewBadge(v => ({ ...v, requirements: val }))}
                />
            )}
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setImgError("");
                        const url = await uploadImage(file);
                        setNewBadge(v => ({ ...v, icon_url: url }));
                    }
                }}
                className="mb-2 cursor-pointer"
            />
            {!newBadge.icon_url && imgError && (
                <div className="text-red-500 text-xs mb-2">{imgError}</div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => {
                        if (!newBadge.name) {
                            toast.error("Vui lòng nhập tên huy hiệu!");
                            return;
                        }
                        if (!newBadge.description) {
                            toast.error("Vui lòng nhập mô tả!");
                            return;
                        }
                        if (!newBadge.badge_type_id) {
                            toast.error("Vui lòng chọn loại badge!");
                            return;
                        }
                        if (!newBadge.icon_url) {
                            toast.error("Vui lòng chọn ảnh icon cho badge!");
                            return;
                        }
                        if (requiresRequirement && !newBadge.requirements) {
                            toast.error("Vui lòng nhập điều kiện cho loại badge này!");
                            return;
                        }
                        onSubmit(newBadge);
                    }}
                    className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={loading}
                >
                    {loading ? <Loading color="#FFFFF" /> : "Lưu"}
                </button>


                <button
                    onClick={onCancel}
                    className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                    Hủy
                </button>
            </div>

            {newBadge.badge_type_id && requiresRequirement && !newBadge.requirements && (
                <div className="text-red-500 text-xs mb-2">
                    Vui lòng nhập điều kiện cho loại badge này!
                </div>
            )}
        </div>
    );
}
