"use client"
import React, { useState, useEffect } from "react";
import {
  Facebook,
  
  Instagram,
  Linkedin,
  Loader2,
 
} from "lucide-react";
import api from "../../../api/axiosInstance";
import FrontendLayout from "../../../components/layout/frontendLayout";
import { showSuccess, showError } from "../../../utils/toastUtils";

export default function ContactSection() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);
 


 

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    message: "",
  });


  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("<iframe")) {
      const match = url.match(/src="([^"]+)"/);
      if (match) url = match[1];
    }
    if (url.includes("pb=") || url.includes("embed")) return url;
    const baseUrl = url.split("?")[0];
    const separator = url.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}output=embed`;
  };
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    aria-hidden="true" 
    className={className} 
    fill="currentColor"
    width="1.2em"
    height="1.5em"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await api.get("/api/company/company-details/");
        if (res.data && res.data.length > 0) setCompany(res.data[0]);
      } catch (err) {
        console.error("Failed to load contact info", err);
      }
    };
    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/communication/contacts/", formData);
      showSuccess("तपाईंको सन्देश सफलपूर्वक पठाइयो!");
      setFormData({ fullname: "", email: "", message: "" });
    } catch (err) {
      showError("सन्देश पठाउन असफल भयो। फेरि प्रयास गर्नुहोस्।");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <FrontendLayout>
      <section className="max-w-7xl mx-auto px-4 py-8 font-sans text-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0  overflow-hidden ">
          <div className="md:col-span-4 p-8 border-r border-gray-100">
            <h2 className="text-xl font-bold mb-6">
              हामीलाई सन्देश पठाउनुहोस्
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="पूरा नाम"
                className="w-full p-1.5 border border-gray-300 rounded focus:border-[#213a59] outline-none text-sm"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
              <input
                type="email"
                required
                placeholder="इमेल ठेगाना"
                className="w-full p-1.5 border border-gray-300 rounded focus:border-[#213a59] outline-none text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <textarea
                required
                placeholder="तपाईंको सन्देश यहाँ लेख्नुहोस्..."
                rows={5}
                className="w-full p-1.5 border border-gray-300 rounded focus:border-[#213a59] outline-none text-sm"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>



              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#213a59] text-white py-1.5  rounded  font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "सन्देश पठाउनुहोस्"
                )}
              </button>
            </form>
          </div>

        
          <div className="md:col-span-3 p-8 border-r border-gray-100/30">
            <h2 className="text-xl font-bold mb-6">हाम्रो कार्यालय</h2>
            <div className="space-y-2.5 text-[14px]">
              <div>
                <p className="font-bold text-[#213a59] mb-1 uppercase text-[11px] tracking-wider">
                  ठेगाना
                </p>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {company?.address || "लोड हुँदै..."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-gray-600">
                  <p className="font-bold text-black text-[11px] uppercase tracking-wider">
                    फोन नम्बर:
                  </p>
                  <a
                    href={`tel:${company?.contact_no}`}
                    className="text-[#213a59] hover:underline block mt-1"
                  >
                    {company?.contact_no}
                  </a>
                </div>
                <div className="text-gray-600">
                  <p className="font-bold text-black text-[11px] uppercase tracking-wider">
                    इमेल:
                  </p>
                  <a
                    href={`mailto:${company?.email}`}
                    className="text-[#213a59] hover:underline block mt-1"
                  >
                    {company?.email}
                  </a>
                </div>
              </div>

              <hr className="border-gray-200 mt-5" />

{/*             
              <div className="">
                <p className="font-bold text-black text-[11px] uppercase tracking-wider mb-2">
                  न्यूजलेटर सदस्यता
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="तपाईंको इमेल..."
                    className="w-full p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#213a59]"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                  />
                  <button
                    disabled={subscribeLoading}
                    className="bg-black text-white px-4 py-2 rounded text-[12px] font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
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
                      className={`text-[10px] font-bold mt-1 ${subscribeStatus.type === "success" ? "text-green-600" : "text-red-600"}`}
                    >
                      {subscribeStatus.text}
                    </p>
                  )}
                </form>
              </div> */}

              <div className="flex gap-2 pt-2">
                {[
                  {
                    icon: Facebook,
                    link: company?.fb_link,
                    className: "text-[#213a59] hover:bg-[#49c0d7]/10",
                  },
                  {
                    icon: XIcon,
                    link: company?.x_link,
                    className: "text-[#213a59] hover:bg-[#49c0d7]/10",
                  },
                  {
                    icon: Instagram,
                    link: company?.insta_link,
                    className: "text-[#213a59]  hover:bg-[#49c0d7]/10",
                  },
                  {
                    icon: Linkedin,
                    link: company?.linkedin_link,
                    className: "text-[#213a59]  hover:bg-[#49c0d7]/10",
                  },
                ].map(
                  (social, idx) =>
                    social.link && (
                      <a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded transition-all ${social.className}`}
                      >
                        <social.icon size={18} />
                      </a>
                    ),
                )}
              </div>
            </div>
          </div>

          {/* ३. म्याप सेक्सन */}
          <div className="md:col-span-5 flex flex-col bg-gray-100">
            <div className="relative w-full h-[400px] md:h-full">
              {company?.google_map ? (
                <iframe
                  src={getEmbedUrl(company.google_map)}
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Location"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  म्याप उपलब्ध छैन
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </FrontendLayout>
  );
}
