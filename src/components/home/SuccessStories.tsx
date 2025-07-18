'use client'

import { motion } from 'framer-motion';

const stories = [
  {
    text: "Tôi đã bỏ thuốc sau 20 năm nhờ sự hỗ trợ tận tình từ nền tảng này. Sức khỏe của tôi cải thiện rõ rệt và tôi cảm thấy tự tin hơn mỗi ngày!",
    name: "Nguyễn Văn A"
  },
  {
    text: "Nhờ các kế hoạch cá nhân hóa, tôi đã vượt qua được những lúc thèm thuốc khó khăn nhất. Cảm ơn đội ngũ rất nhiều!",
    name: "Trần Thị B"
  },
  {
    text: "Cộng đồng hỗ trợ rất tuyệt vời, tôi luôn nhận được động viên và chia sẻ kinh nghiệm từ mọi người.",
    name: "Lê Văn C"
  },
  {
    text: "Ứng dụng dễ sử dụng, các lời khuyên thực tế và hữu ích. Tôi đã tiết kiệm được rất nhiều tiền sau khi bỏ thuốc!",
    name: "Phạm Thị D"
  },
  {
    text: "Tôi từng nghĩ mình không thể bỏ thuốc, nhưng nhờ nền tảng này tôi đã làm được. Cảm ơn rất nhiều!",
    name: "Hoàng Văn E"
  },
  {
    text: "Các bài viết và công cụ theo dõi tiến trình giúp tôi luôn có động lực mỗi ngày.",
    name: "Đặng Thị F"
  },
  {
    text: "Tôi đã bỏ thuốc thành công sau 15 năm nghiện. Gia đình tôi rất hạnh phúc và tự hào về tôi!",
    name: "Vũ Minh G"
  },
];

export default function SuccessStories() {
    return (
        <section className="py-8 px-2 sm:py-12 sm:px-4">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">
                Câu chuyện thành công
            </h2>
            <div
                className="
                    flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto scrollbar-hide
                    snap-x snap-mandatory
                    pb-4
                "
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {stories.map((story, idx) => (
                    <motion.div
                        key={idx}
                        className={
                            `snap-center rounded-xl p-4 sm:p-6 w-[90vw] max-w-[340px] sm:w-60 md:w-72 min-h-[200px] sm:min-h-[250px] flex flex-col justify-between ` +
                            (idx % 2 === 1 ? 'bg-[#004F7C] text-white' : 'bg-white text-blue-900') + ' shadow'
                        }
                        style={{ flex: "0 0 auto" }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: idx * 0.08, type: "spring", stiffness: 240 }}
                        whileHover={{ scale: 1.04 }}
                    >
                        <div className="text-4xl leading-none mb-4">“</div>
                        <p className="text-lg font-medium mb-4 min-h-[120px] sm:min-h-[200px]">
                            {story.text}
                        </p>
                        <p className="italic font-semibold">– {story.name}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
