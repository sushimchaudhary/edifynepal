// import { useState } from "react";
// import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import api from "@/api/axiosInstance";

// export default function ResetPassword() {
//   const { uidb64, token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setStatus({ type: "error", text: "Passwords do not match!" });
//       return;
//     }

//     setLoading(true);
//     setStatus(null);

//     try {
//       await api.post("/api/auth/reset-password/", {
//         uidb64: uidb64,
//         token: token,
//         new_password: password,
//       });

//       setStatus({ 
//         type: "success", 
//         text: "Password updated successfully! Redirecting to login..." 
//       });
      
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (err: any) {
//       const errorMsg = err.response?.data?.new_password 
//         ? err.response.data.new_password[0] 
//         : "Invalid token or expired link.";
        
//       setStatus({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
//       <div className="max-w-md w-full bg-white rounded shadow-2xl relative overflow-hidden transform transition-all animate-in zoom-in duration-300">
        
//         <div className="h-1.5 bg-[#2db7d1] w-full"></div>

//         <div className="p-4">
//           <div className="flex flex-col items-center text-center mb-8">
//             <div className="p-3 bg-[#2db7d1]/10 rounded-2xl mb-3 shadow-inner">
//               <ShieldCheck className="text-[#213a59]" size={32} />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
//             <p className="text-[12px] text-gray-500 mt-1">
//               Create a strong password for your account security.
//             </p>
//           </div>

//           {status?.type === "success" && (
//             <div className="mb-6 p-2 text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
//               <CheckCircle2 size={18} className="shrink-0" />
//               <span>{status.text}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-2">
//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
//                 New Password
//               </label>
//               <div className="relative group">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400  transition-colors">
//                   <Lock size={14} />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-12 py-1.5 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#213a59]  focus:ring-[#213a59]/10 text-sm transition-all"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
//                 Confirm Password
//               </label>
//               <div className="relative group">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#213a59] transition-colors">
//                   <Lock size={14} />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#213a59]  focus:ring-[#213a59]/10 text-sm transition-all"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Error Message */}
//             {status?.type === "error" && (
//               <div className="text-red-700 text-[10px] flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
//                 <AlertCircle size={12} className="shrink-0" />
//                 <span>{status.text}</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading || status?.type === "success"}
//               className="w-full mt-3 bg-[#213a59] hover:bg-[#164e46] text-white font-bold py-1.5 rounded shadow-md hover:shadow-teal-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin" size={14} />
//                   <span>Resetting...</span>
//                 </>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
//           </form>

//           <div className="mt-3 text-center border-t border-gray-100 pt-2">
//             <Link to="/login" className="text-[10px] font-bold text-gray-400 hover:text-[#213a59] transition-colors uppercase tracking-widest">
//                 Cancel & Return to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client"; 

import { useState, use } from "react"; 
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/api/axiosInstance";

interface PageProps {
  params: Promise<{ uidb64: string; token: string }>;
}

export default function ResetPassword({ params }: PageProps) {
  
  const { uidb64, token } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await api.post("/api/auth/reset-password/", {
        uidb64: uidb64,
        token: token,
        new_password: password,
      });

      setStatus({ 
        type: "success", 
        text: "Password updated successfully! Redirecting to login..." 
      });
      
      // router.push प्रयोग गर्ने
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.new_password 
        ? err.response.data.new_password[0] 
        : "Invalid token or expired link.";
        
      setStatus({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded shadow-2xl relative overflow-hidden transform transition-all">
        
        <div className="h-1.5 bg-[#2db7d1] w-full"></div>

        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-[#2db7d1]/10 rounded-2xl mb-3 shadow-inner">
              <ShieldCheck className="text-[#213a59]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
            <p className="text-[12px] text-gray-500 mt-1">
              Create a strong password for your account security.
            </p>
          </div>

          {status?.type === "success" && (
            <div className="mb-6 p-2 text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-bold flex items-center gap-3">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#213a59] focus:ring-[#213a59]/10 text-sm transition-all text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#213a59] transition-colors">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:bg-white focus:border-[#213a59] focus:ring-[#213a59]/10 text-sm transition-all text-black"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {status?.type === "error" && (
              <div className="text-red-700 text-[10px] flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                <span>{status.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || status?.type === "success"}
              className="w-full mt-3 bg-[#213a59] hover:bg-[#164e46] text-white font-bold py-2 rounded shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Resetting...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-4 text-center border-t border-gray-100 pt-4">
            <Link href="/auth/login" className="text-[10px] font-bold text-gray-400 hover:text-[#213a59] transition-colors uppercase tracking-widest">
                Cancel & Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}