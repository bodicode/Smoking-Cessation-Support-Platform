import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const SupportTips = () => {
    const t = useTranslations('supportTips');

    return (
        <div className="bg-[#f7f4ee] py-12 px-6 lg:px-36 flex flex-col-reverse lg:flex-row items-center gap-10 mt-8 rounded-t-4xl">
            <div className="lg:w-1/2 flex flex-col gap-8">
                <div>
                    <h2 className="text-4xl font-bold text-[#03256C] mb-4">{t('title')}</h2>
                    <p>{t('intro')}</p>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <Image src="/images/brain.png" alt="Know the triggers" width={48} height={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#03256C]">{t('tip1.heading')}</h3>
                        <p className="text-gray-700">
                            {t('tip1.body')}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <Image src="/images/idea.png" alt="Be patient and positive" width={48} height={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#03256C]">{t('tip2.heading')}</h3>
                        <p className="text-gray-700">
                            {t('tip2.body')}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <Image src="/images/help.png" alt="Keep the conversation going" width={48} height={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[#03256C]">{t('tip3.heading')}</h3>
                        <p className="text-gray-700">
                            {t('tip3.body')}
                        </p>
                    </div>
                </div>

                <div>
                    <Link
                        href="/community"
                        className="mt-2 hover:underline font-semibold flex justify-center text-[#03256C]"
                    >
                        {t('cta.text')}
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
