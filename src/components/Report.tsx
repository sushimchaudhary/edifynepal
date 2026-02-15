"use client";

import { useState, useEffect } from "react";

import { ChevronRight, Calendar } from "lucide-react";
import { contentService } from "../services/contentServices";
import Link from "next/link";

export default function Report() {
  const [reportNews, setReportNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await contentService.getPosts();
        const allPosts = Array.isArray(res) ? res : res?.data?.data || [];
      
        const onlyReports = allPosts.filter(
          (post: any) => post.category_name === "रिपोर्ट"
        );

        const sortedLatest = [...onlyReports].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setReportNews(sortedLatest);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    if (reportNews.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % Math.min(reportNews.length, 5));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [reportNews.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ne-NP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 w-full font-sans">
      <div className="max-w-7xl mx-auto p-4">
        <div>
          <span className="bg-[#213a59] text-white px-4 py-2 font-bold text-sm border-l-[8px] border-[#33b9d2] inline-block shadow-sm">
            रिपोर्ट 
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-9 border-t-2 border-gray-200 bg-white shadow-md overflow-hidden">
          
          {/* LEFT: Slider */}
          <div className="lg:col-span-6 relative h-[250px] md:h-[350px] overflow-hidden bg-gray-900 group">
            {loading ? (
              // स्लाइडरको लागि लोडिङ स्टेट
              <div className="w-full h-full bg-gray-800 animate-pulse flex items-end p-10">
                <div className="h-8 bg-gray-700 w-3/4 rounded"></div>
              </div>
            ) : reportNews.length > 0 ? (
              reportNews.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Link href={`/blog/${item.slug}`}>
                    <img
                      src={item.photo || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-70 "
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                      <h3 className="text-white text-md md:text-xl font-bold line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-500">डाटा फेला परेन।</div>
            )}

            {!loading && reportNews.length > 0 && (
              <div className="absolute bottom-3 left-5 flex gap-1">
                {reportNews.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 transition-all duration-300 ${
                      i === activeSlide ? "bg-[#33b9d2] w-6" : "bg-white/40 w-3"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: List */}
          <div className="lg:col-span-3 bg-white border-l border-gray-100 overflow-y-auto h-[350px] custom-scrollbar">
            {loading ? (
              // दायाँपट्टिको लिष्टको लागि लोडिङ
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border-b border-gray-50 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : reportNews.length > 0 ? (
              reportNews.map((item, index) => (
                <div key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <Link href={`/blog/${item.slug}`} className="block p-2.5 group">
                    <h4 className="text-[12.5px] font-bold text-gray-800 group-hover:text-[#213a59] leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex-shrink-0 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                        <img
                          src={item.photo || "/user.png"}
                          className="w-full h-full object-cover"
                          alt="author"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#33b9d2] leading-none">
                          {item.author_name || "शिक्षक टीम"}
                        </span>
                        <span className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar size={10} className="text-[#213a59]" />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <ChevronRight className="ml-auto w-3 h-3 text-gray-300 group-hover:text-[#213a59]" />
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400 text-xs">रिपोर्टहरू छैनन्।</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9f9f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #213a59; border-radius: 5px; }
      `}</style>
    </div>
  );
}