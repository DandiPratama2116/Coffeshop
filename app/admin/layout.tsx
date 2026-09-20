"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./admin.css";

interface ReservationNotify {
  id: number;
  customer_name: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  number_of_people: number;
  description: string;
  status: string;
  created_at: string;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "grid_view" },
  { href: "/admin/reports", label: "Laporan", icon: "bar_chart" },
  { href: "/admin/orders", label: "Pesanan", icon: "receipt_long" },
  { href: "/admin/reservations", label: "Reservasi", icon: "event_seat", isReservation: true },
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

  // State Notifikasi Reservasi Realtime
  const [pendingReservations, setPendingReservations] = useState<ReservationNotify[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [incomingToast, setIncomingToast] = useState<ReservationNotify | null>(null);
  const knownIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  const checkReservations = async () => {
    try {
      const res = await fetch(`${apiBase}/admin/reservations`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const pendings: ReservationNotify[] = result.data.filter((r: ReservationNotify) => r.status === "pending");
        setPendingReservations(pendings);

        if (!isFirstLoadRef.current) {
          // Cari apakah ada reservasi baru yang belum pernah muncul
          const newReservation = pendings.find((r) => !knownIdsRef.current.has(r.id));
          if (newReservation) {
            playNotificationChime();
            setIncomingToast(newReservation);
            setTimeout(() => setIncomingToast(null), 8000);
          }
        }

        // Simpan semua ID yang sudah diketahui
        const newSet = new Set<number>();
        pendings.forEach((r) => newSet.add(r.id));
        knownIdsRef.current = newSet;
        isFirstLoadRef.current = false;
      }
    } catch (err) {
      // Abaikan error koneksi sementara saat polling
    }
  };

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      setTimeout(() => {
        router.replace("/admin/login");
      }, 0);
    } else {
      const nextAdminName = localStorage.getItem("admin_name") || "Grace Stanley";
      const timer = window.setTimeout(() => {
        setAdminName(nextAdminName);
        setIsLoading(false);
      }, 0);

      // Jalankan pengecekan reservasi secara realtime
      checkReservations();
      const interval = setInterval(checkReservations, 6000);

      return () => {
        window.clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [pathname, router]);

  // Tutup dropdown notifikasi saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("admin_session_id");
    try {
      await fetch(`${apiBase}/admin/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId || "" }),
      });
    } catch (e) {
      console.error("Gagal request logout:", e);
    } finally {
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_name");
      localStorage.removeItem("admin_session_id");
      router.replace("/admin/login");
    }
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

  const pendingCount = pendingReservations.length;

  return (
    <div className="min-h-screen flex font-sans antialiased admin-shell overflow-hidden" style={{ background: '#f0f2f5' }}>
      {/* Toast Alert Melayang Saat Ada Reservasi Baru Masuk - Bersih & Elegan */}
      {incomingToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white text-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">event_seat</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Reservasi Masuk</span>
              <button
                onClick={() => setIncomingToast(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{incomingToast.customer_name}</p>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {incomingToast.description || `${incomingToast.reservation_date.substring(0, 10)} jam ${incomingToast.reservation_time}`}
            </p>
            <div className="mt-2.5">
              <button
                onClick={() => {
                  setIncomingToast(null);
                  router.push("/admin/reservations");
                }}
                className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium transition-colors cursor-pointer"
              >
                Lihat & Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-40 transform transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: '#2d4744' }}
      >
        {/* Logo Brand */}
        <div className="flex items-center gap-3 px-6 pt-7 pb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d1a85c, #a37c35)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>local_cafe</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-[15px] leading-tight tracking-wide">Caffe Shop</h1>
            <p className="text-[11px] font-medium tracking-widest uppercase mt-0.5" style={{ color: '#d1a85c' }}>Admin Workspace</p>
          </div>
        </div>

        {/* Nav Label */}
        <p className="px-6 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(209,168,92,0.55)' }}>Menu Utama</p>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-200 active:scale-[0.97] focus:outline-none group"
                style={{
                  color: isActive ? '#2d3f3d' : 'rgba(255,255,255,0.65)',
                  background: isActive ? '#dedad2' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="material-symbols-outlined flex-shrink-0"
                    style={{
                      fontSize: '20px',
                      fontVariationSettings: "'FILL' 1",
                      color: '#d1a85c',
                      opacity: isActive ? 1 : 0.65,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {/* Badge Notifikasi Realtime di Sidebar */}
                {item.isReservation && pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 mt-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-[10px] rounded-xl text-sm font-medium w-full transition-all duration-150 active:scale-[0.97] group cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.55)', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '19px', color: 'rgba(209,168,92,0.7)' }}>logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen lg:ml-[260px] overflow-hidden">
        {/* Top Header Navbar - Glassmorphism */}
        <header className="sticky top-0 z-20 glass-header px-6 py-4 flex items-center justify-between gap-4 h-[72px]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-indigo-600 focus:outline-none transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>

          {/* Admin profile & Notifications */}
          <div className="flex items-center gap-5">
            {/* Lonceng Notifikasi Realtime dengan Dropdown */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                title="Notifikasi Reservasi"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {pendingCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Dropdown Menu Notifikasi - Bersih & Rapi */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">Notifikasi Reservasi</span>
                    {pendingCount > 0 && (
                      <span className="text-[11px] font-medium text-slate-500">
                        {pendingCount} Menunggu
                      </span>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {pendingCount === 0 ? (
                      <div className="p-6 text-center text-slate-400">
                        <p className="text-xs">Tidak ada reservasi menunggu</p>
                      </div>
                    ) : (
                      pendingReservations.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col gap-1 text-xs cursor-pointer"
                          onClick={() => {
                            setShowNotifDropdown(false);
                            router.push("/admin/reservations");
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">{item.customer_name}</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {item.reservation_time}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] line-clamp-1">
                            {item.description || "Permintaan Meja"}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                            <span>{item.reservation_date.substring(0, 10)} • {item.number_of_people} Tamu</span>
                            <span className="font-medium text-slate-700 hover:underline">Lihat Detail →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50/50">
                    <Link
                      href="/admin/reservations"
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors inline-block"
                    >
                      Buka Semua Reservasi →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group active:scale-[0.97] transition-all p-1.5 rounded-2xl hover:bg-slate-50">
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
        <main className="flex-1 overflow-y-auto p-6 md:p-8" style={{ background: '#f0f2f5' }}>
          <div key={pathname} className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}