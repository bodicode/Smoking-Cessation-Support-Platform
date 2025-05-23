import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { blogs } from '../../../../../data';
import { RxAvatar } from 'react-icons/rx';
import Link from 'next/link';

type Props = {
    params: { locale: string; slug: string }
};

export default function BlogDetail({ params }: Props) {
    const { locale, slug } = params;
    const t = useTranslations('blogSection');
    const tDetail = useTranslations('blogDetail');

    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) return notFound();

    const title =
        locale === 'vi'
            ? t(`${blog.slug}.title`)
            : t(`${blog.slug}.title`);
    const excerpt =
        locale === 'vi'
            ? t(`${blog.slug}.excerpt`)
            : t(`${blog.slug}.excerpt`);
    const content =
        locale === 'vi'
            ? t(`${blog.slug}.content`)
            : t(`${blog.slug}.content`);

    const mostPopular = blogs.filter(b => b.slug !== slug).slice(0, 3);

    return (
        <div className="min-h-screen py-12 px-2 sm:px-8 ">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                    <h1 className="text-5xl font-extrabold text-[#03256C] mb-8 leading-tight">
                        {title}
                    </h1>
                    <div className="flex items-center gap-3 mb-8">
                        <RxAvatar size={45} />
                        <div>
                            <div className="font-semibold text-[#03256C]">
                                {tDetail('author')}: {blog.author}
                            </div>
                            <div className="text-sm">
                                {tDetail('publishedAt')}: {blog.date}
                            </div>
                        </div>
                    </div>
                    <div className="text-lg mb-6 whitespace-pre-line leading-relaxed">
                        {content}
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="w-full aspect-video relative rounded-xl overflow-hidden">
                        <Image
                            src={blog.image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-[#03256C] font-semibold mb-4">
                            {tDetail('relatedPosts')}
                        </div>
                        <div className="flex flex-col gap-5">
                            {mostPopular.map((item, idx) => (
                                <Link href={`/${locale}/blog/${item.slug}`} key={item.slug}>
                                    <div className="text-sm text-[#03256C] font-semibold leading-tight">
                                        {t(`${item.slug}.title`, { fallback: item.title })}
                                    </div>
                                    <div className="text-xs text-[#03256C]">
                                        {tDetail('author')}: {item.author}
                                    </div>
                                    <div className="text-xs text-[#03256C]">
                                        {t(`${item.slug}.excerpt`, { fallback: item.excerpt })} - <span className='text-[#273f72]'>{item.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
