"use client";

import { useState } from "react";

type Period = "today" | "week" | "month";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  category?: string;
}

interface Transaction {
  id: string;
  tableId: string;
  total: number;
  items: OrderItem[];
  status?: "pending" | "processing" | "ready" | "done";
  date: string;
  time: string;
}

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

function readTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("admin_orders");
  if (!saved) return [];

  try {
    return JSON.parse(saved).map((order: Omit<Transaction, "date" | "items"> & { items: OrderItem[]; date?: string }) => ({
      ...order,
      date: order.date || new Date().toISOString().split("T")[0],
      items: Array.isArray(order.items) ? order.items : [],
    }));
  } catch {
    return [];
  }
}

function MetricCard({ icon, label, value, detail, iconBg, iconColor }: { icon: string; label: string; value: string; detail: string; iconBg: string; iconColor: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <span className="material-symbols-outlined text-slate-300 text-lg">north_east</span>
      </div>
      <p className="text-slate-400 text-xs font-semibold mt-4">{label}</p>
      <p className="text-slate-800 text-xl sm:text-2xl font-bold tracking-tight mt-1">{value}</p>
      <p className="text-slate-400 text-[11px] font-medium mt-1.5">{detail}</p>
    </div>
  );
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [transactions] = useState<Transaction[]>(readTransactions);
  const today = new Date().toISOString().split("T")[0];
  const start = new Date();
  if (period === "week") start.setDate(start.getDate() - 6);
  if (period === "month") start.setDate(1);
  const startDate = start.toISOString().split("T")[0];
  const filtered = transactions.filter(transaction => transaction.date >= (period === "today" ? today : startDate));
  const completed = filtered.filter(transaction => !transaction.status || transaction.status === "done");
  const totalRevenue = completed.reduce((sum, transaction) => sum + transaction.total, 0);
  const totalOrders = completed.length;
  const averageOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const totalItems = completed.reduce((sum, transaction) => sum + transaction.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0);

  const categoryRows = [
    { label: "Coffee", value: completed.reduce((sum, transaction) => sum + transaction.items.filter(item => item.category === "Coffee").reduce((itemSum, item) => itemSum + item.qty, 0), 0), color: "bg-[#3B4CB8]", icon: "local_cafe" },
    { label: "Food", value: completed.reduce((sum, transaction) => sum + transaction.items.filter(item => item.category === "Food").reduce((itemSum, item) => itemSum + item.qty, 0), 0), color: "bg-indigo-400", icon: "restaurant" },
    { label: "Non-Coffee", value: completed.reduce((sum, transaction) => sum + transaction.items.filter(item => item.category === "Non-Coffee").reduce((itemSum, item) => itemSum + item.qty, 0), 0), color: "bg-emerald-500", icon: "local_drink" },
  ];
  const maxCategory = Math.max(...categoryRows.map(row => row.value), 1);

  const monthlyRevenue = chartMonths.map((_, monthIndex) => completed
    .filter(transaction => new Date(transaction.date).getMonth() === monthIndex)
    .reduce((sum, transaction) => sum + transaction.total, 0));
  const maxRevenue = Math.max(...monthlyRevenue, 1);
  const chartValues = monthlyRevenue.map(value => value ? 12 + (value / maxRevenue) * 76 : 0);
  const hasChartData = monthlyRevenue.some(value => value > 0);
  const points = chartValues.map((value, index) => `${(index * 100) / (chartValues.length - 1)},${108 - value}`).join(" ");
  const areaPoints = `0,108 ${points} 100,108`;

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Bisnis</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pantau performa pendapatan dan penjualan Coffee Shop</p>
        </div>
        <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/60 self-start sm:self-auto">
          {([["today", "Hari Ini"], ["week", "7 Hari"], ["month", "Bulan Ini"]] as [Period, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${period === value ? "bg-white text-[#3B4CB8] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon="payments" label="Total Pendapatan" value={formatRupiah(totalRevenue)} detail="Pendapatan bersih" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <MetricCard icon="receipt_long" label="Total Pesanan" value={String(totalOrders)} detail={`${totalItems} item terjual`} iconBg="bg-indigo-50" iconColor="text-[#3B4CB8]" />
        <MetricCard icon="trending_up" label="Rata-rata Pesanan" value={formatRupiah(averageOrder)} detail="Nilai per transaksi" iconBg="bg-amber-50" iconColor="text-amber-600" />
        <MetricCard icon="groups" label="Pelanggan" value={String(totalOrders || 0)} detail="Pelanggan terlayani" iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <section className="xl:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h3 className="text-slate-800 font-bold text-base">Tren Pendapatan</h3>
              <p className="text-slate-400 text-xs mt-0.5">Performa penjualan sepanjang tahun</p>
            </div>
            {hasChartData && <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-xs font-bold">Data aktual</span>}
          </div>
          <div className="relative h-60 sm:h-64">
            <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-slate-400 pointer-events-none">
              {["Rp 100k", "Rp 75k", "Rp 50k", "Rp 25k", "Rp 0"].map(label => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-12 text-right font-medium">{label}</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>
              ))}
            </div>
            <svg viewBox="0 0 100 108" preserveAspectRatio="none" className="absolute left-16 right-2 top-2 bottom-7 w-[calc(100%-4.5rem)] h-[calc(100%-2.25rem)] overflow-visible" role="img" aria-label="Grafik tren pendapatan">
              <defs>
                <linearGradient id="report-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B4CB8" stopOpacity=".2" />
                  <stop offset="100%" stopColor="#3B4CB8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {hasChartData && <polygon points={areaPoints} fill="url(#report-area)" />}
              {hasChartData && <polyline points={points} fill="none" stroke="#3B4CB8" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />}
              {hasChartData && chartValues.map((value, index) => value > 0 && (
                <circle key={index} cx={(index * 100) / (chartValues.length - 1)} cy={108 - value} r="2" fill="#ffffff" stroke="#3B4CB8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <div className="absolute left-16 right-2 bottom-0 flex justify-between text-[11px] text-slate-400 font-medium">{chartMonths.map(month => <span key={month}>{month}</span>)}</div>
            {!hasChartData && <p className="absolute inset-x-0 bottom-12 text-center text-xs text-slate-400">Belum ada data pendapatan</p>}
          </div>
        </section>

        {/* Top Categories */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-slate-800 font-bold text-base">Kategori Terlaris</h3>
                <p className="text-slate-400 text-xs mt-0.5">Distribusi item terjual</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">more_horiz</span>
            </div>
            <div className="space-y-5">
              {categoryRows.map(row => {
                const percentage = Math.round((row.value / maxCategory) * 100);
                return (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`${row.color} w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm`}>
                          <span className="material-symbols-outlined text-base">{row.icon}</span>
                        </span>
                        <span className="text-slate-700 text-xs font-semibold">{row.label}</span>
                      </div>
                      <span className="text-slate-800 text-xs font-bold">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Kategori Aktif</span>
            <span className="text-slate-800 text-xs font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">6 Kategori</span>
          </div>
        </section>
      </div>

      {/* Recent Transactions Table */}
      <section className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-800 font-bold text-base">Transaksi Terbaru</h3>
            <p className="text-slate-400 text-xs mt-0.5">Aktivitas penjualan pada periode terpilih</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">receipt_long</span>
        </div>

        {completed.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">bar_chart</span>
            </div>
            <p className="text-slate-800 font-bold text-sm">Belum Ada Transaksi</p>
            <p className="text-slate-400 text-xs mt-1">Tidak ditemukan transaksi pada periode ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {completed.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] font-bold text-xs flex items-center justify-center shrink-0">
                    #{transaction.tableId}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-800 text-sm font-bold">{transaction.id}</p>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">
                      Meja {transaction.tableId} <span className="text-slate-300">•</span> {transaction.items.length} item <span className="text-slate-300">•</span> {transaction.time}
                    </p>
                  </div>
                </div>
                <p className="text-emerald-600 font-bold text-sm whitespace-nowrap">+{formatRupiah(transaction.total)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}