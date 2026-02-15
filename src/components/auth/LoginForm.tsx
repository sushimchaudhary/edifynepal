"use client"
import React, { useEffect, useState } from "react";
import { loginUser } from "../../services/authServices";
import api from "../../api/axiosInstance";
import { Eye, EyeOff, Lock } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await api.get("/api/company/company-details/");
        if (res.data && res.data.length > 0) {
          setLogo(res.data[0].logo);
        }
      } catch (err) {
        console.error("Logo fetch error:", err);
      }
    };
    fetchLogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await loginUser(credentials);

      if (response) {
        const user = response.user || response;

        Cookies.set("is_superuser", String(user.is_superuser), { expires: 7 });
        Cookies.set("is_staff", String(user.is_staff), { expires: 7 });
        Cookies.set("userName", user.first_name || user.username, {
          expires: 7,
        });
      }

      setSuccess("स्वागत छ! लगइन सफल भयो।");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      console.error("Login Error:", err);
      const status = err.response?.status;

      if (status === 401) {
        setError("तपाईंको युजरनेम वा पासवर्ड मिलेन।");
      } else if (err.message === "Network Error") {
        setError("इन्टरनेट कनेक्सनमा समस्या देखियो।");
      } else {
        setError("युजरनेम वा पासवर्ड गलत छ। कृपया फेरि प्रयास गर्नुहोस्।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans flex flex-col ">
      <header className="py-2 px-4 border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto flex items-center gap-4">
    <Link href={"/"}>
      {logo ? (
        <img src={logo} alt="Logo" className="h-12 md:h-14 object-contain" />
      ) : (
        <div className="h-12 md:h-14 w-24 bg-gray-50 animate-pulse" /> // Skeleton Loader (Optional)
      )}
    </Link>
    <span className="text-gray-800 text-sm md:text-md font-bold">
      पढ्न रुचाउनेहरूको पत्रिका !
    </span>
  </div>
</header>

      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 px-4 py-10  items-center">
        <div className="flex flex-col justify-start w-full">
          <h1 className="text-[#213a59] text-3xl md:text-4xl font-bold mb-6">
            साइन इन
          </h1>

          {error && (
            <div className="text-red-600 p-2 bg-red-50 border border-red-100 rounded mb-5 text-[12px] flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-2 rounded mb-5 text-[12px] border border-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                युजरनेम
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#1e695e] transition-all text-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                पासवर्ड
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e695e] transition-colors">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#1e695e] transition-all text-sm"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className=" text-[#2db7d1] font-bold hover:underline"
              >
                पासवर्ड बिर्सनुभयो ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full md:w-auto bg-[#213a59] hover:bg-[#1c3e67] rounded text-white font-bold py-1.5 px-12 transition-colors shadow-sm disabled:bg-gray-400 flex items-center justify-center min-w-[140px]"
            >
              {loading
                ? "प्रक्रियामा..."
                : success
                  ? "Redirecting..."
                  : "साइन इन"}
            </button>
          </form>
        </div>

        <div className="hidden md:flex items-center justify-center border-l border-gray-200 pl-10">
          <img
            src="/edify.png"
            alt="Showcase"
            className="w-full max-w-md object-contain"
          />
        </div>
      </main>
    </div>
  );
}
