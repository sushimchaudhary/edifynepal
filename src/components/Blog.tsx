import { useState, useEffect } from "react";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { contentService } from "../services/contentServices";
import Link from "next/link";

const ContentCard = ({ card }: { card: any; index: number }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-200 relative flex flex-col mt-10 transition-all duration-300 w-full">
      <div className="absolute -top-[45px] left-0 bg-[#213a59] text-white px-5 py-2 text-lg font-bold border-l-[10px] border-[#33b9d2] z-20">
        {card.category}
      </div>

      <div className="w-full h-[4px] bg-[#33b9d2] relative z-10"></div>

      <div className="flex-1 flex flex-col">
        {card.image && (
          <div className="relative w-full overflow-hidden border border-gray-300 bg-gray-100 mb-4 h-52 group">
            <Link href={`/blog/${card.slug}`}>
              <img
                src={card.image}
                alt={card.category}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Link>
          </div>
        )}

        <div className="px-2 flex flex-col flex-1">
          {card.title && (
            <Link href={`/blog/${card.slug}`}>
              <h3
                className="text-[19px] font-bold text-black mb-3 leading-tight hover:text-[#33b9d2] cursor-pointer transition-colors"
                style={{ fontFamily: "sans-serif" }}
              >
                {card.title}
              </h3>
            </Link>
          )}

          {card.description && (
            <div className="text-[14px] text-gray-700 mb-4 leading-relaxed italic border-gray-200">
              <div
                className="line-clamp-4"
                dangerouslySetInnerHTML={{
                  __html: card.description,
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-auto p-2">
          <Link href={`/category-list/${card.categorySlug}`} className="block">
            <button className="w-full bg-[#eeeeee] hover:bg-[#213a59] hover:text-white text-gray-800 py-2 font-bold text-[16px] transition-all border border-gray-300 rounded shadow-sm cursor-pointer">
              अन्य विषय
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Blog() {
  const [cardsData, setCardsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await contentService.getPosts();
        const allPosts = Array.isArray(res) ? res : res?.data?.data || [];

        const filtered = allPosts.filter(
          (p: any) =>
            p.category_name !== "मनका कुरा" && p.category_name !== "रिपोर्ट",
        );

        const midToOldPosts = filtered.slice(6);

        const categoriesMap: any = {};
        midToOldPosts.forEach((post: any) => {
          const catName = post.category_name;
          const catId = post.category;
          const uniqueKey = catName + "_" + post.id;

          if (!categoriesMap[uniqueKey]) {
            categoriesMap[uniqueKey] = {
              category: catName,
              categorySlug: catId,
              title: post.title,
              image: post.photo,
              slug: post.slug,
              description: post.description,
              listItems: [],
            };
          }
        });

        const finalData = Object.values(categoriesMap);
        setCardsData(finalData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(3);
      else if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (currentIndex + itemsPerPage < cardsData.length) {
      setDirection(1);
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const visibleCards = cardsData.slice(
    currentIndex,
    currentIndex + itemsPerPage,
  );

  return (
    <div className="bg-gray-50 lg:py-10 px-4">
      <div className="max-w-7xl mx-auto relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={loading || currentIndex === 0}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 bg-[#213a59] rounded-full shadow-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors p-1"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        <button
          onClick={handleNext}
          disabled={loading || currentIndex + itemsPerPage >= cardsData.length}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 bg-[#213a59] rounded-full shadow-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors p-1"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        <div className="overflow-hidden px-2">
          {loading ? (
            // लोडिङको बेला देखिने Skeleton Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white mt-12 shadow-lg border border-gray-200 h-[450px] animate-pulse relative">
                   <div className="absolute -top-[45px] left-0 bg-gray-200 w-32 h-10 border-l-[10px] border-gray-300"></div>
                   <div className="w-full h-52 bg-gray-200 mb-4"></div>
                   <div className="px-4 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: direction === 1 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === 1 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
              >
                {visibleCards.map((item, index) => (
                  <ContentCard
                    key={`${currentIndex}-${index}`}
                    card={item}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}