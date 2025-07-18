'use client'

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const tipList = [
    {
        icon: "/images/brain.png",
        alt: "Nhận biết nguyên nhân",
        heading: "Nhận biết nguyên nhân khiến bạn muốn hút thuốc",
        body: "Hãy xác định rõ những tình huống, cảm xúc hoặc thói quen nào thường khiến bạn muốn hút thuốc. Khi nhận diện được các \"kích hoạt\" này, bạn sẽ dễ dàng kiểm soát và tránh xa hơn.",
    },
    {
        icon: "/images/idea.png",
        alt: "Kiên nhẫn và tích cực",
        heading: "Kiên nhẫn và giữ thái độ tích cực",
        body: "Bỏ thuốc là một quá trình, có thể gặp thất bại nhưng đừng nản lòng. Hãy tự động viên bản thân, ghi nhận từng tiến bộ nhỏ và luôn tin rằng bạn sẽ làm được!",
    },
    {
        icon: "/images/help.png",
        alt: "Tìm kiếm sự hỗ trợ",
        heading: "Tìm kiếm sự hỗ trợ từ cộng đồng và người thân",
        body: "Chia sẻ với bạn bè, gia đình hoặc tham gia cộng đồng hỗ trợ sẽ giúp bạn có thêm động lực, kinh nghiệm và lời khuyên hữu ích trong hành trình bỏ thuốc.",
    },
];

const containerVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            when: "beforeChildren",
            staggerChildren: 0.12,
        },
    },
};

const tipVariant = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 210, damping: 15, duration: 0.26 }
    }
};

const imageVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.36, ease: "easeOut" } }
};

const SupportTips = () => {
    return (
        <motion.div
            className="bg-[#f7f4ee] py-12 px-6 lg:px-36 flex flex-col-reverse lg:flex-row items-center gap-10 mt-8 rounded-t-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariant}
        >
            <motion.div
                className="lg:w-1/2 flex flex-col gap-8"
                variants={containerVariant}
            >
                <motion.div variants={tipVariant}>
                    <h2 className="text-4xl font-bold text-[#03256C] mb-4">Các mẹo hỗ trợ</h2>
                    <p>Các mẹo hỗ trợ bạn trong quá trình bỏ thuốc lá</p>
                </motion.div>

                {tipList.map((tip, idx) => (
                    <motion.div
                        key={idx}
                        className="flex items-start gap-4"
                        variants={tipVariant}
                        whileHover={{ scale: 1.04, x: 4 }}
                        transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    >
                        <div className="flex-shrink-0">
                            <Image src={tip.icon} alt={tip.alt} width={48} height={48} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#03256C]">{tip.heading}</h3>
                            <p className="text-gray-700">
                                {tip.body}
                            </p>
                        </div>
                    </motion.div>
                ))}

                <motion.div variants={tipVariant}>
                    <Link
                        href="/community"
                        className="mt-2 hover:underline font-semibold flex justify-center text-[#03256C]"
                    >
                        Tham gia cộng đồng hỗ trợ
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                className="lg:w-1/2"
                variants={imageVariant}
            >
                <Image
                    src="/images/community.png"
                    alt="Community"
                    width={700}
                    height={600}
                />
            </motion.div>
        </motion.div>
    );
};

export default SupportTips;
