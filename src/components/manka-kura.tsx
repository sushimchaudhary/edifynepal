import { useEffect, useState } from "react";

import { Calendar } from "lucide-react"; 
import { contentService } from "../services/contentServices";
import Link from "next/link";

export default function MankaKura() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await contentService.getPosts();
        const allPosts = Array.isArray(res) ? res : res?.data?.data || [];
       
        const filteredPosts = allPosts.filter(
          (item: any) => item.category_name === "मनका कुरा"
        );
        
        const sorted = filteredPosts.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setNewsItems(sorted.slice(0, 8)); 
      } catch (err) {
        console.error("Error fetching Manka Kura:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ne-NP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="bg-white shadow-[0px_4px_15px_rgba(0,0,0,0.1)] flex flex-col h-[505px] border border-gray-100">
      <div className="bg-[#213a59] text-white p-2.5 font-bold text-center text-sm tracking-wide">
        मनका कुरा
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3">
        {loading ? (
          // डेटा लोड हुँदा देखिने Skeleton प्रभाव
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-2 bg-gray-100 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : newsItems.length > 0 ? (
          newsItems.map((item, idx) => (
            <div
              key={idx}
              className="border-b border-gray-100 pb-2 last:border-0 last:pb-0 group"
            >
              <Link href={`/blog/${item.slug}`}>
                <h4 className="font-bold text-[15px] leading-tight text-gray-900 group-hover:text-[#213a59] cursor-pointer mb-2 transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </Link>

              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                   <img
                      src={item.photo || "/user.png"}
                      className="w-full h-full object-cover"
                      alt="author"
                    />
                </div>

                <div>
                  <p className="text-[13px] font-bold text-[#33b9d2] leading-none">
                    {item.author_name || "शिक्षक टीम"}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                     <Calendar size={10} className="text-gray-400" /> {formatDate(item.created_at)}
                  </p>
                </div>
              </div>

              <div 
                className="text-gray-700 text-[12.5px] leading-relaxed line-clamp-2 italic quill-content"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm italic mt-10">
            "मनका कुरा" क्याटेगोरीमा कुनै सामग्री फेला परेन।
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
        <Link href="/manka-kura-list">
          <button className="text-[12px] font-bold text-[#33b9d2] hover:underline transition-colors w-full cursor-pointer">
            अन्य विषय
          </button>
        </Link>
      </div>

      <style>{`
        .quill-content * {
          display: inline !important;
          font-size: inherit !important;
          color: inherit !important;
          margin: 0 !important;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #213a59; border-radius: 10px; }
      `}</style>
    </section>
  );
}