import { useEffect, useState } from "react";

import { contentService } from "../services/contentServices";
import Link from "next/link";

export default function FooterBlog() {
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await contentService.getPosts();
        let allPosts = Array.isArray(res) ? res : res?.data?.data || [];

        const filtered = allPosts.filter(
          (p: any) =>
            p.category_name !== "मनका कुरा" && p.category_name !== "रिपोर्ट",
        );

        const middlePosts = filtered.slice(3, 20);

        const categoriesMap: any = {};

        middlePosts.forEach((post: any) => {
          const catName = post.category_name || "विविध";
          const catId = post.category;

          if (!categoriesMap[catName]) {
            categoriesMap[catName] = {
              title: catName,
              categorySlug: catId,
              mainImage: post.photo,
              mainSlug: post.slug,
              links: [{ title: post.title, slug: post.slug }],
            };
          } else {
            if (categoriesMap[catName].links.length < 3) {
              categoriesMap[catName].links.push({
                title: post.title,
                slug: post.slug,
              });
            }
          }
        });

        const finalThreeCategories = Object.values(categoriesMap).slice(0, 3);
        setCategoriesData(finalThreeCategories);
      } catch (err) {
        console.error("Error fetching middle posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-50 p-4 md:p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // डेटा लोड हुँदा देखिने Skeleton Cards
          [1, 2, 3].map((n) => (
            <div key={n} className="relative flex flex-col w-full mt-7">
              <div className="absolute -top-[45px] left-0 bg-gray-200 w-32 h-10 border-l-[10px] border-gray-300 animate-pulse shadow-sm"></div>
              <div className="bg-white shadow-md border border-gray-200 flex flex-col h-[400px] animate-pulse">
                <div className="h-[4px] bg-gray-200 w-full"></div>
                <div className="aspect-video bg-gray-200 w-full"></div>
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
                <div className="p-2 mt-auto">
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          categoriesData.map((cat, index) => (
            <div key={index} className="relative flex flex-col w-full mt-7">
              <div className="absolute   -top-[42px]  left-0 bg-[#213a59] text-white px-5 py-1.5 text-lg font-bold border-l-[10px] border-[#33b9d2] z-20 shadow-md">
                {cat.title}
              </div>

              <div className="bg-white shadow-md border border-gray-200 flex flex-col h-full transition-all hover:shadow-xl group/card">
                <div className="h-[4px] bg-[#33b9d2] w-full"></div>

                <div className="overflow-hidden aspect-video border-b border-gray-100 bg-gray-50">
                  <Link href={`/blog/${cat.mainSlug}`}>
                    <img
                      src={cat.mainImage || "/placeholder.jpg"}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                </div>

                <div className="flex-1 flex flex-col">
                  {cat.links.map((link: any, i: number) => (
                    <Link
                      href={`/blog/${link.slug}`}
                      key={i}
                      className="border-t border-gray-50 px-5 py-3 hover:bg-gray-50 group transition-all"
                    >
                      <span className="hover:text-[#33b9d2] text-gray-700 text-[16px] font-bold group-hover:text-[#213a59] transition-colors leading-tight block line-clamp-2">
                        {link.title}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="p-2 mt-auto border-t border-gray-100">
                  <Link href={`/category/${cat.categorySlug}`}>
                    <button className="w-full bg-[#eeeeee] hover:bg-[#213a59] hover:text-white text-gray-800 py-2 font-bold text-[16px] transition-all border border-gray-300 rounded shadow-sm cursor-pointer">
                      अन्य विषय
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}