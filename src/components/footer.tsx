"use client"
import { useEffect, useState } from "react";

import { Facebook, Instagram, Linkedin, Loader2, Send } from "lucide-react";

import api from "../api/axiosInstance";
import { categoryService } from "../services/categoryServices";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [company, setCompany] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const XIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      width="1em"
      height="1em"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [companyRes, catRes] = await Promise.all([
          api.get("/api/company/company-details/"),
          categoryService.getDetails(),
        ]);

        if (companyRes.data && companyRes.data.length > 0) {
          setCompany(companyRes.data[0]);
        }

        const rawCats = catRes?.data || catRes;
        if (Array.isArray(rawCats)) {
          setCategories(rawCats.filter((c: any) => c.is_active));
        }
      } catch (err) {
        console.error("Footer data load failed", err);
      }
    };
    fetchFooterData();
  }, []);

  const navigationCats = categories
    .filter((c) => c.name.trim() !== "रिपोर्ट" && c.name.trim() !== "मनका कुरा")
    .slice(0, 5);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeStatus(null);
    try {
      await api.post("/api/communication/subscribers/", {
        email: subscribeEmail,
      });
      setSubscribeStatus({ type: "success", text: "दर्ता सफल भयो!" });
      setSubscribeEmail("");
    } catch (err: any) {
      const errorMsg = err.response?.data?.email?.[0];
      setSubscribeStatus({
        type: "error",
        text:
          errorMsg === "subscriber with this email already exists."
            ? "पहिले नै दर्ता छ।"
            : "प्रयास असफल भयो।",
      });
    } finally {
      setSubscribeLoading(false);
      setTimeout(() => setSubscribeStatus(null), 5000);
    }
  };

  return (
    <footer className="w-full font-sans border-t border-[#33b9d2]">
      <div className="bg-[#476c98] text-white py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="space-y-3">
            <Link href="/" className="relative block group">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 pointer-events-none"></div>

              <div className="relative bg-white/15 backdrop-blur-sm rounded-xl p-2 border border-white/10 hover:border-[#33b9d2]/50 transition-all duration-500">
                <img
                  src={company?.logo}
                  alt="Logo"
                  className="h-24 md:h-28 w-full object-contain brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
              </div>
            </Link>
            <div className="flex gap-2 text-white">
              {company?.fb_link && (
                <a
                  href={company.fb_link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full hover:text-[#33b9d2] transition-all border border-transparent hover:border-[#33b9d2]"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {company?.x_link && (
                <a
                  href={company.x_link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full hover:text-[#33b9d2] transition-all border border-transparent hover:border-[#33b9d2]"
                >
                  <XIcon className="w-5 h-5" />
                </a>
              )}
              {company?.insta_link && (
                <a
                  href={company.insta_link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full hover:text-[#33b9d2] transition-all border border-transparent hover:border-[#33b9d2]"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {company?.linkedin_link && (
                <a
                  href={company.linkedin_link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full hover:text-[#33b9d2] transition-all border border-transparent hover:border-[#33b9d2]"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3 text-white border-r border-[#33b9d2]/30 ">
            <h3 className="text-lg font-bold uppercase tracking-wider pb-2 border-b border-[#33b9d2]/30 inline-block">
              सम्पर्क
            </h3>
            <div className="text-[14px] space-y-2">
              <p className="font-semibold ">{company?.name}</p>
              <p className="opacity-90">{company?.address}</p>
              <p className="opacity-90">
                फोन:{" "}
                <a
                  href={`tel:${company?.contact_no}`}
                  className="hover:text-[#33b9d2]"
                >
                  {company?.contact_no}
                </a>
              </p>
              <p className="opacity-90">
                इमेल:{" "}
                <a
                  href={`mailto:${company?.email}`}
                  className="hover:text-[#33b9d2]"
                >
                  {company?.email}
                </a>
              </p>
            </div>
          </div>

          <div className=" border-r border-[#33b9d2]/30 ">
            <ul className="space-y-1 text-[14px]">
              {navigationCats.map((cat) => (
                <li key={cat.id} className="group flex items-center gap-2">
                  <span className="h-[1px] w-0 bg-[#33b9d2] transition-all duration-300 group-hover:w-3"></span>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group-hover:text-[#33b9d2] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className=" border-r border-[#33b9d2]/30 ">
            <ul className="space-y-1 text-[14px]">
              <li className="group flex items-center gap-2">
                <span className="h-[1px] w-0 bg-[#33b9d2] transition-all duration-300 group-hover:w-3"></span>
                <Link href="/" className="group-hover:text-[#33b9d2]">
                  गृह पृष्ठ
                </Link>
              </li>
              <li className="group flex items-center gap-2">
                <span className="h-[1px] w-0 bg-[#33b9d2] transition-all duration-300 group-hover:w-3"></span>
                <Link href="/about-us" className="group-hover:text-[#33b9d2]">
                  हाम्रा बारे
                </Link>
              </li>

              <li className="group flex items-center gap-2">
                <span className="h-[1px] w-0 bg-[#33b9d2] transition-all duration-300 group-hover:w-3"></span>
                <Link href="/advertisement" className="group-hover:text-[#33b9d2]">
                  विज्ञापन
                </Link>
              </li>

              <li className="group flex items-center gap-2">
                <span className="h-[1px] w-0 bg-[#33b9d2] transition-all duration-300 group-hover:w-3"></span>
                <Link href="/contact" className="group-hover:text-[#33b9d2]">
                  सम्पर्क
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest">
                Download Our App
              </p>
              <img
                src="/google.png"
                alt="Play Store"
                className="h-10 border border-[#33b9d2]/30 rounded-md p-1 cursor-pointer hover:border-[#33b9d2] transition-colors"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest">
                न्यूजलेटर सदस्यता
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="तपाईंको इमेल..."
                  className="w-full bg-[#1a2e47] border border-[#33b9d2]/30 rounded px-3 py-2 text-xs outline-none focus:border-[#33b9d2] text-white placeholder:text-gray-400"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                />
                <button
                  disabled={subscribeLoading}
                  className="w-full bg-[#33b9d2] hover:bg-[#289eb4] text-[#213a59] px-4 py-2 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-2"
                >
                  {subscribeLoading ? (
                    <Loader2 className="animate-spin w-3 h-3" />
                  ) : (
                    <>
                      <Send size={12} /> SUBSCRIBE
                    </>
                  )}
                </button>
                {subscribeStatus && (
                  <p
                    className={`text-[10px] font-bold text-center ${subscribeStatus.type === "success" ? "text-green-400" : "text-red-400"}`}
                  >
                    {subscribeStatus.text}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a2e47] text-gray-400 py-6 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm">
            © {currentYear} <span className="text-white">{company?.name}</span>.
            All rights reserved.
          </p>
          <div className="text-xs md:text-sm">
            Developed by:{" "}
            <span className="text-[#33b9d2] font-bold">Shempa Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
