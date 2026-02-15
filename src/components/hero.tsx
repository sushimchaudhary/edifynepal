import { useEffect, useState } from "react";

import MankaKura from "./manka-kura";
import DynamicAdsProvider from "./adds/dynamicAdsProvider";
import { contentService } from "../services/contentServices";
import Link from "next/link";

export default function Hero() {
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [allTitles, setAllTitles] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await contentService.getPosts();
        const allPosts = Array.isArray(res) ? res : res?.data?.data || [];

        const filteredPosts = allPosts.filter(
          (post: any) => post.category_name !== "मनका कुरा",
        );

        const sorted = filteredPosts.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setLatestBlogs(sorted.slice(0, 3));
        setAllTitles(sorted);
      } catch (err) {
        console.error("Error fetching hero blogs:", err);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        
      
        <div className="col-span-12 lg:col-span-9 space-y-8">
          {latestBlogs.length > 0 ? (
            latestBlogs.map((blog, index) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <div
                  className={`bg-white hover:text-[#33b9d2] cursor-pointer border-gray-200 overflow-hidden group shadow-md ${
                    index > 0 ? "mt-10" : ""
                  }`}
                >
                  <h3
                    className={`font-bold text-2xl md:text-4xl m-4 pl-3 ${
                      index === 1 || index === 2 ? "text-center" : ""
                    }`}
                  >
                    {blog.title}
                  </h3>

                  <div className="overflow-hidden aspect-video md:aspect-auto bg-gray-100">
                    <img
                      src={blog.photo || "/placeholder.jpg"}
                      className="w-full h-full object-cover"
                      alt={blog.title}
                    />
                  </div>
                </div>
              </Link>
            ))
          ) : (
          
            <div className="space-y-10">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white h-[400px] animate-pulse shadow-sm" />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="top-24 space-y-4">
            <section>
              <div className="bg-[#213a59] text-white p-2.5 font-bold text-center shadow-md">
                शिक्षा खबर
              </div>
              <div className="bg-white shadow-md max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col">
                  {allTitles.length > 0 ? (
                    allTitles.slice(0, 12).map((item) => (
                      <Link
                        key={item.id}
                        href={`/blog/${item.slug}`}
                        className="block group border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-700 group-hover:text-[#33b9d2] leading-snug line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                   
                    <div className="p-10 space-y-4">
                       {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 animate-pulse rounded" />)}
                    </div>
                  )}
                </div>

                <Link href="/all-news">
                  <button className="w-full text-xs text-[#33b9d2] font-bold hover:underline py-3 bg-gray-50">
                    सबै खबर हेर्नुहोस् »
                  </button>
                </Link>
              </div>
            </section>

            <section className="bg-white p-1 shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
              <DynamicAdsProvider position="homepage_sidebar_1" className="h-[210px] w-full" />
            </section>

            <MankaKura />

            <section className="bg-white p-1 shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
              <DynamicAdsProvider position="homepage_sidebar_2" className="h-[210px] w-full" />
            </section>

            <section className="bg-white p-1 shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
              <DynamicAdsProvider position="homepage_sidebar_3" className="h-[210px] w-full" />
            </section>
          </div>
        </aside>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e695e; }
      `}</style>
    </div>
  );
}