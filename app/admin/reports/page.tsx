"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

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
  customerName?: string;
  discountAmount?: number;
  total: number;
  items: OrderItem[];
  status?: string;
  date: string;
  time: string;
  hour: number;
  rawDate: Date;
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

// Jam operasional untuk grafik Hari Ini (mencakup 24 jam penuh dari 00:00 s/d 23:59)
const TODAY_SLOTS = [
  { label: "03:00", hourStart: 0, hourEnd: 2 },
  { label: "06:00", hourStart: 3, hourEnd: 5 },
  { label: "09:00", hourStart: 6, hourEnd: 8 },
  { label: "12:00", hourStart: 9, hourEnd: 11 },
  { label: "15:00", hourStart: 12, hourEnd: 14 },
  { label: "18:00", hourStart: 15, hourEnd: 17 },
  { label: "21:00", hourStart: 18, hourEnd: 20 },
  { label: "24:00", hourStart: 21, hourEnd: 23 },
];

function MetricCard({
  icon,
  label,
  value,
  detail,
  iconBg,
  iconColor,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <span
            className={`material-symbols-outlined ${iconColor}`}
            style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
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
  const [period, setPeriod] = useState<Period>("today");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [chartMode, setChartMode] = useState<"cumulative" | "slot">("cumulative");
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    value: number;
    cumulative: number;
    count: number;
    desc?: string;
    x: number;
    y: number;
  } | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  // Ambil transaksi real-time dari Backend API & LocalStorage
  const fetchLiveTransactions = useCallback(async () => {
    try {
      // Ambil daftar produk untuk pemetaan kategori dan nama menu yang akurat
      let productCategoryMap: Record<number, string> = {};
      let productNameMap: Record<number, string> = {};
      try {
        const prodRes = await fetch(`${apiBase}/admin/products`, { cache: "no-store" });
        const prodResult = await prodRes.json();
        if (prodResult.success && Array.isArray(prodResult.data)) {
          prodResult.data.forEach((p: any) => {
            const catName = p.category?.nama_kategori || "Coffee";
            productCategoryMap[p.id] = catName;
            if (p.nama_menu) {
              productNameMap[p.id] = p.nama_menu;
            }
          });
        }
      } catch {
        // Fallback jika fetch produk gagal
      }

      const res = await fetch(`${apiBase}/admin/orders`, { cache: "no-store" });
      const result = await res.json();

      let liveList: Transaction[] = [];

      if (result.success && Array.isArray(result.data)) {
        liveList = result.data.map((o: any) => {
          const rawDate = o.created_at ? new Date(o.created_at) : new Date();
          const yyyy = rawDate.getFullYear();
          const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
          const dd = String(rawDate.getDate()).padStart(2, "0");
          const dateStr = `${yyyy}-${mm}-${dd}`;

          const timeStr = rawDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const items: OrderItem[] = Array.isArray(o.items)
            ? o.items.map((i: any) => ({
                name: i.menu?.nama_menu || productNameMap[i.menu_id] || (i.menu_id ? `Menu #${i.menu_id}` : "Item"),
                qty: i.quantity || 1,
                price: i.price || 0,
                category: i.menu?.category?.nama_kategori || productCategoryMap[i.menu_id] || "Coffee",
              }))
            : [];

          return {
            id: `ORD-${o.id}`,
            tableId: String(o.table_id || "1"),
            customerName: o.customer_name || (o.customer ? o.customer.name : `Pelanggan`),
            discountAmount: Number(o.discount_amount) || 0,
            total: Number(o.total_amount || 0),
            items,
            status: o.status || "completed",
            date: dateStr,
            time: timeStr,
            hour: rawDate.getHours(),
            rawDate,
          };
        });
        liveList.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      }

      // Gabungkan dengan localStorage demo jika ada
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("admin_orders");
        if (saved) {
          try {
            const localOrders = JSON.parse(saved);
            if (Array.isArray(localOrders)) {
              localOrders.forEach((lo: any) => {
                if (!liveList.some((l) => l.id === lo.id || l.id === `ORD-${lo.id}`)) {
                  const rawDate = lo.date ? new Date(lo.date) : new Date();
                  const yyyy = rawDate.getFullYear();
                  const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
                  const dd = String(rawDate.getDate()).padStart(2, "0");
                  const dateStr = `${yyyy}-${mm}-${dd}`;

                  liveList.push({
                    id: lo.id || `LOCAL-${Math.random()}`,
                    tableId: String(lo.tableId || "1"),
                    total: Number(lo.total || 0),
                    items: Array.isArray(lo.items) ? lo.items : [],
                    status: lo.status || "completed",
                    date: dateStr,
                    time: lo.time || rawDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                    hour: rawDate.getHours(),
                    rawDate,
                  });
                }
              });
            }
          } catch {
            // Abaikan kesalahan parse
          }
        }
      }

      setTransactions(liveList);
      setLastUpdated(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch {
      // Fallback
      setLastUpdated(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
  }, [apiBase]);

  // Polling Real-time setiap 5 detik
  useEffect(() => {
    fetchLiveTransactions();
    const interval = setInterval(fetchLiveTransactions, 5000);
    return () => clearInterval(interval);
  }, [fetchLiveTransactions]);

  // Tanggal acuan hari ini
  const todayStr = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Filter transaksi sesuai periode yang dipilih
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    return transactions.filter((t) => {
      const isDone = !t.status || t.status === "completed" || t.status === "done";
      if (!isDone) return false;

      if (period === "today") {
        return t.date === todayStr;
      }
      if (period === "week") {
        return t.rawDate >= sevenDaysAgo;
      }
      if (period === "month") {
        return t.rawDate >= firstDayOfMonth;
      }
      return true;
    });
  }, [transactions, period, todayStr]);

  // Metrik Utama
  const totalRevenue = useMemo(() => filteredTransactions.reduce((acc, t) => acc + t.total, 0), [filteredTransactions]);
  const totalOrders = filteredTransactions.length;
  const averageOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const totalItems = useMemo(
    () => filteredTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, i) => itemSum + i.qty, 0), 0),
    [filteredTransactions]
  );

  // Kategori Terlaris Berdasarkan Data Sebenarnya
  const categoryRows = useMemo(() => {
    const countCategory = (catName: string) =>
      filteredTransactions.reduce(
        (sum, t) =>
          sum +
          t.items
            .filter((i) => (i.category || "").toLowerCase().includes(catName.toLowerCase()))
            .reduce((s, i) => s + i.qty, 0),
        0
      );

    const coffeeQty = countCategory("coffee");
    const foodQty = countCategory("food");
    const pastryQty = countCategory("pastry") + countCategory("snack");
    const otherQty = Math.max(0, totalItems - (coffeeQty + foodQty + pastryQty));

    return [
      { label: "Coffee", value: coffeeQty, color: "bg-[#3B4CB8]", icon: "local_cafe" },
      { label: "Food & Meals", value: foodQty, color: "bg-indigo-400", icon: "restaurant" },
      { label: "Pastry & Snacks", value: pastryQty, color: "bg-emerald-500", icon: "bakery_dining" },
      { label: "Lainnya", value: otherQty, color: "bg-amber-500", icon: "local_drink" },
    ];
  }, [filteredTransactions, totalItems]);

  const maxCategory = Math.max(...categoryRows.map((r) => r.value), 1);

  // ── KALKULASI GRAFIK REAL-TIME & SINKRON DENGAN TOTAL PENDAPATAN ──
  const { chartDataPoints, chartTitle, chartSubtitle } = useMemo(() => {
    if (period === "today") {
      // Urutkan transaksi hari ini secara kronologis berdasarkan waktu pemesanan aktual
      const sortedToday = [...filteredTransactions].sort(
        (a, b) => a.rawDate.getTime() - b.rawDate.getTime()
      );

      if (sortedToday.length === 0) {
        return {
          chartDataPoints: [
            { label: "00:00", slotRevenue: 0, cumulativeRevenue: 0, orderCount: 0, desc: "Awal Hari" },
            { label: "12:00", slotRevenue: 0, cumulativeRevenue: 0, orderCount: 0, desc: "Siang" },
            { label: "23:59", slotRevenue: 0, cumulativeRevenue: 0, orderCount: 0, desc: "Akhir Hari" },
          ],
          chartTitle: "Tren Pendapatan Hari Ini",
          chartSubtitle: "Belum ada pesanan aktif hari ini",
        };
      }

      let runningCumulative = 0;
      const points: {
        label: string;
        slotRevenue: number;
        cumulativeRevenue: number;
        orderCount: number;
        desc: string;
      }[] = [];

      // 1. Titik Awal Hari (00:00 di angka Rp 0 sebelum ada pesanan)
      points.push({
        label: "00:00",
        slotRevenue: 0,
        cumulativeRevenue: 0,
        orderCount: 0,
        desc: "Awal Hari (00:00 WIB)",
      });

      // 2. Titik Bergerak Mengikuti Jam Pemesanan Aktual Masuk
      sortedToday.forEach((t) => {
        runningCumulative += t.total;
        points.push({
          label: t.time,
          slotRevenue: t.total,
          cumulativeRevenue: runningCumulative,
          orderCount: 1,
          desc: `${t.id} • Meja ${t.tableId}`,
        });
      });

      // 3. Titik Waktu Sekarang (Menjaga garis bertahan di total pendapatan hingga saat ini)
      const now = new Date();
      const nowStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      points.push({
        label: `${nowStr}`,
        slotRevenue: 0,
        cumulativeRevenue: runningCumulative,
        orderCount: 0,
        desc: "Waktu Sekarang",
      });

      return {
        chartDataPoints: points,
        chartTitle:
          chartMode === "cumulative"
            ? "Tren Akumulasi Pendapatan Hari Ini (Sesuai Jam Pemesanan)"
            : "Pendapatan Per Jam Pemesanan Hari Ini",
        chartSubtitle:
          chartMode === "cumulative"
            ? `Grafik mulai bergerak dari jam pemesanan pertama hingga mencapai total ${formatRupiah(totalRevenue)}`
            : "Grafik nominal pemasukan persis saat transaksi dilakukan",
      };
    }

    if (period === "week") {
      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      let runningCumulative = 0;
      const points = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const matchingTransactions = filteredTransactions.filter((t) => t.date === dateStr);
        const dayRev = matchingTransactions.reduce((sum, t) => sum + t.total, 0);
        runningCumulative += dayRev;

        points.push({
          label: `${dayNames[d.getDay()]} (${dd})`,
          slotRevenue: dayRev,
          cumulativeRevenue: runningCumulative,
          orderCount: matchingTransactions.length,
        });
      }

      return {
        chartDataPoints: points,
        chartTitle:
          chartMode === "cumulative"
            ? "Tren Akumulasi 7 Hari Terakhir"
            : "Pendapatan Harian 7 Hari Terakhir",
        chartSubtitle: `Performa penjualan 7 hari terakhir (Total: ${formatRupiah(totalRevenue)})`,
      };
    }

    // Periode Bulan Ini
    let runningCumulative = 0;
    const weekLabels = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5"];
    const points = weekLabels.map((lbl, idx) => {
      const matchingTransactions = filteredTransactions.filter((t) => {
        const day = t.rawDate.getDate();
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
        return weekIndex === idx;
      });
      const weekRev = matchingTransactions.reduce((sum, t) => sum + t.total, 0);
      runningCumulative += weekRev;

      return {
        label: lbl,
        slotRevenue: weekRev,
        cumulativeRevenue: runningCumulative,
        orderCount: matchingTransactions.length,
      };
    });

    return {
      chartDataPoints: points,
      chartTitle:
        chartMode === "cumulative"
          ? "Tren Akumulasi Bulan Ini"
          : "Pendapatan Mingguan Bulan Ini",
      chartSubtitle: `Performa berjalan bulan ini (Total: ${formatRupiah(totalRevenue)})`,
    };
  }, [period, filteredTransactions, chartMode, totalRevenue]);

  // Nilai grafik aktif tergantung mode (Akumulasi vs Per Jam)
  const activeValues = useMemo(() => {
    return chartDataPoints.map((p) =>
      chartMode === "cumulative" ? p.cumulativeRevenue : p.slotRevenue
    );
  }, [chartDataPoints, chartMode]);

  // Skala Y Maksimal yang Rapi (Bulat ke kelipatan 50.000 atau 100.000)
  const maxActiveVal = Math.max(...activeValues, 1);
  const targetCeiling = chartMode === "cumulative" ? Math.max(totalRevenue, maxActiveVal) : maxActiveVal;

  const yCeiling = useMemo(() => {
    if (targetCeiling <= 100000) return 100000;
    if (targetCeiling <= 250000) return 250000;
    if (targetCeiling <= 500000) return 500000;
    if (targetCeiling <= 800000) return 800000;
    if (targetCeiling <= 1000000) return 1000000;
    return Math.ceil(targetCeiling / 200000) * 200000;
  }, [targetCeiling]);

  // Koordinat SVG Presisi
  const chartCoordinates = useMemo(() => {
    const totalPoints = chartDataPoints.length;
    return activeValues.map((val, idx) => {
      const xPercent = (idx / Math.max(totalPoints - 1, 1)) * 100;
      // Y dari 8% (atas) sampai 92% (bawah/nol)
      const ratio = Math.min(Math.max(val / yCeiling, 0), 1);
      const yPercent = 92 - ratio * (92 - 8);
      return { x: xPercent, y: yPercent, value: val };
    });
  }, [activeValues, chartDataPoints.length, yCeiling]);

  const hasChartData = activeValues.some((val) => val > 0);

  // Path polyline & area SVG
  const polylinePoints = chartCoordinates.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPolygonPoints = `0,92 ${polylinePoints} 100,92`;

  // Label Sumbu Y (5 tingkatan proporsional)
  const yAxisLabels = [
    formatRupiah(yCeiling),
    formatRupiah(Math.round(yCeiling * 0.75)),
    formatRupiah(Math.round(yCeiling * 0.5)),
    formatRupiah(Math.round(yCeiling * 0.25)),
    "Rp 0",
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Realtime */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-800">Laporan Bisnis</h2>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Real-time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Diperbarui otomatis • Sinkronisasi terakhir: {lastUpdated || "Memuat..."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/60">
            {(
              [
                ["today", "Hari Ini"],
                ["week", "7 Hari"],
                ["month", "Bulan Ini"],
              ] as [Period, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  period === value
                    ? "bg-white text-[#3B4CB8] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon="payments"
          label={`Total Pendapatan (${period === "today" ? "Hari Ini" : period === "week" ? "7 Hari" : "Bulan Ini"})`}
          value={formatRupiah(totalRevenue)}
          detail="Pendapatan bersih real-time"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <MetricCard
          icon="receipt_long"
          label="Total Pesanan"
          value={String(totalOrders)}
          detail={`${totalItems} item terjual`}
          iconBg="bg-indigo-50"
          iconColor="text-[#3B4CB8]"
        />
        <MetricCard
          icon="trending_up"
          label="Rata-rata Pesanan"
          value={formatRupiah(averageOrder)}
          detail="Nilai per transaksi"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <MetricCard
          icon="groups"
          label="Pelanggan Terlayani"
          value={String(totalOrders)}
          detail="Transaksi terkonfirmasi"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend Chart - Dinamis Sesuai Periode & Realtime */}
        <section className="xl:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-slate-800 font-bold text-base">{chartTitle}</h3>
                {hasChartData && (
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                    Total: {formatRupiah(totalRevenue)}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-0.5">{chartSubtitle}</p>
            </div>

            {/* Pilihan Mode Tampilan Grafik */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/60 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartMode("cumulative")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  chartMode === "cumulative"
                    ? "bg-white text-[#3B4CB8] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tampilkan grafik akumulasi yang bertambah sampai mencapai total pendapatan"
              >
                Akumulasi Total
              </button>
              <button
                type="button"
                onClick={() => setChartMode("slot")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  chartMode === "slot"
                    ? "bg-white text-[#3B4CB8] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tampilkan grafik pendapatan per jam atau per sesi terpisah"
              >
                Per Jam / Sesi
              </button>
            </div>
          </div>

          <div className="relative h-64 sm:h-72">
            {/* Garis Grid Horizontal & Skala Label Y */}
            <div className="absolute inset-x-0 top-3 bottom-8 flex flex-col justify-between text-[11px] text-slate-400 pointer-events-none">
              {yAxisLabels.map((label, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-18 text-right font-medium text-[10px] sm:text-xs text-slate-400 shrink-0">
                    {label}
                  </span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>
              ))}
            </div>

            {/* Area Grafik SVG */}
            <div className="absolute left-22 right-3 top-3 bottom-8">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
                role="img"
                aria-label="Grafik tren pendapatan real-time"
              >
                <defs>
                  <linearGradient id="report-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3B4CB8" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#3B4CB8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {hasChartData && <polygon points={areaPolygonPoints} fill="url(#report-area)" />}
                {hasChartData && (
                  <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke="#3B4CB8"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {hasChartData &&
                  chartCoordinates.map((coord, index) => {
                    const pointInfo = chartDataPoints[index];
                    return (
                      <g key={index} className="cursor-pointer">
                        {/* Lingkaran Titik Data */}
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r={coord.value > 0 ? "4" : "2"}
                          fill={coord.value > 0 ? "#ffffff" : "#cbd5e1"}
                          stroke={coord.value > 0 ? "#3B4CB8" : "#94a3b8"}
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                          className="transition-all hover:r-6"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              label: pointInfo.label,
                              value: pointInfo.slotRevenue,
                              cumulative: pointInfo.cumulativeRevenue,
                              count: pointInfo.orderCount,
                              desc: (pointInfo as any).desc,
                              x: coord.x,
                              y: coord.y,
                            })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    );
                  })}
              </svg>

              {/* Label Badge Nominal Rupiah di atas Titik Aktif */}
              {hasChartData &&
                chartCoordinates.map((coord, index) => {
                  if (coord.value === 0) return null;
                  const pointInfo = chartDataPoints[index];
                  return (
                    <div
                      key={index}
                      style={{
                        left: `${coord.x}%`,
                        top: `${coord.y}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-7 pointer-events-none z-10 hidden sm:flex flex-col items-center"
                    >
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                        {formatRupiah(chartMode === "cumulative" ? pointInfo.cumulativeRevenue : pointInfo.slotRevenue)}
                      </span>
                    </div>
                  );
                })}

              {/* Tooltip Melayang saat Hover */}
              {hoveredPoint && (
                <div
                  style={{
                    left: `${hoveredPoint.x}%`,
                    top: `${hoveredPoint.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-16 pointer-events-none z-20 bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap animate-scale-up"
                >
                  <p className="font-bold text-indigo-200">
                    {hoveredPoint.label} {hoveredPoint.desc ? `• ${hoveredPoint.desc}` : ""}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Pemasukan: <span className="font-bold text-white">{formatRupiah(hoveredPoint.value)}</span>
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Total Akumulasi: <span className="font-bold text-emerald-400">{formatRupiah(hoveredPoint.cumulative)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Label Sumbu X */}
            <div className="absolute left-22 right-3 bottom-0 flex justify-between text-[11px] text-slate-400 font-medium">
              {chartDataPoints.map((pt) => (
                <span key={pt.label} className="text-[10px] sm:text-xs">
                  {pt.label}
                </span>
              ))}
            </div>

            {!hasChartData && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="material-symbols-outlined text-slate-300 text-3xl mb-1">
                  show_chart
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  {period === "today"
                    ? "Belum ada transaksi selesai pada hari ini"
                    : "Belum ada transaksi pada periode ini"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Top Categories */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-slate-800 font-bold text-base">Kategori Terlaris</h3>
                <p className="text-slate-400 text-xs mt-0.5">Distribusi item terjual real-time</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">category</span>
            </div>

            <div className="space-y-5">
              {categoryRows.map((row) => {
                const percentage = maxCategory > 0 ? Math.round((row.value / maxCategory) * 100) : 0;
                return (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`${row.color} w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-2xs`}>
                          <span className="material-symbols-outlined text-base">{row.icon}</span>
                        </span>
                        <span className="text-slate-700 text-xs font-semibold">{row.label}</span>
                      </div>
                      <span className="text-slate-800 text-xs font-bold">
                        {row.value} item ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${row.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Status Data</span>
            <span className="text-slate-800 text-xs font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
              {totalOrders} Transaksi Terhitung
            </span>
          </div>
        </section>
      </div>

      {/* Recent Transactions Table */}
      <section className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-800 font-bold text-base">Transaksi Real-time Terbaru</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Daftar transaksi pada periode {period === "today" ? "Hari Ini" : period === "week" ? "7 Hari Terakhir" : "Bulan Ini"}
            </p>
          </div>
          <span className="material-symbols-outlined text-slate-400">receipt_long</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">bar_chart</span>
            </div>
            <p className="text-slate-800 font-bold text-sm">Belum Ada Transaksi</p>
            <p className="text-slate-400 text-xs mt-1">
              Tidak ditemukan transaksi selesai pada {period === "today" ? "hari ini" : "periode ini"}.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.slice(0, 8).map((transaction, idx) => (
              <div
                key={transaction.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] font-bold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-900 text-sm font-bold">{transaction.id}</p>
                      {transaction.customerName && (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {transaction.customerName}
                        </span>
                      )}
                      {transaction.discountAmount && transaction.discountAmount > 0 ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          🏷️ -Rp {transaction.discountAmount.toLocaleString("id-ID")}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">
                      Meja {transaction.tableId} <span className="text-slate-300">•</span>{" "}
                      {transaction.items.length} item <span className="text-slate-300">•</span>{" "}
                      {transaction.time} WIB ({transaction.date})
                    </p>
                  </div>
                </div>
                <p className="text-emerald-600 font-bold text-sm whitespace-nowrap">
                  +{formatRupiah(transaction.total)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}