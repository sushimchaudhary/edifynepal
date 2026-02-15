"use client"
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { contentService } from "../../../services/contentServices";
import FrontendLayout from "../../../components/layout/frontendLayout";
import DynamicAdsProvider from "../../../components/adds/dynamicAdsProvider";
import Link from "next/link";

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState<any[]>([]);

  const fetchAboutData = async () => {
    try {
      const response = await contentService.getAbout();
      const data = response?.data?.data || response?.data || response;
      setAboutData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load about data");
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return (
    <>
      <FrontendLayout>
        <div className="py-4">
          <DynamicAdsProvider
            position="post_full_1"
            className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-2 py-6 ">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <main className="w-full lg:w-[72%]">
              <div className="bg-white border-r border-gray-100 overflow-hidden">
                <header className="bg-[#213a59] p-3 text-white">
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Users size={32} /> हाम्रो बारे
                  </h1>
                  <p className="text-teal-50 mt-2 font-light">
                    हाम्रो यात्रा, उद्देश्य र प्रतिवद्धता
                  </p>
                </header>

                <div className="p-2">
                  {aboutData.length > 0 ? (
                    <>
                      {aboutData.map((item) => (
                        <article
                          key={item.id}
                          className="animate-in fade-in duration-700 mb-12 last:mb-0"
                        >
                          {item.photo && (
                            <div className="w-full overflow-hidden  mb-8 shadow-md">
                              <img
                                src={item.photo}
                                alt="Shikshak Content"
                                className="w-full object-cover max-h-[500px] "
                              />
                            </div>
                          )}

                          <div
                            className="prose prose-teal max-w-none text-gray-700 
                                     prose-headings:text-[#213a59] prose-headings:font-bold
                                     prose-p:leading-relaxed prose-p:text-lg
                                     break-words"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </article>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-400 italic text-center py-20">
                      जानकारी उपलब्ध छैन।
                    </p>
                  )}
                </div>
              </div>
            </main>

            <aside className="w-full lg:w-[28%]">
              <div className="sticky top-24 space-y-3 self-start">
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
                    <h3 className="font-bold text-lg mb-2 text-white">हाम्रो अभियान</h3>
                    <p className="text-sm text-gray-100 mb-4 font-light leading-relaxed">
                      सही सूचना र निष्पक्ष समाचारका लागि हामी सधैं क्रियाशील छौं।
                    </p>
                    <Link href="/contact">
                      <button className="w-full py-1.5 bg-white text-[#213a59] rounded text-sm font-bold hover:bg-gray-100 transition-colors shadow-md">
                        हामीलाई लेख्नुहोस्
                      </button>
                    </Link>
                  </div>
                </div>

                <section>
                  <DynamicAdsProvider
                    position="post_sidebar_2"
                    className="w-full h-[210px] shadow-sm"
                  />
                </section>

                <section>
                  <DynamicAdsProvider
                    position="post_sidebar_3"
                    className="w-full h-[210px] shadow-sm"
                  />
                </section>
              </div>
            </aside>
          </div>
        </div>

        <div className="bg-gray-50 py-8">
          <DynamicAdsProvider
            position="post_full_2"
            className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]"
          />
        </div>
      </FrontendLayout>
    </>
  );
}