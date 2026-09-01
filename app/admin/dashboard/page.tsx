"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/app/coffeshop-order/_data/menuData";

interface Order {
  id: string;
  tableId: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "ready" | "done" | "completed";
  time: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  processing: { label: "Diproses", bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  ready: { label: "Siap", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  done: { label: "Selesai", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
  completed: { label: "Selesai", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
};

function StatCard({ icon, label, value, sub, gradient, delay }: { icon: string; label: string; value: string; sub?: string; gradient: string; delay: string }) {
  return (
    <div className={`bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover-lift animate-fade-in-up ${delay}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${gradient} shadow-md`}>
          <span className="material-symbols-outlined text-white" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-slate-800 text-3xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-slate-400 text-xs font-medium mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span> {sub}
        </p>}
      </div>
    </div>
  );
}

interface TableAreaSummary {
  area: string;
  total_tables: number;
  available_tables: number;
  occupied_tables: number;
  total_capacity: number;
  available_capacity: number;
  occupied_capacity: number;
}

interface CafeSettingsData {
  openTime: string;
  closeTime: string;
  openDays: string;
  isOpen: boolean;
  name: string;
  operationalHours?: any[];
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<CafeSettingsData>({
    openTime: "08:00",
    closeTime: "22:00",
    openDays: "Senin - Minggu",
    isOpen: true,
    name: "Coffee Shop",
    operationalHours: [],
  });
  const [areaSummaries, setAreaSummaries] = useState<TableAreaSummary[]>([]);
  const [totalSeatsAvailable, setTotalSeatsAvailable] = useState(0);
  const [totalSeatsCapacity, setTotalSeatsCapacity] = useState(0);
  const [totalTablesAvailable, setTotalTablesAvailable] = useState(0);
  const [totalTablesCount, setTotalTablesCount] = useState(0);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchDashboardData = () => {
    // 1. Fetch Orders
    fetch(`${apiBase}/admin/orders`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const mapped = result.data.map((o: any) => ({
            id: String(o.id),
            tableId: String(o.table_id),
            items: o.items ? o.items.map((i: any) => ({ name: "Menu ID " + i.menu_id, qty: i.quantity, price: i.price })) : [],
            total: o.total_amount,
            status: o.status,
            time: new Date(o.created_at).toLocaleTimeString()
          }));
          setOrders(mapped);
        }
      })
      .catch(console.error);

    // 2. Fetch Settings (Jam Operasional)
    fetch(`${apiBase}/admin/settings`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(result => {
        if (result.success && result.data) {
          setSettings({
            openTime: result.data.open_time || "08:00",
            closeTime: result.data.close_time || "22:00",
            openDays: result.data.open_days || "Senin - Minggu",
            isOpen: result.data.is_open !== undefined ? result.data.is_open : true,
            name: result.data.name || "Coffee Shop",
            operationalHours: result.data.operational_hours ? (typeof result.data.operational_hours === 'string' ? JSON.parse(result.data.operational_hours) : result.data.operational_hours) : [],
          });
        }
      })
      .catch(() => {
        const s = localStorage.getItem("admin_settings");
        if (s) {
          try {
            const parsed = JSON.parse(s);
            setSettings({
              openTime: parsed.openTime || "08:00",
              closeTime: parsed.closeTime || "22:00",
              openDays: parsed.openDays || "Senin - Minggu",
              isOpen: parsed.isOpen !== undefined ? parsed.isOpen : true,
              name: parsed.name || "Coffee Shop",
              operationalHours: parsed.operationalHours || [],
            });
          } catch (e) {
            console.error(e);
          }
        }
      });

    // 3. Fetch Table Summary & Capacities (VIP, Indoor, Outdoor)
    fetch(`${apiBase}/admin/tables/summary`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(result => {
        if (result.success && result.data) {
          setAreaSummaries(result.data.areas || []);
          setTotalSeatsAvailable(result.data.available_capacity || 0);
          setTotalSeatsCapacity(result.data.total_capacity || 0);
          setTotalTablesAvailable(result.data.available_tables || 0);
          setTotalTablesCount(result.data.total_tables || 0);
        }
      })
      .catch(() => {
        // Fallback hitung manual dari /admin/tables
        fetch(`${apiBase}/admin/tables`)
          .then(res => res.json())
          .then(result => {
            if (result.success && result.data) {
              const tables = result.data;
              const map: Record<string, TableAreaSummary> = {};
              let totCap = 0, availCap = 0, totTab = 0, availTab = 0;

              tables.forEach((t: any) => {
                const area = t.seating_area || "Indoor";
                const cap = t.capacity || 4;
                if (!map[area]) {
                  map[area] = {
                    area,
                    total_tables: 0,
                    available_tables: 0,
                    occupied_tables: 0,
                    total_capacity: 0,
                    available_capacity: 0,
                    occupied_capacity: 0,
                  };
                }
                map[area].total_tables++;
                map[area].total_capacity += cap;
                totTab++;
                totCap += cap;

                if (t.status === "available") {
                  map[area].available_tables++;
                  map[area].available_capacity += cap;
                  availTab++;
                  availCap += cap;
                } else {
                  map[area].occupied_tables++;
                  map[area].occupied_capacity += cap;
                }
              });

              setAreaSummaries(Object.values(map));
              setTotalSeatsAvailable(availCap);
              setTotalSeatsCapacity(totCap);
              setTotalTablesAvailable(availTab);
              setTotalTablesCount(totTab);
            }
          })
          .catch(console.error);
      });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchDashboardData();
    }, 100);
    const interval = setInterval(fetchDashboardData, 10000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  // Hitung status buka/tutup toko saat ini
  const isStoreCurrentlyOpen = (() => {
    if (!settings.isOpen) return false;
    try {
      const daysMap: {[key: number]: string} = { 0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' };
      const today = daysMap[new Date().getDay()];
      const todaySchedule = settings.operationalHours?.find((h: any) => h.day === today);
      
      if (todaySchedule && todaySchedule.isClosed) return false;
      
      const openTimeStr = todaySchedule ? todaySchedule.open : settings.openTime;
      const closeTimeStr = todaySchedule ? todaySchedule.close : settings.closeTime;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [openH, openM] = openTimeStr.split(":").map(Number);
      const [closeH, closeM] = closeTimeStr.split(":").map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;
      
      if (closeMinutes > openMinutes) {
        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
      } else {
        // Toko melewati tengah malam (e.g. 18:00 - 02:00)
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
      }
    } catch (e) {
      return true;
    }
  })();

  const totalRevenue = orders.filter(o => o.status === "done" || o.status === "completed").reduce((a, b) => a + b.total, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const todayOrders = orders.length;
  const activeMenus = MENU_ITEMS.length;

  const topItems: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!topItems[item.name]) topItems[item.name] = { name: item.name, count: 0, revenue: 0 };
      topItems[item.name].count += item.qty;
      topItems[item.name].revenue += item.qty * item.price;
    });
  });
  const topItemsSorted = Object.values(topItems).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxCount = topItemsSorted[0]?.count || 1;

  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Ringkasan Hari Ini</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Pantau aktivitas restoran, jam operasional, dan tempat duduk secara real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync
          </span>
        </div>
      </div>

      {/* 1. OPERATIONAL HOURS & STORE STATUS BANNER (TERHUBUNG KE SETTINGS) */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e293b] to-[#0f172a] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isStoreCurrentlyOpen
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
          }`}>
            <span className="material-symbols-outlined text-3xl">
              {isStoreCurrentlyOpen ? "storefront" : "door_front"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isStoreCurrentlyOpen
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-400/30"
              }`}>
                <span className={`w-2 h-2 rounded-full ${isStoreCurrentlyOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
                {isStoreCurrentlyOpen ? "Sedang Buka" : "Sedang Tutup"}
              </span>
              <p className="text-xs text-slate-400">Status Operasional Cafe</p>
            </div>
            {(() => {
              const daysMap: {[key: number]: string} = { 0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' };
              const today = daysMap[new Date().getDay()];
              const todaySchedule = settings.operationalHours?.find((h: any) => h.day === today);
              let todayOpen = settings.openTime;
              let todayClose = settings.closeTime;
              let isTodayClosed = false;

              if (todaySchedule) {
                todayOpen = todaySchedule.open;
                todayClose = todaySchedule.close;
                isTodayClosed = todaySchedule.isClosed;
              }
              
              if (isTodayClosed) {
                return (
                  <h3 className="text-lg font-bold text-rose-400 mt-1">
                    Hari Ini Tutup
                  </h3>
                );
              }
              
              return (
                <>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Jam Buka: <span className="text-[#d1a85c]">{todayOpen} – {todayClose} WIB</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">
                    Hari Operasional: <span className="text-white font-semibold">Senin - Minggu</span>
                  </p>
                </>
              );
            })()}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
          <div className="text-left md:text-right">
            <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Kapasitas Kursi Resto</p>
            <p className="text-sm font-bold text-emerald-400">
              Sisa {totalSeatsAvailable} dari {totalSeatsCapacity} Kursi
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Ubah Jam Operasional
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon="receipt_long" label="Total Pesanan" value={String(todayOrders)} sub={`${pendingOrders} menunggu proses`} gradient="from-indigo-500 to-blue-600 shadow-blue-500/30" delay="stagger-1" />
        <StatCard icon="payments" label="Pendapatan" value={`Rp ${(totalRevenue / 1000).toFixed(0)}k`} sub="Dari pesanan selesai" gradient="from-emerald-400 to-teal-500 shadow-teal-500/30" delay="stagger-2" />
        <StatCard icon="table_restaurant" label="Meja Tersedia" value={`${totalTablesAvailable} / ${totalTablesCount}`} sub={`Sisa ${totalSeatsAvailable} kursi`} gradient="from-purple-500 to-indigo-500 shadow-purple-500/30" delay="stagger-3" />
        <StatCard icon="pending_actions" label="Perlu Diproses" value={String(pendingOrders)} sub="Menunggu tindakan" gradient="from-rose-400 to-orange-500 shadow-rose-500/30" delay="stagger-4" />
      </div>

      {/* 3. WIDGET KETERSEDIAAN TEMPAT DUDUK REAL-TIME (VIP, INDOOR, OUTDOOR) */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3B4CB8]">chair</span>
              <h3 className="text-slate-800 font-extrabold text-lg tracking-tight">Ketersediaan Tempat Duduk & Meja Real-time</h3>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Data sinkron otomatis dengan pemesanan pelanggan (berkurang otomatis saat diduduki customers).
            </p>
          </div>
          <Link
            href="/admin/tables"
            className="text-xs font-bold text-[#3B4CB8] hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all flex items-center gap-1 w-fit"
          >
            Kelola Meja & Kapasitas <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Cards Per Area (VIP, Indoor, Outdoor) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {areaSummaries.length === 0 ? (
            <div className="col-span-3 py-8 text-center text-slate-400 text-xs">Memuat data tempat duduk...</div>
          ) : (
            areaSummaries.map((area) => {
              const isVIP = area.area.toLowerCase().includes("vip");
              const isOutdoor = area.area.toLowerCase().includes("outdoor");
              const occupancyPercent = area.total_tables > 0
                ? Math.round((area.occupied_tables / area.total_tables) * 100)
                : 0;
              const isFull = area.available_tables === 0;

              return (
                <div
                  key={area.area}
                  className={`p-5 rounded-2xl border transition-all hover:shadow-md ${
                    isVIP
                      ? "bg-gradient-to-b from-amber-50/50 to-white border-amber-200/80 shadow-amber-500/5"
                      : isOutdoor
                      ? "bg-gradient-to-b from-emerald-50/40 to-white border-emerald-200/80"
                      : "bg-gradient-to-b from-indigo-50/40 to-white border-indigo-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        isVIP
                          ? "bg-amber-100 text-amber-700"
                          : isOutdoor
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {isVIP ? "👑" : isOutdoor ? "🌿" : "☕"}
                      </span>
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm tracking-tight">{area.area}</h4>
                        <p className="text-slate-400 text-[11px] font-medium">{area.total_tables} Meja ({area.total_capacity} Kursi)</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      isFull
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : occupancyPercent > 50
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                      {isFull ? "Penuh" : occupancyPercent > 0 ? "Terisi Sebagian" : "Tersedia"}
                    </span>
                  </div>

                  {/* Big Number Sisa Meja & Kursi */}
                  <div className="bg-white/80 rounded-xl p-3.5 border border-slate-100 my-3 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Sisa Meja Tersedia</p>
                      <p className="text-xl font-black text-slate-800">
                        {area.available_tables} <span className="text-xs font-semibold text-slate-400">/ {area.total_tables} Meja</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Sisa Kursi</p>
                      <p className={`text-xl font-black ${area.available_capacity > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {area.available_capacity} <span className="text-xs font-semibold text-slate-400">/ {area.total_capacity}</span>
                      </p>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>Keterisian ({area.occupied_tables} meja diduduki)</span>
                      <span>{occupancyPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? "bg-rose-500"
                            : isVIP
                            ? "bg-gradient-to-r from-amber-400 to-amber-500"
                            : "bg-gradient-to-r from-[#3B4CB8] to-indigo-400"
                        }`}
                        style={{ width: `${occupancyPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-2">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col justify-between relative">
          <div className="px-7 py-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-slate-800 font-bold text-lg tracking-tight">Pesanan Terbaru</h2>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">5 pesanan terakhir masuk</p>
            </div>
            <Link href="/admin/orders" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5">
              Lihat Semua <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
            </Link>
          </div>
          
          <div className="flex-1 p-3">
            {recentOrders.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-slate-300 text-3xl">receipt_long</span>
                </div>
                <p className="text-slate-800 font-semibold text-sm">Belum ada pesanan</p>
                <p className="text-slate-400 text-xs mt-1">Pesanan yang masuk akan tampil di sini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        <span className="text-slate-600 group-hover:text-indigo-600 text-sm font-bold">T{order.tableId}</span>
                      </div>
                      <div>
                        <p className="text-slate-800 text-sm font-bold">#{order.id.padStart(5, '0')}</p>
                        <p className="text-slate-500 text-xs mt-1 max-w-[200px] sm:max-w-[300px] truncate">
                          {order.items.map(i => i.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-slate-800 text-sm font-extrabold font-inter">Rp {order.total.toLocaleString("id-ID")}</p>
                      <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wider ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].text} ${STATUS_CONFIG[order.status].border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[order.status].dot}`}></span>
                        {STATUS_CONFIG[order.status].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Menu - Visual Graphic */}
        <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
          <div className="px-7 py-6 border-b border-slate-50">
            <h2 className="text-slate-800 font-bold text-lg tracking-tight">Menu Terlaris</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Berdasarkan kuantitas terjual</p>
          </div>
          <div className="p-7 space-y-6 flex-1 bg-gradient-to-b from-white to-slate-50/50">
            {topItemsSorted.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs font-medium">Belum ada data penjualan</div>
            ) : (
              topItemsSorted.map((item, idx) => (
                <div key={item.name} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-slate-700 text-sm font-semibold truncate max-w-[180px] group-hover:text-indigo-600 transition-colors">
                      <span className="text-slate-400 mr-2 font-bold text-xs">0{idx + 1}</span>
                      {item.name}
                    </p>
                    <p className="text-slate-800 text-sm font-bold">{item.count} <span className="text-slate-400 text-xs font-normal">porsi</span></p>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full relative overflow-hidden"
                      style={{ width: `${Math.max(5, (item.count / maxCount) * 100)}%` }}
                    >
                      {/* Shine effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="animate-fade-in-up stagger-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: "/admin/menu", icon: "restaurant_menu", label: "Kelola Menu", desc: "Tambah/Edit hidangan", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
            { href: "/admin/orders", icon: "receipt_long", label: "Pesanan Masuk", desc: "Pantau pesanan aktif", gradient: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/20" },
            { href: "/admin/tables", icon: "table_restaurant", label: "Manajemen Meja", desc: "Atur QR & status meja", gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
            { href: "/admin/reports", icon: "bar_chart", label: "Laporan Penjualan", desc: "Lihat metrik omset", gradient: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/20" },
          ].map(q => (
            <Link
              key={q.href}
              href={q.href}
              className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-3 hover-lift group relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${q.gradient} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}></div>
              
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${q.gradient} shadow-lg ${q.shadow} flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>{q.icon}</span>
              </div>
              <div>
                <p className="text-slate-800 text-sm font-bold mb-0.5 group-hover:text-indigo-600 transition-colors">{q.label}</p>
                <p className="text-slate-400 text-xs font-medium">{q.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}