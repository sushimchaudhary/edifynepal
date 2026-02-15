

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-[#1e695e] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2 bg-[#1e695e] text-white font-bold rounded-md hover:bg-[#155048] transition-all"
      >
        <ArrowLeft size={16} />
        Go Back
      </Link>
    </div>
  );
}