"use client"
import { useEffect, useState, useRef } from "react";

import NepaliDate from "nepali-date-converter";
import { Calendar, Facebook, Instagram, Linkedin, LayoutDashboard } from "lucide-react";
import api from "../api/axiosInstance";
import { categoryService } from "../services/categoryServices";
import { contentService } from "../services/contentServices";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [dateStr, setDateStr] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = Cookies.get("userName");
    setIsLoggedIn(!!user);

    const today = new NepaliDate();
    setDateStr(today.format("DD MMMM YYYY , ddd", "np"));

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [logoRes, catRes, postRes] = await Promise.all([
          api.get("/api/company/company-details/"),
          categoryService.getDetails(),
          contentService.getPosts(),
        ]);

        if (logoRes.data && logoRes.data.length > 0) {
          setLogo(logoRes.data[0].logo);
          setSocialLinks({
            fb: logoRes.data[0].fb_link,
            x: logoRes.data[0].x_link,
            insta: logoRes.data[0].insta_link,
            linkedin: logoRes.data[0].linkedin_link,
          });
        }

        const rawCats = catRes?.data || catRes;
        setCategories(
          rawCats.filter(
            (c: any) => c.is_active && c.name !== "रिपोर्ट" && c.name !== "मनका कुरा"
          )
        );

        const posts = Array.isArray(postRes) ? postRes : postRes?.data?.data || [];
        setAllPosts(posts);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFilteredResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 0) {
      const matched = allPosts
        .filter((post) => 
          post.title.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 6);
      setFilteredResults(matched);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
      setFilteredResults([]);
      setSearchQuery("");
    }
  };

 

  const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor" width="1em" height="1em">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  const staticLinks = [{ label: "गृह पृष्ठ", path: "/" }, { label: "हाम्रा बारे", path: "/about-us" }];
  const footerLinks = [{ label: "विज्ञापन", path: "/advertisement" }, { label: "सम्पर्क", path: "/contact" }];

  // Reuseable Skeleton Component
  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  return (
    <>
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex flex-row items-center justify-between gap-4">
            
            {/* Date Section */}
            <div className="flex-1 flex justify-start items-center gap-2">
              <Calendar size={14} className="text-[#213a59]" />
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <div className="text-[#213a59] font-bold text-[10px] md:text-sm whitespace-nowrap">
                  मिति: {dateStr}
                </div>
              )}
            </div>

            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href={"/"}>
                {isLoading ? (
                  <Skeleton className="h-14 md:h-16 lg:h-20 w-32 md:w-48" />
                ) : (
                  logo && <img src={logo} alt="Logo" className="h-14 md:h-16 lg:h-20 w-auto object-contain" />
                )}
              </Link>
            </div>

            {/* Social & Auth Section */}
            <div className="flex-1 flex justify-end items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 mr-2">
                {isLoading ? (
                  [1, 2, 3, 4].map((n) => <Skeleton key={n} className="h-8 w-8 rounded-full" />)
                ) : (
                  <>
                    {socialLinks.fb && <a href={socialLinks.fb} target="_blank" rel="noreferrer" className="p-1 rounded-full bg-gray-100 text-[#213a59] hover:bg-[#e6f7fb] transition-colors"><Facebook size={16} /></a>}
                    {socialLinks.x && <a href={socialLinks.x} target="_blank" rel="noreferrer" className="p-1 rounded-full bg-gray-100 text-[#213a59] hover:bg-[#e6f7fb] transition-colors"><XIcon className="h-4 w-4" /></a>}
                    {socialLinks.insta && <a href={socialLinks.insta} target="_blank" rel="noreferrer" className="p-1 rounded-full bg-gray-100 text-[#213a59] hover:bg-[#e6f7fb] transition-colors"><Instagram size={16} /></a>}
                    {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-1 rounded-full bg-gray-100 text-[#213a59] hover:bg-[#e6f7fb] transition-colors"><Linkedin size={16} /></a>}
                  </>
                )}
              </div>

              {isLoading ? (
                <Skeleton className="h-8 w-20 md:w-24" />
              ) : isLoggedIn ? (
                <Link href={"/dashboard"}>
                  <button className="flex items-center gap-2 bg-[#213a59] px-2 py-1 md:px-4 md:py-1.5 rounded text-white font-bold hover:bg-[#1c3e67] transition-all text-[10px] md:text-xs lg:text-sm">
                    <LayoutDashboard size={14} /> ड्यासबोर्ड
                  </button>
                </Link>
              ) : (
                <Link href={"/auth/login"}>
                  <button className="border border-[#213a59] px-2 py-1 md:px-4 md:py-1.5 rounded text-[#213a59] font-bold hover:bg-[#213a59] hover:text-white transition-all text-[10px] md:text-xs lg:text-sm">
                    साइन इन
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sticky Menu Bar */}
      <div className="sticky top-0 z-50 bg-[#213a59] text-white py-3 lg:px-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[15px] font-medium">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          <div className={`absolute bg-[#213a59] top-full left-0 w-full md:static md:w-auto md:flex lg:gap-8 gap-3 md:gap-4 lg:pl-13 pl-3 overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? "flex flex-col items-start p-2 opacity-100 max-h-[1000px]" : "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100 md:max-h-none md:flex"}`}>
            {isLoading ? (
              <div className="flex gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="h-5 w-16 bg-white/20 animate-pulse rounded" />)}
              </div>
            ) : (
              [...staticLinks, ...categories, ...footerLinks].map((link: any) => {
                const href = link.path || `/category/${link.id}`;
                console.log("Navigating to:", href);
                const isActive = pathname === href;

                return (
                  <Link
                    key={link.id || href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative py-1 transition-colors hover:text-gray-300 whitespace-nowrap ${
                      isActive 
                        ? "text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white" 
                        : "text-white/80"
                    }`}
                  >
                    {link.label || link.name}
                  </Link>
                );
              })
            )}
          </div>
          {/* Search Section */}
          <div className="relative" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="flex items-center">
              <div className={`flex flex-col items-start overflow-hidden transition-all duration-500 ease-in-out ${isSearchOpen ? "lg:w-60 md:w-40 w-32 opacity-100 mr-2" : "w-0 opacity-0"}`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="खोजी गर्नुहोस् ..."
                  className="bg-transparent pl-2 text-white placeholder-white/70 outline-none w-full py-1 text-sm italic"
                  autoFocus={isSearchOpen}
                />
                <div className={`h-[1px] bg-white transition-all duration-700 ${isSearchOpen ? "w-full" : "w-0"}`} />
              </div>

              <button type="button" className="hover:text-gray-300 transition-colors p-1" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Search Results Dropdown with Card Skeleton */}
            {(isSearchOpen && searchQuery.length > 1) && (
              <div className="absolute top-full right-0 mt-3 w-64 md:w-80 bg-white shadow-2xl rounded border border-gray-200 z-[60] overflow-hidden">
                <div className="py-2">
                  {isLoading ? (
                    [1, 2, 3].map((n) => (
                      <div key={n} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0">
                        <Skeleton className="w-10 h-10 shrink-0 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))
                  ) : filteredResults.length > 0 ? (
                    filteredResults.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} onClick={() => { setFilteredResults([]); setIsSearchOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                        {post.photo ? (
                          <img src={post.photo} alt="" className="w-10 h-10 shrink-0 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 shrink-0 bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-400">No Image</div>
                        )}
                        <p className="text-gray-800 text-sm font-medium line-clamp-2 leading-snug">{post.title}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 italic">नतिजा भेटिएन</div>
                  )}
                </div>
                {filteredResults.length > 0 && !isLoading && (
                  <button onClick={handleSearch} className="w-full bg-gray-50 py-2 text-xs text-[#213a59] font-bold border-t hover:bg-gray-100">
                    सबै नतिजाहरू हेर्नुहोस् »
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}