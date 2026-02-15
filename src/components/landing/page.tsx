import Blog from "../Blog";
import Hero from "../hero";
import Report from "../Report";
import EducationalCards from "../../components/EducationalCards";
import FooterBlog from "../FooterBlog";
import DynamicAdsProvider from "../adds/dynamicAdsProvider";
import FrontendLayout from "@/components/layout/frontendLayout";

export default function LandingPage() {
  return (
    <>
    <FrontendLayout>
      <div className="bg-gray-50 pt-4">
        <DynamicAdsProvider 
          position="homepage_full_1" 
          className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]" 
        />
      </div>

      <Hero />
      
      <div className="bg-gray-50 py-6">
        <DynamicAdsProvider 
          position="homepage_full_2" 
          className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]" 
        />
      </div>

      <EducationalCards />

      <Report />
      
      <div className="bg-gray-50 py-6">
        <DynamicAdsProvider 
          position="homepage_full_3" 
          className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]" 
        />
      </div>

      <Blog />

      <div className="bg-gray-50 pb-8">
        <DynamicAdsProvider 
          position="homepage_full_4" 
          className="max-w-7xl mx-auto px-4 h-[100px] md:h-[150px]" 
        />
      </div>

      <FooterBlog />
      </FrontendLayout>
    </>
  );
}