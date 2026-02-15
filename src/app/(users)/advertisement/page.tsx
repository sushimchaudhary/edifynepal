"use client"
import { useEffect, useMemo, useState } from "react";
import { adService } from "../../../services/adServices";
import {  Megaphone,  } from "lucide-react";
import FrontendLayout from "../../../components/layout/frontendLayout";

const AdSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={`s1-${i}`} className="h-72 bg-gray-100 rounded animate-pulse"></div>
    ))}
    {[1, 2, 3].map((i) => (
      <div key={`s2-${i}`} className="h-72 bg-gray-100 rounded animate-pulse"></div>
    ))}
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 h-48 md:h-64 bg-gray-100 rounded animate-pulse"></div>
    {[1, 2, 3].map((i) => (
      <div key={`s3-${i}`} className="h-72 bg-gray-100 rounded animate-pulse"></div>
    ))}
  </div>
);

export default function AdsListingPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); 
  const [, setIsFormOpen] = useState(false);
  const [, setSelectedAd] = useState<any>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await adService.getAds();
      let data = Array.isArray(res) ? res : res?.data?.data || res?.data || res;
      setAds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load ads:", err);
      setAds([]);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const filteredAds = useMemo(() => {
    return ads.filter(ad => ad.position === 'advertisement');
  }, [ads]);

  const totalPages = Math.max(1, Math.ceil(filteredAds.length / pageSize));

  const pagedAds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAds.slice(start, start + pageSize);
  }, [filteredAds, currentPage, pageSize]);

  const openEditForm = (ad: any) => {
    setSelectedAd(ad);
    setIsFormOpen(true);
  };

  return (
    <FrontendLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-[70vh]">
        <div className="mb-10 text-start">
          <h1 className="text-3xl font-black text-[#213a59] uppercase tracking-wider mb-2">
            हाम्रा विज्ञापनहरू
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-[#2db7d1]"></span>
            <p className="text-sm text-gray-500 font-medium italic">
              तपाईँको व्यवसायलाई नयाँ उचाइमा पुर्‍याउने उत्कृष्ट अवसरहरू
            </p>
          </div>
        </div>

        {loading ? (
          <AdSkeleton />
        ) : filteredAds.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Megaphone size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">No advertisements found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pagedAds.map((ad, index) => (
                <div
                  key={ad.id}
                  onClick={() => openEditForm(ad)}
                  className={`group relative overflow-hidden rounded shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 
                    ${index === 6 ? "col-span-1 sm:col-span-2 lg:col-span-3 h-48 md:h-64" : "h-72"}`}
                >
                  <div className="absolute inset-0 w-full h-full">
                    {ad.file ? (
                      <img
                        src={ad.file}
                        alt={ad.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 italic text-sm">
                        No Preview Available
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-bold truncate">{ad.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors text-sm font-bold"
                >
                  Prev
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-md font-bold text-sm transition-all ${
                        currentPage === i + 1
                          ? "bg-[#213a59] text-white"
                          : "text-gray-400 border border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors text-sm font-bold"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </FrontendLayout>
  );
}