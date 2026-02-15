"use client";

import { useEffect, useState, useRef } from "react";
import {
    Calendar,
    Eye,
    Facebook,
    MessageCircle,
    ArrowLeft,
    Layers,
    Lock,
} from "lucide-react";
import {
    FacebookMessengerShareButton,
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import { contentService } from "@/services/contentServices";
import FrontendLayout from "@/components/layout/frontendLayout";
import DynamicAdsProvider from "@/components/adds/dynamicAdsProvider";
import NepaliDate from "nepali-date-converter";
import Link from "next/link";

export default function BlogDetailClient({ slug, initialPost }: any) {
    const [post, setPost] = useState<any>(initialPost);
    const [loading, setLoading] = useState(!initialPost);
    const [isFBLoggedIn, setIsFBLoggedIn] = useState<boolean | null>(null);
    const viewCountedRef = useRef<string | null>(null);

    const toNepaliNumber = (num: number | string) => {
        const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
        return num.toString().split("").map((digit) => /[0-9]/.test(digit) ? nepaliDigits[parseInt(digit)] : digit).join("");
    };

    const formatNepaliDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new NepaliDate(date).format("MMMM DD, YYYY", "np");
        } catch (e) {
            return "मिति उपलब्ध छैन";
        }
    };

    // Content Fetching (यदि सर्भरबाट आएको छैन भने मात्र)
    useEffect(() => {
        if (!post) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const res = await contentService.getPosts();
                    const allPosts = Array.isArray(res) ? res : res?.data?.data || [];
                    const foundPost = allPosts.find((p: any) => p.slug === slug);
                    if (foundPost) {
                        const detailData = await contentService.getPostById(foundPost.id);
                        setPost(detailData);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [slug, post]);


    useEffect(() => {
        const checkLoginStatus = () => {
            if ((window as any).FB) {
                (window as any).FB.getLoginStatus((response: any) => {
                    if (response.status === "connected") {
                        setIsFBLoggedIn(true);
                    } else {
                        setIsFBLoggedIn(false);
                    }
                });
            }
        };

        const loadFacebookSDK = () => {
            if (document.getElementById("facebook-jssdk")) {
                if ((window as any).FB) {
                    (window as any).FB.XFBML.parse();
                    checkLoginStatus();
                }
                return;
            }

            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/ne_NP/sdk.js#xfbml=1&version=v21.0";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if ((window as any).FB) {
                    (window as any).FB.init({
                        appId: "4181288642124656",
                        status: true,
                        xfbml: true,
                        version: "v21.0",
                    });
                    checkLoginStatus();
                }
            };
            document.body.appendChild(script);
        };

        loadFacebookSDK();
    }, [slug]);

    const shareUrl = `https://api.edifynepal.com/api/content/share/post/${slug}/`;

    const XIcon = ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
    );

    return (
        <FrontendLayout>
            <div className="py-4">
                <DynamicAdsProvider position="post_full_1" className="max-w-7xl mx-auto px-2 h-[100px] md:h-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-3 py-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <main className="w-full lg:w-[72%]">
                        {loading ? (
                            <div className="text-center py-20">Loading...</div>
                        ) : post ? (
                            <article className="bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <header className="mb-6 p-5">
                                    <Link href="/" className="inline-flex items-center gap-2 text-[#2db7d1] mb-4 text-xs font-bold hover:underline">
                                        <ArrowLeft size={14} /> मुख्य पृष्ठमा जानुहोस्
                                    </Link>
                                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-900">{post.title}</h1>
                                </header>

                                <div className="lg:p-2">
                                    {post.photo && (
                                        <div className="w-full overflow-hidden mb-5">
                                            <img src={post.photo} alt={post.title} className="w-full object-cover max-h-[500px]" />
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-3 pb-3 border-b border-gray-100 px-4">
                                        <div className="flex items-center gap-3">
                                            <img src={post.author_photo || "/user.png"} alt={post.author_name} className="h-12 w-12 rounded-full border-2 border-white shadow-sm object-cover ring-1 ring-[#2db7d1]/20" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-tight">{post.author_name || "सम्पादक"}</p>
                                                <p className="text-[10px] text-[#2db7d1] font-bold uppercase tracking-widest">लेखक / स्तम्भकार</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                            <div className="text-left sm:text-right">
                                                <span className="block text-[9px] font-bold text-gray-400 uppercase">मिति</span>
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-gray-700">
                                                    <Calendar size={12} className="text-[#2db7d1]" /> {formatNepaliDate(post.created_at)}
                                                </span>
                                            </div>
                                            <div className="text-left sm:text-right border-l pl-4 border-gray-100">
                                                <span className="block text-[9px] font-bold text-gray-400 uppercase">भ्युज</span>
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-gray-700">
                                                    <Eye size={12} className="text-[#2db7d1]" /> {toNepaliNumber(post.view_count || 0)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 ml-auto sm:ml-0 pt-2 sm:pt-0">
                                                <FacebookShareButton url={shareUrl}><div className="p-2 bg-[#1877F2] text-white rounded-full"><Facebook size={16} /></div></FacebookShareButton>
                                                <FacebookMessengerShareButton url={shareUrl} appId="4181288642124656"><div className="p-2 bg-[#0084FF] text-white rounded-full"><MessageCircle size={16} /></div></FacebookMessengerShareButton>
                                                <TwitterShareButton url={shareUrl} title={post.title}><div className="p-2 bg-black text-white rounded-full"><XIcon className="w-4 h-4" /></div></TwitterShareButton>
                                                <WhatsappShareButton url={shareUrl} title={post.title} separator=":: "><div className="p-2 bg-[#25D366] text-white rounded-full"><MessageCircle size={16} /></div></WhatsappShareButton>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-teal max-w-none text-gray-700 prose-p:text-lg break-words px-4" dangerouslySetInnerHTML={{ __html: post.description }} />

                                    <div className="mt-6 pt-4  bg-white px-4">
                                        {isFBLoggedIn === true && (
                                            <>
                                                <h3 className="text-xl font-bold text-gray-800 mb-6">प्रतिक्रिया दिनुहोस्</h3>
                                                <div className="animate-in fade-in duration-500">
                                                    <div
                                                        className="fb-comments"
                                                        data-href={shareUrl}
                                                        data-width="100%"
                                                        data-numposts="5"
                                                        data-colorscheme="light"
                                                    ></div>
                                                </div>
                                            </>
                                        )}

                                        {isFBLoggedIn === false && (
                                            <p className="text-gray-500 text-sm italic py-4 border-t border-gray-300">
                                                प्रतिक्रिया दिनका लागि कृपया फेसबुकमा लग-इन हुनुहोस्।
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                                <Layers className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 font-medium italic">यस विधामा लेखहरू उपलब्ध छैनन्।</p>
                            </div>
                        )}
                    </main>

                    <aside className="w-full lg:w-[28%]">
                        <div className="sticky top-24 space-y-4">
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sponsored</span>
                                    <span className="h-px bg-gray-200 flex-1"></span>
                                </div>
                                <DynamicAdsProvider position="post_sidebar_1" className="w-full h-[210px]" />
                            </section>
                            <div className="p-6 bg-[#49c0d7] text-white shadow-lg">
                                <h3 className="font-bold text-lg mb-2">हाम्रो अभियान</h3>
                                <p className="text-sm mb-4">सही सूचना र निष्पक्ष समाचारका लागि हामी सधैं क्रियाशील छौं।</p>
                                <Link href="/contact"><button className="w-full py-2 bg-white text-[#213a59] text-sm font-bold rounded">हामीलाई लेख्नुहोस्</button></Link>
                            </div>
                            <DynamicAdsProvider position="post_sidebar_2" className="w-full h-[210px]" />
                        </div>
                    </aside>
                </div>
            </div>
            <div className="bg-gray-50 py-8">
                <DynamicAdsProvider position="post_full_2" className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]" />
            </div>
        </FrontendLayout>
    );
}