"use client"
import React, { useEffect, useState } from "react";

import {
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  EyeOff,
  Eye,
} from "lucide-react";
import api from "../../api/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function RegisterForm({
  onSuccess,
  onCancel,
  isModal = false,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isModal) {
      const fetchLogo = async () => {
        try {
          const res = await api.get("/api/company/company-details/");
          if (res.data && res.data.length > 0) setLogo(res.data[0].logo);
        } catch (err) {
          console.error("Logo fetch error:", err);
        }
      };
      fetchLogo();
    }
  }, [isModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/auth/register-editor/", formData);
      setSuccess("खाता सफलतापूर्वक सिर्जना भयो!");
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      } else {
        setTimeout(() => router.push("/login"), 1000);
      }
    } catch (err: any) {
      const serverError = err.response?.data;
      if (serverError?.email) setError("यो इमेल पहिले नै प्रयोगमा छ।");
      else if (serverError?.username) setError("यो युजरनेम उपलब्ध छैन।");
      else setError("दर्ता प्रक्रियामा समस्या देखियो।");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = isModal
    ? "text-[10px] font-bold text-gray-400 uppercase tracking-wider block"
    : "text-gray-600 font-bold text-[11px] uppercase tracking-wider block";

  const inputClass = `w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none transition-all shadow-sm focus:border-[#213a59] ${isModal ? "bg-white" : "bg-gray-50 focus:bg-white"}`;

  return (
    <div className={`font-sans ${!isModal ? " bg-white" : "w-full"}`}>
      {!isModal && (
        <header className="py-2 px-4 border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Link href={"/"}>
              <img src={logo} alt="Logo" className="h-12 object-contain" />
            </Link>
            <span className="text-gray-800 text-sm font-bold">
              पढ्न रुचाउनेहरूको पत्रिका !
            </span>
          </div>
        </header>
      )}

      <main
        className={`${isModal ? "w-full" : "max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-10 items-center"}`}
      >
        <div className="w-full">
          {!isModal && (
            <h1 className="text-[#213a59] font-bold text-3xl md:text-4xl mb-6">
              साइन अप (दर्ता)
            </h1>
          )}

          <form
            onSubmit={handleSubmit}
            className={`${isModal ? "pt-2" : "space-y-4"}`}
          >
            <div
              className={`${isModal ? "lg:p-4 p-2 space-y-2" : "space-y-4"}`}
            >
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 p-2.5 rounded text-[11px] font-bold">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 p-2.5 rounded text-[11px] font-bold">
                  <CheckCircle size={14} /> {success}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>नाम *</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    className={inputClass}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>थर *</label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    className={inputClass}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>इमेल ठेगाना *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={inputClass}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>युजरनेम *</label>
                  <input
                    type="text"
                    name="username"
                    required
                    className={inputClass}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>पासवर्ड *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      className={`${inputClass} pr-10`}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#213a59] cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${isModal ? "mt-1 flex justify-end gap-2 px-4 py-3 border-t border-gray-300 bg-gray-50/50" : "pt-4"}`}
            >
              {isModal && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-1.5 rounded text-red-500 text-[11px] border border-red-500 font-bold uppercase hover:bg-red-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                className={`bg-[#213a59] hover:bg-[#1b3c64] text-white font-bold py-1.5 px-4 rounded shadow-sm transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 text-[11px] uppercase cursor-pointer ${!isModal ? "w-full md:w-auto" : ""}`}
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isModal ? (
                  <Save size={14} />
                ) : (
                  <UserPlus size={14} />
                )}
                {loading
                  ? "प्रक्रियामा..."
                  : isModal
                    ? "Save"
                    : "साइन अप गर्नुहोस्"}
              </button>
            </div>

            {!isModal && (
              <div className="pt-2 text-gray-500 text-sm text-center md:text-left">
                पहिले नै खाता छ ?{" "}
                <Link
                  href="/login"
                  className="text-[#2db7d1] font-bold hover:underline"
                >
                  साइन इन गर्नुहोस्
                </Link>
              </div>
            )}
          </form>
        </div>

        {!isModal && (
          <div className="hidden md:flex items-center justify-center border-l border-gray-100 pl-10">
            <img
              src="/edify.png"
              alt="Register"
              className="max-h-[50vh] object-contain"
            />
          </div>
        )}
      </main>
    </div>
  );
}
