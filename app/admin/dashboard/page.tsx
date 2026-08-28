"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/app/coffeshop-order/_data/menuData";

interface Order {
  id: string;
  tableId: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "ready" | "done";
  time: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  processing: { label: "Diproses", bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  ready: { label: "Siap", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  done: { label: "Selesai", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
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

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    fetch(`${apiBase}/admin/orders`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const mapped = result.data.map((o: any) => ({
            id: String(o.id),
            tableId: String(o.table_id),
            items: o.order_items ? o.order_items.map((i: any) => ({ name: "Menu ID " + i.menu_id, qty: i.quantity, price: i.price })) : [],
            total: o.total_amount,
            status: o.status,
            time: new Date(o.created_at).toLocaleTimeString()
          }));
          setOrders(mapped);
        }
      })
      .catch(console.error);
  }, []);

  const totalRevenue = orders.filter(o => o.status === "done").reduce((a, b) => a + b.total, 0);
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
          <p className="text-sm text-slate-500 mt-1 font-medium">Pantau aktivitas restoran dan penjualan secara real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Update
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon="receipt_long" label="Total Pesanan" value={String(todayOrders)} sub={`${pendingOrders} menunggu proses`} gradient="from-indigo-500 to-blue-600 shadow-blue-500/30" delay="stagger-1" />
        <StatCard icon="payments" label="Pendapatan" value={`Rp ${(totalRevenue / 1000).toFixed(0)}k`} sub="Dari pesanan selesai" gradient="from-emerald-400 to-teal-500 shadow-teal-500/30" delay="stagger-2" />
        <StatCard icon="restaurant_menu" label="Menu Aktif" value={String(activeMenus)} sub={`${MENU_CATEGORIES.length} kategori menu`} gradient="from-purple-500 to-indigo-500 shadow-purple-500/30" delay="stagger-3" />
        <StatCard icon="pending_actions" label="Perlu Diproses" value={String(pendingOrders)} sub="Menunggu tindakan" gradient="from-rose-400 to-orange-500 shadow-rose-500/30" delay="stagger-4" />
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