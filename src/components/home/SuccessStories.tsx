"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
    {
        text: "ReAir luôn là chỗ dựa mỗi khi tôi cảm thấy khó khăn trên hành trình cai thuốc.",
        name: "Nguyễn Văn A.",
    },
    {
        text: "Họ hoàn toàn không phán xét gì cả, và cách tiếp cận linh hoạt, không rập khuôn chính là chìa khóa giúp tôi thành công.",
        name: "Nguyễn Văn B.",
    },
    {
        text: "Nhờ ReAir, tôi luôn có cảm giác có người đang ủng hộ mình..",
        name: "Nguyễn Văn C.",
    },
    {
        text: "Chương trình thực sự là một trợ giúp tuyệt vời cho tôi. Những tin nhắn đó nhắc tôi không bỏ cuộc.",
        name: "Nguyễn Văn C.",
    },
    {
        text: "Các huấn luyện viên cai thuốc đã giúp tôi thành công và luôn giữ được động lực. Một người từng nói với tôi: “Bạn sẽ làm được mà.”",
        name: "Nguyễn Văn D.",
    },
    {
        text: "Tôi không nghĩ mình có thể bỏ thuốc, nhưng sự hỗ trợ tận tình từ đội ngũ đã thay đổi mọi thứ. Họ luôn ở đó khi tôi cần.",
        name: "Nguyễn Văn E.",
    },
    {
        text: "Mỗi tin nhắn, mỗi lời động viên khiến tôi cảm thấy mình không đơn độc. Tôi biết mình có thể vượt qua.",
        name: "Nguyễn Văn V.",
    },
];

const SuccessStories = () => {
    const [start, setStart] = useState(0);
    const visibleCards = 4;

    const handlePrev = () => {
        setStart((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setStart((prev) =>
            Math.min(prev + 1, testimonials.length - visibleCards)
        );
    };

    return (
        <section className="bg-orange-400 py-12 px-4">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">
                Những câu chuyện thành công
            </h2>
            <div className="flex justify-center gap-6 overflow-hidden">
                {testimonials.slice(start, start + visibleCards).map((t, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-6 w-64 min-h-[280px] ${i % 2 === 1 ? "bg-blue-900 text-white" : "bg-white text-blue-900"
                            }`}
                    >
                        <div className="text-4xl leading-none mb-4">“</div>
                        <p className="text-lg font-medium mb-4 min-h-[200px]">{t.text}</p>
                        <p className="italic font-semibold">–{t.name}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-10">
                <button
                    onClick={handlePrev}
                    className="bg-blue-900 text-white rounded-full p-2 hover:bg-blue-800 cursor-pointer"
                >
                    <ArrowLeft />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-blue-900 text-white rounded-full p-2 hover:bg-blue-800 cursor-pointer"
                >
                    <ArrowRight />
                </button>
            </div>
        </section>
    );
};

export default SuccessStories;
