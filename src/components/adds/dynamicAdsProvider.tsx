"use client";

import { useState, useEffect } from "react";
import { adService } from "../../services/adServices";

const AdSlider = ({
  ads,
  interval = 3000,
  sliderClassName = "",
}: {
  ads: any[];
  interval?: number;
  sliderClassName?: string;
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const getImageUrl = (filePath: string) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000";
    return `${baseUrl}${filePath}`;
  };

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % ads.length);
    }, interval);
    return () => clearInterval(timer);
  }, [ads.length, interval]);

  if (ads.length === 0) return null;

  return (
    <div className={`w-full overflow-hidden ${sliderClassName}`}>
      <div className="relative w-full h-full group cursor-pointer">
        {ads.map((ad, index) => (
          <div
            key={ad.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <a href={ad.link || "#"} target="_blank" rel="noreferrer" className="block w-full h-full">
              <img
                src={getImageUrl(ad.file)}
                alt={ad.name}
                className="w-full h-full object-fill shadow-sm hover:shadow-md transition-all"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DynamicAdsProvider({ 
  position, 
  className = "" 
}: { 
  position: string;
  className?: string; 
}) {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getLayoutClasses = () => {
    if (className) return className;
    if (position.includes('full')) {
      return "h-[100px] md:h-[180px] my-4"; 
    }
    if (position.includes('sidebar')) {
      return "h-[250px] md:h-[350px] my-2"; 
    }
    return "h-[100px] md:h-[150px]";
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await adService.getAds();
        const allAds = response.results || response || [];

        const filtered = allAds.filter(
          (ad: any) =>
            ad.position === position && 
            ad.is_active === true
        );
        setAds(filtered);
      } catch (err) {
        console.error("Ads fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [position]);

  if (loading) {
    return (
      <div className={`w-full bg-gray-200 animate-pulse rounded-sm ${getLayoutClasses()}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
          विज्ञापन लोड हुँदैछ...
        </div>
      </div>
    );
  }


  if (ads.length === 0) return null;

  return <AdSlider ads={ads} sliderClassName={getLayoutClasses()} />;
}