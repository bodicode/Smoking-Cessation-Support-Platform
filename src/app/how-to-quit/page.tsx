'use client';

import Breadcrumbs from "@/components/common/BreadCrumb";
import Image from "next/image";

export default function HowToQuit() {
    const steps = [
        {
            title: "Bước 1: Xác định lý do bỏ thuốc",
            desc: "Hãy viết ra những lý do quan trọng nhất khiến bạn muốn bỏ thuốc (vì sức khỏe, gia đình, tiết kiệm tiền, ...). Điều này sẽ giúp bạn có động lực mạnh mẽ hơn trong suốt quá trình cai nghiện.",
        },
        {
            title: "Bước 2: Lên kế hoạch cụ thể",
            desc: "Chọn một ngày bắt đầu bỏ thuốc và chuẩn bị tâm lý cho ngày đó. Hãy thông báo với người thân, bạn bè để nhận được sự ủng hộ.",
        },
        {
            title: "Bước 3: Loại bỏ thuốc lá và vật dụng liên quan",
            desc: "Vứt bỏ tất cả thuốc lá, bật lửa, gạt tàn... để giảm cám dỗ. Làm sạch không gian sống, xe hơi, nơi làm việc khỏi mùi thuốc.",
        },
        {
            title: "Bước 4: Tìm kiếm sự hỗ trợ",
            desc: "Tham gia các nhóm hỗ trợ, chia sẻ với người thân, bạn bè hoặc chuyên gia để nhận được lời khuyên, động viên khi gặp khó khăn.",
        },
        {
            title: "Bước 5: Đối phó với cơn thèm thuốc",
            desc: "Khi cảm thấy thèm thuốc, hãy thử uống nước, nhai kẹo cao su, đi dạo, tập thể dục hoặc làm việc gì đó để phân tán sự chú ý.",
        },
        {
            title: "Bước 6: Ghi nhận tiến trình và tự thưởng cho bản thân",
            desc: "Theo dõi quá trình bỏ thuốc, ghi nhận những ngày không hút thuốc và tự thưởng cho bản thân khi đạt được cột mốc quan trọng.",
        },
        {
            title: "Bước 7: Kiên trì và không bỏ cuộc",
            desc: "Nếu lỡ hút lại, đừng nản lòng. Hãy xem đó là bài học và tiếp tục cố gắng. Thành công sẽ đến với người kiên trì!",
        },
    ];

    return (
        <div className="min-h-screen py-10">
            <div className="flex justify-center">
                <Breadcrumbs
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Cách bỏ thuốc", active: true }
                    ]}
                />
            </div>
            <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl px-4 md:px-12 py-10">
                <h1 className="text-4xl font-bold text-[#60C3A4] mb-4 text-center">Cách bỏ thuốc</h1>
                <p className="text-lg text-center text-gray-600 mb-10">Cách bỏ thuốc lá hiệu quả nhất và an toàn nhất</p>
                <div className="space-y-12">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col md:flex-row ${idx % 2 === 1 ? "md:flex-row-reverse" : ""} items-center gap-8`}
                        >
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-[#60C3A4] mb-2">{step.title}</h2>
                                <p className="text-gray-700 text-lg">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
