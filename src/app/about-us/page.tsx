'use client';

import { HeartHandshake, Users, Target, Eye, LockKeyhole, BrainCircuit, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";

export default function AboutUs() {
    const coreValues: { name: string; desc: string; icon: React.ReactNode }[] = [
        {
            name: "Tận tâm hỗ trợ",
            desc: "Chúng tôi luôn đồng hành cùng bạn trên hành trình bỏ thuốc, cung cấp sự hỗ trợ tận tình và chuyên nghiệp.",
            icon: <HeartHandshake size={28} className="text-[#60C3A4]" />
        },
        {
            name: "Đổi mới sáng tạo",
            desc: "Không ngừng cập nhật và áp dụng các phương pháp, công nghệ mới giúp bạn bỏ thuốc hiệu quả hơn.",
            icon: <BrainCircuit size={28} className="text-[#60C3A4]" />
        },
        {
            name: "Bảo mật thông tin",
            desc: "Mọi thông tin cá nhân của bạn đều được bảo mật tuyệt đối.",
            icon: <LockKeyhole size={28} className="text-[#60C3A4]" />
        },
        {
            name: "Lắng nghe & chia sẻ",
            desc: "Chúng tôi luôn lắng nghe, thấu hiểu và chia sẻ cùng bạn mọi khó khăn trong quá trình bỏ thuốc.",
            icon: <MessageCircle size={28} className="text-[#60C3A4]" />
        },
        {
            name: "Đồng hành cộng đồng",
            desc: "Xây dựng cộng đồng hỗ trợ, kết nối những người cùng mục tiêu bỏ thuốc.",
            icon: <Users size={28} className="text-[#60C3A4]" />
        },
        {
            name: "Trách nhiệm & Uy tín",
            desc: "Cam kết mang lại giá trị thực và luôn đặt lợi ích của bạn lên hàng đầu.",
            icon: <ShieldCheck size={28} className="text-[#60C3A4]" />
        },
    ];

    const teamMembers: { name: string; role: string; desc: string }[] = [
        {
            name: "Nguyễn Văn A",
            role: "Nhà sáng lập",
            desc: "Chịu trách nhiệm định hướng và phát triển nền tảng hỗ trợ bỏ thuốc."
        },
        {
            name: "Trần Thị B",
            role: "Chuyên gia sức khỏe",
            desc: "Tư vấn, xây dựng nội dung và hỗ trợ người dùng trong quá trình bỏ thuốc."
        },
        {
            name: "Lê Văn C",
            role: "Kỹ sư phần mềm",
            desc: "Phát triển, tối ưu hệ thống và đảm bảo trải nghiệm người dùng."
        },
        {
            name: "Phạm Thị D",
            role: "Chăm sóc khách hàng",
            desc: "Giải đáp thắc mắc, tiếp nhận ý kiến đóng góp từ người dùng."
        }
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.12, duration: 0.45, type: "spring", stiffness: 180 }
        }),
    };

    return (
        <div className="min-h-screen py-10 flex flex-col items-center">

            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Về chúng tôi", active: true }
                ]}
            />

            <motion.div
                className="w-full max-w-4xl bg-white rounded-2xl px-8 py-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08 } }
                }}
            >
                <motion.h1
                    className="text-4xl font-bold text-center text-[#60C3A4] mb-2"
                    variants={fadeUp}
                    custom={0}
                >
                    Về chúng tôi
                </motion.h1>
                <motion.p
                    className="text-lg text-center text-gray-600 mb-10"
                    variants={fadeUp}
                    custom={0.2}
                >
                    Nền tảng hỗ trợ bỏ thuốc lá - đồng hành cùng bạn trên hành trình sống khỏe mạnh hơn.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        className="bg-[#e6faf3] rounded-xl p-6 flex flex-col items-center shadow"
                        variants={fadeUp}
                        custom={0.3}
                        whileHover={{ scale: 1.03 }}
                    >
                        <Target size={40} className="text-[#60C3A4] mb-2" />
                        <h2 className="font-bold text-xl text-[#60C3A4] mb-2">Sứ mệnh</h2>
                        <p className="text-center text-gray-600">Đồng hành, hỗ trợ và tạo động lực giúp mọi người bỏ thuốc thành công.</p>
                    </motion.div>
                    <motion.div
                        className="bg-[#f1fbf7] rounded-xl p-6 flex flex-col items-center shadow"
                        variants={fadeUp}
                        custom={0.4}
                        whileHover={{ scale: 1.03 }}
                    >
                        <Eye size={40} className="text-[#60C3A4] mb-2" />
                        <h2 className="font-bold text-xl text-[#60C3A4] mb-2">Tầm nhìn</h2>
                        <p className="text-center text-gray-600">Trở thành nền tảng hỗ trợ bỏ thuốc hàng đầu Việt Nam.</p>
                    </motion.div>
                </div>

                <motion.h2
                    className="text-2xl font-bold text-[#60C3A4] mt-4 mb-4 text-center"
                    variants={fadeUp}
                    custom={0.5}
                >
                    Giá trị cốt lõi
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {coreValues.map((val, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-[#f7f7fa] rounded-lg shadow"
                            variants={fadeUp}
                            custom={0.6 + idx * 0.08}
                            whileHover={{ scale: 1.04, boxShadow: "0px 4px 16px #60C3A444" }}
                        >
                            <motion.div whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.4 } }}>
                                {val.icon}
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-[#60C3A4]">{val.name}</h3>
                                <p className="text-gray-600 text-sm">{val.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.h2
                    className="text-2xl font-bold text-[#60C3A4] mb-2 text-center"
                    variants={fadeUp}
                    custom={0.7}
                >
                    Đội ngũ phát triển
                </motion.h2>
                <motion.p
                    className="text-center text-gray-600 mb-6"
                    variants={fadeUp}
                    custom={0.8}
                >
                    Chúng tôi là những người trẻ đam mê công nghệ và sức khỏe cộng đồng, cùng chung mục tiêu giúp Việt Nam không còn khói thuốc.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {teamMembers.map((member, idx) => (
                        <motion.div
                            key={idx}
                            className="p-4 bg-[#e6faf3] rounded-lg shadow flex flex-col items-center"
                            variants={fadeUp}
                            custom={0.9 + idx * 0.08}
                            whileHover={{ scale: 1.03, boxShadow: "0px 4px 18px #60C3A444" }}
                        >
                            <Users size={32} className="mb-2 text-[#60C3A4]" />
                            <h3 className="font-bold text-[#60C3A4]">{member.name}</h3>
                            <p className="text-gray-700 text-sm">{member.role}</p>
                            <p className="text-gray-500 text-sm text-center">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
