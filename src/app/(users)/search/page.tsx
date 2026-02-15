"use client"
import { useEffect, useState, Suspense } from "react"; // Suspense थप्नुहोस्
import { useSearchParams } from "next/navigation"; // useLocation को सट्टा यो चाहिन्छ
import Link from "next/link"; // react-router-dom को सट्टा next/link
import { 
  Calendar, 
  User, 
  Search, 
  ArrowRight, 
  Eye, 
  AlertCircle 
} from "lucide-react";
import { contentService } from "../../../services/contentServices";
import DynamicAdsProvider from "../../../components/adds/dynamicAdsProvider";
import FrontendLayout from "../../../components/layout/frontendLayout";
import NepaliDate from "nepali-date-converter";

function SearchContent() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; // URL बाट 'q' भ्यालु लिने

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await contentService.getPosts();
        const allPosts = Array.isArray(res) ? res : res?.data?.data || [];

        const filtered = allPosts.filter((post: any) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          (post.description && post.description.toLowerCase().includes(query.toLowerCase()))
        );

        const sorted = [...filtered].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setResults(sorted);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const toNepaliNumber = (num: number | string) => {
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return num.toString().split("").map((d) => (/[0-9]/.test(d) ? nepaliDigits[parseInt(d)] : d)).join("");
  };

  const formatNepaliDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new NepaliDate(date).format("MMMM DD, YYYY", "np");
    } catch (e) { return dateString; }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Content Section */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              
              {/* Header */}
              <div className="bg-white p-4 shadow-sm border-l-4 border-[#213a59] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#49c0d7]/10 p-2">
                    <Search size={22} className="text-[#213a59]" />
                  </div>
                  <div>
                    {loading ? (
                      <div className="h-6 bg-gray-200 w-48 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-lg font-bold text-gray-800">
                        खोजिएको शब्द: <span className="text-[#49c0d7]">"{query}"</span> (
                        <span className="text-gray-500">
                          {toNepaliNumber(results.length)} नतिजाहरू
                        </span>)
                      </p>
                    )}
                  </div>
                </div>
                <Link href="/" className="hidden md:block text-xs font-bold text-[#213a59] hover:text-[#49c0d7]">
                  ← गृहपृष्ठ
                </Link>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {loading ? (
                  <p>खोज्दैछ...</p>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <article key={item.id} className="bg-white overflow-hidden border border-gray-200 shadow-sm flex flex-col md:flex-row min-h-[200px]">
                      <div className="md:w-72 w-full aspect-video bg-gray-100 shrink-0">
                        <Link href={`/blog/${item.slug}`}>
                          <img src={item.photo || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
                        </Link>
                      </div>
                      <div className="p-5 flex-1">
                        <Link href={`/blog/${item.slug}`}>
                          <h2 className="text-xl font-bold text-[#213a59] mb-2">{item.title}</h2>
                        </Link>
                        <div className="text-gray-500 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }} />
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-center py-10">केही फेला परेन।</p>
                )}
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-3 space-y-4">
               <DynamicAdsProvider position="post_sidebar_1" className="w-full h-[210px]" />
            </aside>
          </div>
        </div>
      </div>
  );
}

export default function SearchPage() {
  return (
    <FrontendLayout>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchContent />
      </Suspense>
    </FrontendLayout>
  );
}