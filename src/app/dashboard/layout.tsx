// "use client";

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useMemo,
// } from "react";
// import { Dropdown, type MenuProps } from "antd";
// import Cookies from "js-cookie";
// import { usePathname, useRouter } from "next/navigation"; 
// import Link from "next/link";
// import { companyService } from "@/services/companyServices";

// import {
//   Menu,
//   Bell,
//   ChevronDown,
//   LogOut,
//   LayoutDashboard,
//   Building2,
//   Newspaper,
//   Info,
//   Settings,
//   type LucideIcon,
//   Tag,
//   MessageCircle,
//   User,
//   LockKeyhole,
//   Contact,
//   Megaphone,
// } from "lucide-react";

// import ToastProvider from "@/components/toastProvider";
// import ChangePasswordModal from "../auth/change-password/page";

// // Types
// interface SubMenuItem { icon: LucideIcon; label: string; href: string; }
// interface MenuItem { icon: LucideIcon; label: string; href?: string; submenu?: SubMenuItem[]; }
// interface NavItemProps { item: MenuItem; sidebarOpen: boolean; onItemClick?: () => void; }

// const NavItem: React.FC<NavItemProps> = ({ item, sidebarOpen, onItemClick }) => {
//   const pathname = usePathname(); 
//   const hasSubmenu = !!(item.submenu && item.submenu.length > 0);
//   const isActive = pathname === item.href;
//   const isSubActive = hasSubmenu && item.submenu?.some((sub) => pathname === sub.href);
//   const [isOpen, setIsOpen] = useState(!!isSubActive);

//   useEffect(() => {
//     if (isSubActive) setIsOpen(true);
//   }, [isSubActive]);

//   return (
//     <div className="w-full">
//       <Link
//         href={hasSubmenu ? "#" : item.href || "#"}
//         onClick={(e) => {
//           if (hasSubmenu) {
//             e.preventDefault();
//             setIsOpen(!isOpen);
//           } else if (onItemClick) {
//             onItemClick();
//           }
//         }}
//         className={`flex items-center justify-between px-3 py-2 rounded-md transition-all ${
//           isActive && !hasSubmenu
//             ? "bg-[#2db7d1]/10 text-[#2db7d1]"
//             : isSubActive
//               ? "text-[#2db7d1] bg-gray-100"
//               : "text-gray-600 hover:bg-gray-50 hover:text-[#2db7d1] group"
//         }`}
//       >
//         <div className="flex items-center gap-2">
//           <item.icon size={16} className={`${isActive || isSubActive ? "text-[#2db7d1]" : "text-gray-400 group-hover:text-[#2db7d1]"} transition-colors`} />
//           {sidebarOpen && (
//             <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive || isSubActive ? "text-[#2db7d1]" : ""}`}>
//               {item.label}
//             </span>
//           )}
//         </div>
//         {sidebarOpen && hasSubmenu && (
//           <ChevronDown size={14} className={`transition-transform duration-300 ${isActive || isSubActive ? "text-[#2db7d1]" : "text-gray-400"} ${isOpen ? "rotate-180" : ""}`} />
//         )}
//       </Link>
//       {sidebarOpen && hasSubmenu && isOpen && (
//         <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
//           {item.submenu?.map((sub) => {
//             const isChildActive = pathname === sub.href;
//             return (
//               <Link
//                 key={sub.label}
//                 href={sub.href}
//                 onClick={onItemClick}
//                 className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${isChildActive ? "bg-[#2db7d1]/10 text-[#2db7d1]" : "text-gray-500 hover:text-[#2db7d1]"}`}
//               >
//                 <sub.icon size={14} className={isChildActive ? "text-[#2db7d1]" : "text-gray-400"} />
//                 {sub.label}
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [company, setCompany] = useState<any>(null);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter(); 
//   const pathname = usePathname();
//   const [isCPModalOpen, setIsCPModalOpen] = useState(false);
//   const [notifCount, setNotifCount] = useState<number>(0);

//   const isSuperuser = Cookies.get("is_superuser") === "true";
//   const isStaff = Cookies.get("is_staff") === "true";
//   const userName = Cookies.get("userName") || "Admin";

//   // Auth Check
//   useEffect(() => {
//     const token = Cookies.get("accessToken");
//     if (!token) {
//       router.push("/auth/login");
//     } else {
//       setIsAuthLoading(false);
//     }
//   }, [router]);

//   // Fetch Data
//   useEffect(() => {
//     if (!isAuthLoading) {
//       const fetchCompany = async () => {
//         try {
//           const data = await companyService.getDetails();
//           if (data && data.length > 0) setCompany(data[0]);
//         } catch (err) {
//           console.error("Layout Fetch Error:", err);
//         }
//       };
//       fetchCompany();
//     }
//   }, [isAuthLoading]);

//   // Notification Sync
//   useEffect(() => {
//     if (pathname === "/dashboard/contact") {
//       setNotifCount(0);
//     }
//   }, [pathname]);

//   const handleLogout = () => {
//     ["accessToken", "refreshToken", "is_superuser", "is_staff", "userName"].forEach(c => Cookies.remove(c));
//     window.location.href = "/auth/login";
//   };

//   const dropdownItems: MenuProps["items"] = [
   
//     ...(isSuperuser 
//       ? [{ 
//           key: "settings", 
//           label: <Link href="/dashboard/company" className="flex items-center gap-2 font-bold text-xs"><Settings size={14} /> Settings</Link> 
//         }] 
//       : []),
//     { 
//       key: "password", 
//       label: <div onClick={() => setIsCPModalOpen(true)} className="flex items-center gap-2 font-bold text-xs"><LockKeyhole size={14} /> Change Password</div> 
//     },
//     { type: "divider" as const },
//     { 
//       key: "logout", 
//       danger: true, 
//       label: <div onClick={handleLogout} className="flex items-center gap-2 font-bold text-xs"><LogOut size={14} /> Log Out</div> 
//     },
//   ];
//   const fullMenu: MenuItem[] = [
//     { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
//     { icon: Building2, label: "Company", href: "/dashboard/company" },
//     { icon: Info, label: "About", href: "/dashboard/about-us" },
//     { icon: Tag, label: "Category", href: "/dashboard/category" },
//     { icon: Newspaper, label: "Blog", href: "/dashboard/blog" },
//     { icon: Megaphone, label: "Ads", href: "/dashboard/ads" },
//     { icon: User, label: "User", href: "/dashboard/user" },
//     { icon: MessageCircle, label: "Communication", submenu: [{ icon: Contact, label: "Contact", href: "/dashboard/contact" }, { icon: Bell, label: "Subscribe", href: "/dashboard/subscribe" }] },
//   ];

//   const filteredMenu = useMemo(() => {
//     if (isSuperuser) return fullMenu; 
    
//     if (isStaff) {
//       const allowed = ["Dashboard", "Blog", "Ads", "Communication", "Category"]; 
//       return fullMenu.filter((item) => allowed.includes(item.label));
//     }
    

//     return fullMenu.filter((item) => item.label === "Dashboard");
//   }, [isSuperuser, isStaff]);

//   if (isAuthLoading) {
//     return (
//       <div className="h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2db7d1]" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-[#F3F4F6] text-gray-800 font-sans overflow-hidden">
//       <ToastProvider />
//       <ChangePasswordModal isOpen={isCPModalOpen} onClose={() => setIsCPModalOpen(false)} />

//       <aside className={`${sidebarOpen ? "w-45" : "w-14"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-50 shadow-sm`}>
//         <div className="p-1 flex flex-col border-b border-gray-100">
//           <Link href="/">
//             <div className="flex overflow-hidden shrink-0">
//               {company?.logo ? (
//                 <img src={company.logo} alt="Logo" className={`${sidebarOpen ? "h-12" : "h-8"} w-full object-contain transition-all duration-300`} />
//               ) : (
//                 <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
//                   <span className="text-[#2db7d1] font-black text-[10px]">L</span>
//                 </div>
//               )}
//             </div>
//           </Link>
//         </div>
//         <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
//           {filteredMenu.map((item) => (
//             <NavItem key={item.label} item={item} sidebarOpen={sidebarOpen} onItemClick={() => window.innerWidth < 768 && setSidebarOpen(false)} />
//           ))}
//         </nav>
//       </aside>

//       <div className="flex-1 flex flex-col min-w-0">
//         <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-2 sticky top-0 z-30 shadow-sm">
//           <div className="flex items-center gap-2">
//             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md bg-gray-50 text-gray-500 hover:text-[#2db7d1] hover:bg-[#2db7d1]/10 transition-all border border-gray-100">
//               <Menu size={20} />
//             </button>
//             <div className="text-center">
//               <p className="font-extrabold uppercase text-[10px] text-gray-800 truncate tracking-tight text-start">{company?.name}</p>
//               <p className="text-[#2db7d1] font-bold text-[7px] uppercase tracking-widest pr-2">{isSuperuser ? "Super Access" : "Staff Access"}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1 lg:gap-4">
//             <Link href="/dashboard/contact" className="relative p-2 rounded-full text-gray-400 hover:text-[#2db7d1] hover:bg-gray-100 transition-all">
//               <Bell size={20} />
//               {notifCount > 0 && <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 animate-bounce flex items-center justify-center">{notifCount}</span>}
//             </Link>
//             <div className="h-8 w-px bg-gray-200 mx-2" />
//             <div className="relative pt-3" ref={dropdownRef}>
//               <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={["click"]}>
//                 <button className="flex items-center gap-2 p-1 rounded-full cursor-pointer hover:bg-gray-50 transition-all outline-none">
//                   <div className="w-8 h-8 rounded-full bg-[#2db7d1] flex items-center justify-center text-white text-xs font-bold shadow-md">{userName[0].toUpperCase()}</div>
//                   <ChevronDown size={14} className="text-gray-400" />
//                 </button>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
//           <div className="max-w-7xl mx-auto">
//             {children} 
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Dropdown, type MenuProps } from "antd";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation"; 
import Link from "next/link";
import { companyService } from "@/services/companyServices";

import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Building2,
  Newspaper,
  Info,
  Settings,
  type LucideIcon,
  Tag,
  MessageCircle,
  User,
  LockKeyhole,
  Contact,
  Megaphone,
} from "lucide-react";

import ToastProvider from "@/components/toastProvider";
import ChangePasswordModal from "@/components/auth/ChangePasswordModel";

// Types
interface SubMenuItem { icon: React.ElementType; label: string; href: string; }
interface MenuItem { icon: React.ElementType; label: string; href?: string; submenu?: SubMenuItem[]; }
interface NavItemProps { item: MenuItem; sidebarOpen: boolean; onItemClick?: () => void; }

const NavItem: React.FC<NavItemProps> = ({ item, sidebarOpen, onItemClick }) => {
  const pathname = usePathname(); 
  const hasSubmenu = !!(item.submenu && item.submenu.length > 0);
  const isActive = pathname === item.href;
  const isSubActive = hasSubmenu && item.submenu?.some((sub) => pathname === sub.href);
  const [isOpen, setIsOpen] = useState(!!isSubActive);

  useEffect(() => {
    if (isSubActive) setIsOpen(true);
  }, [isSubActive]);

  return (
    <div className="w-full">
      <Link
        href={hasSubmenu ? "#" : item.href || "#"}
        onClick={(e) => {
          if (hasSubmenu) {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (onItemClick) {
            onItemClick();
          }
        }}
        className={`flex items-center justify-between px-3 py-2 rounded-md transition-all ${
          isActive && !hasSubmenu
            ? "bg-[#2db7d1]/10 text-[#2db7d1]"
            : isSubActive
              ? "text-[#2db7d1] bg-gray-100"
              : "text-gray-600 hover:bg-gray-50 hover:text-[#2db7d1] group"
        }`}
      >
        <div className="flex items-center gap-2">
          <item.icon size={16} className={`${isActive || isSubActive ? "text-[#2db7d1]" : "text-gray-400 group-hover:text-[#2db7d1]"} transition-colors`} />
          {sidebarOpen && (
            <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive || isSubActive ? "text-[#2db7d1]" : ""}`}>
              {item.label}
            </span>
          )}
        </div>
        {sidebarOpen && hasSubmenu && (
          <ChevronDown size={14} className={`transition-transform duration-300 ${isActive || isSubActive ? "text-[#2db7d1]" : "text-gray-400"} ${isOpen ? "rotate-180" : ""}`} />
        )}
      </Link>
      {sidebarOpen && hasSubmenu && isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
          {item.submenu?.map((sub) => {
            const isChildActive = pathname === sub.href;
            return (
              <Link
                key={sub.label}
                href={sub.href}
                onClick={onItemClick}
                className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${isChildActive ? "bg-[#2db7d1]/10 text-[#2db7d1]" : "text-gray-500 hover:text-[#2db7d1]"}`}
              >
                <sub.icon size={14} className={isChildActive ? "text-[#2db7d1]" : "text-gray-400"} />
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); 
  const pathname = usePathname();
  const [isCPModalOpen, setIsCPModalOpen] = useState(false);
  const [notifCount, setNotifCount] = useState<number>(0);

  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isStaff = Cookies.get("is_staff") === "true";
  const userName = Cookies.get("userName") || "Admin";

  // Auth Check
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthLoading(false);
    }
  }, [router]);

  // Fetch Data
  useEffect(() => {
    if (!isAuthLoading) {
      const fetchCompany = async () => {
        try {
          const data = await companyService.getDetails();
          if (data && data.length > 0) setCompany(data[0]);
        } catch (err) {
          console.error("Layout Fetch Error:", err);
        }
      };
      fetchCompany();
    }
  }, [isAuthLoading]);

  // Notification Sync
  useEffect(() => {
    if (pathname === "/dashboard/contact") {
      setNotifCount(0);
    }
  }, [pathname]);

  const handleLogout = () => {
    ["accessToken", "refreshToken", "is_superuser", "is_staff", "userName"].forEach(c => Cookies.remove(c));
    window.location.href = "/auth/login";
  };

  // ✅ Settings Option केवल Superuser को लागि मात्र
  const dropdownItems: MenuProps["items"] = [
    ...(isSuperuser 
      ? [{ 
          key: "settings", 
          label: <Link href="/dashboard/company" className="flex items-center gap-2 font-bold text-xs"><Settings size={14} /> Settings</Link> 
        }] 
      : []),
    { 
      key: "password", 
      label: <div onClick={() => setIsCPModalOpen(true)} className="flex items-center gap-2 font-bold text-xs"><LockKeyhole size={14} /> Change Password</div> 
    },
    { type: "divider" as const },
    { 
      key: "logout", 
      danger: true, 
      label: <div onClick={handleLogout} className="flex items-center gap-2 font-bold text-xs"><LogOut size={14} /> Log Out</div> 
    },
  ];

  const fullMenu: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Building2, label: "Company", href: "/dashboard/company" },
    { icon: Info, label: "About", href: "/dashboard/about-us" },
    { icon: Tag, label: "Category", href: "/dashboard/category" },
    { icon: Newspaper, label: "Blog", href: "/dashboard/blog" },
    { icon: Megaphone, label: "Ads", href: "/dashboard/ads" },
    { icon: User, label: "User", href: "/dashboard/user" },
    { icon: MessageCircle, label: "Communication", submenu: [{ icon: Contact, label: "Contact", href: "/dashboard/contact" }, { icon: Bell, label: "Subscribe", href: "/dashboard/subscribe" }] },
  ];

  // ✅ Sidebar मा पनि Staff को लागि Settings (Company) हटाउन
  const filteredMenu = useMemo(() => {
    if (isSuperuser) return fullMenu; 
    if (isStaff) {
      const allowed = ["Dashboard", "Blog", "Ads", "Communication", "Category"]; 
      return fullMenu.filter((item) => allowed.includes(item.label));
    }
    return fullMenu.filter((item) => item.label === "Dashboard");
  }, [isSuperuser, isStaff]);

  if (isAuthLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2db7d1]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-gray-800 font-sans overflow-hidden">
      <ToastProvider />
      <ChangePasswordModal isOpen={isCPModalOpen} onClose={() => setIsCPModalOpen(false)} />

      <aside className={`${sidebarOpen ? "w-45" : "w-14"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-50 shadow-sm`}>
        <div className="p-1 flex flex-col border-b border-gray-100">
          <Link href="/">
            <div className="flex overflow-hidden shrink-0">
              {company?.logo ? (
                <img src={company.logo} alt="Logo" className={`${sidebarOpen ? "h-12" : "h-8"} w-full object-contain transition-all duration-300`} />
              ) : (
                <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-[#2db7d1] font-black text-[10px]">L</span>
                </div>
              )}
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => (
            <NavItem key={item.label} item={item} sidebarOpen={sidebarOpen} onItemClick={() => window.innerWidth < 768 && setSidebarOpen(false)} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-2 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md bg-gray-50 text-gray-500 hover:text-[#2db7d1] hover:bg-[#2db7d1]/10 transition-all border border-gray-100">
              <Menu size={20} />
            </button>
            <div className="text-center">
              <p className="font-extrabold uppercase text-[10px] text-gray-800 truncate tracking-tight text-start">{company?.name}</p>
              <p className="text-[#2db7d1] font-bold text-[7px] uppercase tracking-widest pr-2">{isSuperuser ? "Super Access" : "Staff Access"}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 lg:gap-4">
            <Link href="/dashboard/contact" className="relative p-2 rounded-full text-gray-400 hover:text-[#2db7d1] hover:bg-gray-100 transition-all">
              <Bell size={20} />
              {notifCount > 0 && <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 animate-bounce flex items-center justify-center">{notifCount}</span>}
            </Link>
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <div className="relative pt-3" ref={dropdownRef}>
              <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={["click"]}>
                <button className="flex items-center gap-2 p-1 rounded-full cursor-pointer hover:bg-gray-50 transition-all outline-none">
                  <div className="w-8 h-8 rounded-full bg-[#2db7d1] flex items-center justify-center text-white text-xs font-bold shadow-md">{userName[0].toUpperCase()}</div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children} 
          </div>
        </main>
      </div>
    </div>
  );
}