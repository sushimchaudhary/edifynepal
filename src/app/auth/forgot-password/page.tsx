"use client";

import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "@/api/axiosInstance";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/forgot-password/", { email });
      setMessage({
        type: "success",
        text: "A password reset link has been sent to your email.",
      });
      setEmail("");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "This email was not found in our system. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded shadow-2xl relative overflow-hidden transform transition-all animate-in zoom-in duration-300">
        <div className="h-1.5 bg-[#2db7d1] w-full"></div>

        <div className="p-4">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-[#2db7d1]/10 rounded-2xl mb-3 shadow-inner">
              <Mail className="text-[#213a59]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Forgot Password?
            </h2>
            <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
              Don't worry! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          {message?.type === "success" && (
            <div className="mb-6 p-2 text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#213a59] transition-colors">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#213a59]  focus:ring-[#213a59]/10 text-sm transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message Layout */}
            {message?.type === "error" && (
              <div className="text-red-700 text-[10px] flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                <AlertCircle size={12} className="shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#213a59] hover:bg-[#1c3e67]  text-white font-bold py-1.5 rounded shadow-md hover:shadow-teal-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>sending...</span>
                </>
              ) : (
                "Send"
              )}
            </button>
          </form>

          <div className="mt-3 text-center border-t border-gray-100 pt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#213a59] transition-all uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
