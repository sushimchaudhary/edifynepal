'use client'; // Navbar वा ToastProvider मा interactivity छ भने यो चाहिन्छ

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ToastProvider from "@/components/toastProvider";
import type { ReactNode } from "react";

interface FrontendLayoutProps {
  children: ReactNode; 
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <ToastProvider />
    </div>
  );
}