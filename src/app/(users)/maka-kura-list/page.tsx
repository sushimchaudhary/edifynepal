"use client"
import { useEffect, useState } from "react";

import {
  Calendar,
  User,
  ArrowRight,
  LayoutList,
  Eye,
} from "lucide-react";
import { contentService } from "../../../services/contentServices";
import DynamicAdsProvider from "../../../components/adds/dynamicAdsProvider";
import FrontendLayout from "../../../components/layout/frontendLayout";
import NepaliDate from "nepali-date-converter";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  photo: string | null;
  description: string;
  category_name: string;
  author_name: string;
  created_at: string;
  view_count?: number;
}

export default function MankaKura() {
  const [news, setNews] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const res = await contentService.getPosts();
        const allPosts = Array.isArray(res) ? res : res?.data?.data || [];

        const mankaKuraNews = allPosts.filter(
          (post: any) => post.category_name === "मनका कुरा",
        );

        const sorted = [...mankaKuraNews].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setNews(sorted);
      } catch (err) {
        console.error("Error fetching manka kura news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNews();
  }, []);

  const toNepaliNumber = (num: number | string) => {
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return num
      .toString()
      .split("")
      .map((d) => (/[0-9]/.test(d) ? nepaliDigits[parseInt(d)] : d))
      .join("");
  };

  const formatNepaliDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new NepaliDate(date).format("MMMM DD, YYYY", "np");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <FrontendLayout>
      <div className="font-sans ">
        <div className="max-w-7xl mx-auto lg:p-4 p-2">
          <div className="grid grid-cols-12 gap-8 items-start">
           
            <div className="col-span-12 lg:col-span-9 space-y-6">
              <div className="bg-white p-4 shadow-sm border-l-4 border-[#213a59] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#49c0d7]/10 p-2">
                    <LayoutList size={22} className="text-[#213a59]" />
                  </div>
                  <div>
                    <h2 className="text-sm text-gray-500 font-medium leading-none mb-1">
                      मनका कुरा
                    </h2>
                    {loading ? (
                      <div className="h-5 bg-gray-200 w-32 animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-lg font-bold text-gray-800">
                        कुल{" "}
                        <span className="text-[#49c0d7]">
                          {toNepaliNumber(news.length)}
                        </span>{" "}
                        सामग्रीहरू
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row min-h-[200px] animate-pulse">
                      <div className="md:w-72 w-full aspect-video md:aspect-auto md:h-52 bg-gray-200"></div>
                      <div className="p-5 flex-1 space-y-4">
                        <div className="flex gap-4">
                          <div className="h-3 bg-gray-100 w-24 rounded"></div>
                          <div className="h-3 bg-gray-100 w-24 rounded"></div>
                        </div>
                        <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 w-full rounded"></div>
                          <div className="h-3 bg-gray-100 w-full rounded"></div>
                        </div>
                        <div className="h-8 bg-gray-50 w-28 rounded mt-auto"></div>
                      </div>
                    </div>
                  ))
                ) : news.length > 0 ? (
                  news.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group min-h-[200px]"
                    >
                      <div className="md:w-72 w-full aspect-video md:aspect-auto md:h-52 overflow-hidden relative shrink-0 bg-gray-100">
                        <Link
                          href={`/blog/${item.slug}`}
                          className="block w-full h-full"
                        >
                          <img
                            src={item.photo || "/placeholder.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </Link>
                        <div className="absolute top-2 left-2 bg-[#213a59] rounded text-white text-[10px] font-bold px-2 py-1 z-10">
                          {item.category_name}
                        </div>
                      </div>

                      <div className="p-5 pr-8 flex flex-col justify-between flex-1 overflow-hidden">
                        <div>
                          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[11px] mb-2 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-[#49c0d7]" />
                              {formatNepaliDate(item.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={13} className="text-[#49c0d7]" />
                              {item.author_name}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[#213a59]">
                              <Eye size={13} />{" "}
                              {toNepaliNumber(item.view_count || 0)}
                            </span>
                          </div>

                          <Link href={`/blog/${item.slug}`}>
                            <h2 className="text-xl font-bold text-[#213a59] mb-2 group-hover:text-[#49c0d7] transition-colors line-clamp-2 leading-tight">
                              {item.title}
                            </h2>
                          </Link>

                          <div
                            className="text-gray-500 text-sm line-clamp-3 leading-relaxed italic quill-content"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        </div>

                        <div className="mt-4">
                          <Link
                            href={`/blog/${item.slug}`}
                            className="inline-flex items-center gap-1 text-[#49c0d7] font-bold text-xs hover:gap-2 transition-all uppercase tracking-wider"
                          >
                            थप पढ्नुहोस् <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded border italic text-gray-400">
                    यस विधामा कुनै सामग्री फेला परेन।
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-4">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Sponsored
                  </span>
                  <span className="h-px bg-gray-200 flex-1"></span>
                </div>
                <DynamicAdsProvider
                  position="post_sidebar_1"
                  className="w-full h-[210px]"
                />
              </section>

              <div className="p-6 bg-[#49c0d7] text-white shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    हाम्रो अभियान
                  </h3>
                  <p className="text-sm text-gray-100 mb-4 font-light leading-relaxed">
                    सही सूचना र निष्पक्ष समाचारका लागि हामी सधैं क्रियाशील छौं।
                  </p>
                  <Link href="/contact">
                    <button className="w-full py-1.5 bg-white text-[#213a59] text-sm font-bold hover:bg-gray-100 transition-colors shadow-md">
                      हामीलाई लेख्नुहोस्
                    </button>
                  </Link>
                </div>
              </div>

              <section>
                <DynamicAdsProvider
                  position="post_sidebar_2"
                  className="w-full h-[210px]"
                />
              </section>

              <section>
                <DynamicAdsProvider
                  position="post_sidebar_3"
                  className="w-full h-[210px]"
                />
              </section>
            </aside>
          </div>
        </div>

        <style>{`
          .quill-content * {
            display: inline !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: inherit !important;
            color: inherit !important;
          }
        `}</style>
      </div>
    </FrontendLayout>
  );
}