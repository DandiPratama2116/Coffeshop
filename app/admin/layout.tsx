"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./admin.css";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "grid_view" },
  { href: "/admin/reports", label: "Laporan", icon: "bar_chart" },
  { href: "/admin/orders", label: "Pesanan", icon: "receipt_long" },
  { href: "/admin/menu", label: "Menu Produk", icon: "restaurant_menu" },
  { href: "/admin/categories", label: "Kategori", icon: "category" },
  { href: "/admin/tables", label: "Meja & QR", icon: "table_restaurant" },
  { href: "/admin/promos", label: "Promo", icon: "local_offer" },
  { href: "/admin/settings", label: "Pengaturan", icon: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      router.replace("/admin/login");
    } else {
      const nextAdminName = localStorage.getItem("admin_name") || "Grace Stanley";
      const timer = window.setTimeout(() => {
        setAdminName(nextAdminName);
        setIsLoading(false);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("admin_session_id");
    if (sessionId) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/admin/Logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
      } catch (e) {
        console.error("Logout API failed", e);
      }
    }
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_session_id");
    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center admin-shell">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          <p className="text-slate-500 text-sm font-medium tracking-wide">Menyiapkan Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-700 admin-shell overflow-hidden">
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Sleek Dark Theme */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f172a] text-slate-300 z-40 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl border-r border-slate-800
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Subtle glowing orb in background */}
        <div className="absolute top-0 left-0 w-full h-48 bg-indigo-500/10 blur-[50px] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Brand */}
          <div className="flex items-center gap-4 px-6 py-8 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <span className="material-symbols-outlined text-xl">local_cafe</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-wide leading-tight">Caffe Norma</h1>
              <p className="text-xs text-indigo-300 font-medium tracking-wider uppercase mt-0.5">Admin Workspace</p>
            </div>
          </div>

          {/* Navigasi Utama */}
          <nav aria-label="Navigasi admin" className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Menu Utama</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3.5 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl group
                    ${isActive
                      ? "bg-indigo-500/15 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                  )}
                  
                  <span
                    className={`material-symbols-outlined transition-colors duration-200 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}
                    style={{ fontSize: "20px", fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Tombol Logout */}
          <div className="p-4 border-t border-slate-800/60 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/10 w-full group"
            >
              <span className="material-symbols-outlined text-slate-500 group-hover:text-rose-400 transition-colors" style={{ fontSize: "20px" }}>
                logout
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen lg:ml-[260px] overflow-hidden">
        {/* Top Header Navbar - Glassmorphism */}
        <header className="sticky top-0 z-20 glass-header px-6 py-4 flex items-center justify-between gap-4 h-[72px]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-indigo-600 focus:outline-none transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            
            {pathname === "/admin/menu" && (
              <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-full border border-slate-200/60 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all w-64">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2">search</span>
                <input type="text" placeholder="Cari menu produk..." className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400 text-slate-700" />
              </div>
            )}
          </div>

          {/* Admin profile */}
          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-50"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{adminName}</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Administrator</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-md group-hover:ring-indigo-100 transition-all">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}&backgroundColor=e2e8f0`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          <div key={pathname} className="w-full max-w-7xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}