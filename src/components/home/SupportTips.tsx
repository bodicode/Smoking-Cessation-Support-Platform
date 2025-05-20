import Image from "next/image";
import Link from "next/link";

const SupportTips = () => {
    return (
        <div className="bg-[#f7f4ee] py-12 px-6 lg:px-36 flex flex-col-reverse lg:flex-row items-center gap-10 mt-8 rounded-t-4xl">
            <div className="lg:w-1/2 flex flex-col gap-8">
                <div>
                    <h2 className="text-4xl font-bold text-[#03256C] mb-4">Chung tay giúp đỡ</h2>
                    <p>Giúp một người hút thuốc trong hành trình bỏ thuốc lá là quan trọng. Hỗ trợ của bạn có thể tạo ra sự khác biệt.</p>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <Image src="/images/brain.png" alt="Know the triggers" width={48} height={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#03256C]">Nghiện là gì?</h3>
                        <p className="text-gray-700">
                            Hút thuốc là một cơn nghiện, không phải là một thói quen xấu.
                            Những sản phẩm này được thiết kế để gây nghiện, khiến việc bỏ thuốc trở nên khó khăn,
                            nhưng không phải là không thể!
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <Image src="/images/idea.png" alt="Be patient and positive" width={48} height={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#03256C]">Kiên nhẫn và tích cực</h3>
                        <p className="text-gray-700">
                            Hãy ủng hộ họ trong những lần thất bại và ăn mừng tiến bộ để giữ cho họ có động lực                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <Image src="/images/help.png" alt="Keep the conversation going" width={48} height={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#03256C]">Làm thế nào bạn có thể giúp đỡ?</h3>
                        <p className="text-gray-700">
                            Có nhiều cách để giúp ai đó bỏ việc, nó sẽ thực sự cí ý nghĩa nhưng không phải phán xét.
                            Là một nơi giúp cho mọi người dễ dàng giao tiếp, đưa lời khuyên, và truyền động lực
                        </p>
                    </div>
                </div>

                <div>
                    <Link
                        href="/community"
                        className="mt-2 hover:underline font-semibold flex justify-center text-[#03256C]"
                    >
                        Tham gia vào cộng đồng chúng tôi ngay →
                    </Link>
                </div>
            </div>

            <div className="lg:w-1/2">
                <Image
                    src="/images/community.png"
                    alt="Community"
                    width={700}
                    height={600}
                />
            </div>
        </div >
    );
};

export default SupportTips;
