"use client";

import { useEffect, useState, useTransition, useMemo } from "react";

interface ReservationTable {
  id: number;
  table_number: number;
  capacity: number;
  seating_area?: string;
  status: string;
}

interface ReservationItem {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  table_id: number;
  reservation_date: string;
  reservation_time: string;
  number_of_people: number;
  description: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  table?: ReservationTable;
  created_at: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "Menunggu",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Dikonfirmasi",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-600",
  },
  completed: {
    label: "Selesai",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-slate-50 text-slate-400 border-slate-200 line-through opacity-75",
    dot: "bg-slate-300",
  },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "upcoming">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<ReservationItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [, startTransition] = useTransition();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${apiBase}/admin/reservations`, { cache: "no-store" });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        startTransition(() => {
          setReservations(result.data);
          setLoading(false);
        });
      }
    } catch (err: any) {
      if (err.message !== "Failed to fetch" && err.name !== "TypeError") {
        console.error("Gagal memuat reservasi:", err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${apiBase}/admin/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const msg =
          newStatus === "confirmed"
            ? "Reservasi berhasil dikonfirmasi."
            : newStatus === "completed"
            ? "Reservasi ditandai selesai."
            : "Reservasi telah dibatalkan.";
        setFeedbackMessage({ type: "success", text: msg });
        setTimeout(() => setFeedbackMessage(null), 3500);
        await fetchReservations();
        if (selectedDetail && selectedDetail.id === id) {
          setSelectedDetail((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        setFeedbackMessage({ type: "error", text: data.message || "Gagal memperbarui status" });
        setTimeout(() => setFeedbackMessage(null), 4000);
      }
    } catch (err) {
      console.error("Error update status:", err);
      setFeedbackMessage({ type: "error", text: "Terjadi kesalahan jaringan" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.substring(0, 10);
      return d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr.substring(0, 10);
    }
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const rawDate = r.reservation_date ? r.reservation_date.substring(0, 10) : "";
      let matchDate = true;
      if (dateFilter === "today") {
        matchDate = rawDate === todayStr;
      } else if (dateFilter === "upcoming") {
        matchDate = rawDate >= todayStr;
      }

      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        r.customer_name.toLowerCase().includes(q) ||
        r.customer_email.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.table && String(r.table.table_number).includes(q)) ||
        String(r.id).includes(q);

      return matchStatus && matchDate && matchSearch;
    });
  }, [reservations, statusFilter, dateFilter, searchTerm, todayStr]);

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
  const completedCount = reservations.filter((r) => r.status === "completed").length;
  const cancelledCount = reservations.filter((r) => r.status === "cancelled").length;

  return (
    <div className="space-y-7 text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Reservasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau kedatangan customer dan persiapan meja pesanan
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchReservations();
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base text-slate-400">refresh</span>
            Segarkan
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm transition-all ${
            feedbackMessage.type === "success"
              ? "bg-slate-900 text-white"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-lg ${
                feedbackMessage.type === "success" ? "text-emerald-400" : "text-rose-600"
              }`}
            >
              {feedbackMessage.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Stat Cards - Clean Minimalist Neutral */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Reservasi</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">{reservations.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Menunggu</p>
            {pendingCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>}
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Dikonfirmasi</p>
            {confirmedCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>}
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">{confirmedCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Selesai</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">{completedCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: "all", label: "Semua", count: reservations.length },
            { key: "pending", label: "Menunggu", count: pendingCount },
            { key: "confirmed", label: "Dikonfirmasi", count: confirmedCount },
            { key: "completed", label: "Selesai", count: completedCount },
            { key: "cancelled", label: "Dibatalkan", count: cancelledCount },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-lg font-bold ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Date Filter & Search Input */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setDateFilter("all")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                dateFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                dateFilter === "today" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter("upcoming")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                dateFilter === "upcoming" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Mendatang
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Cari pemesan, meja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reservation List */}
      {loading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Memuat data reservasi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-400">
          <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">event_busy</span>
          <p className="text-sm font-semibold text-slate-600">Tidak ada data reservasi</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {searchTerm || statusFilter !== "all" || dateFilter !== "all"
              ? "Coba ubah kata kunci atau filter pencarian."
              : "Belum ada reservasi tercatat saat ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const conf = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const dateStr = item.reservation_date ? item.reservation_date.substring(0, 10) : "";
            const isToday = dateStr === todayStr;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition-colors shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3.5 flex-1 min-w-0">
                    {/* Date Block */}
                    <div className="sm:w-28 rounded-xl bg-slate-50 border border-slate-200 p-2.5 flex sm:flex-col items-center justify-between sm:justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {formatDateDisplay(dateStr)}
                      </span>
                      <span className="text-slate-900 text-base sm:text-lg font-bold block mt-0.5 font-inter">
                        {item.reservation_time}
                      </span>
                      {isToday && (
                        <span className="mt-1 px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider">
                          Hari Ini
                        </span>
                      )}
                    </div>

                    {/* Customer & Table Data */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-base">{item.customer_name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">{item.customer_email}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                          {conf.label}
                        </span>
                      </div>

                      {/* Metadata Badges */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 flex-wrap">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          Meja: {item.table?.table_number || item.table_id || "-"}
                          {item.table?.seating_area ? ` (${item.table.seating_area})` : ""}
                        </span>
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {item.number_of_people} Tamu
                        </span>
                      </div>

                      {/* Description / Notes */}
                      {item.description && (
                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 border border-slate-150 rounded-lg p-2 leading-relaxed">
                          <span className="font-semibold text-slate-700">Catatan: </span>
                          {item.description.replace(/[\[\]{}#]/g, " ").replace(/\s+/g, " ").trim()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedDetail(item)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Detail
                    </button>

                    {item.status === "pending" && (
                      <button
                        type="button"
                        disabled={updatingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, "confirmed")}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        Konfirmasi
                      </button>
                    )}

                    {item.status === "confirmed" && (
                      <button
                        type="button"
                        disabled={updatingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, "completed")}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        Tandai Selesai
                      </button>
                    )}

                    {item.status !== "cancelled" && item.status !== "completed" && (
                      <button
                        type="button"
                        disabled={updatingId === item.id}
                        onClick={() => {
                          if (confirm(`Batalkan reservasi ${item.customer_name}?`)) {
                            handleUpdateStatus(item.id, "cancelled");
                          }
                        }}
                        className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Detail Reservasi #{selectedDetail.id}
              </h3>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-full hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="space-y-2.5 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nama Pemesan:</span>
                  <span className="font-bold text-slate-900">{selectedDetail.customer_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-medium text-slate-800">{selectedDetail.customer_email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Waktu Kedatangan:</span>
                  <span className="font-bold text-slate-900">
                    {formatDateDisplay(selectedDetail.reservation_date)} jam {selectedDetail.reservation_time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Meja & Tamu:</span>
                  <span className="font-bold text-slate-900">
                    Meja {selectedDetail.table?.table_number || selectedDetail.table_id || "-"} ({selectedDetail.number_of_people} Tamu)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_CONFIG[selectedDetail.status]?.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedDetail.status]?.dot}`} />
                    {STATUS_CONFIG[selectedDetail.status]?.label}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold block mb-1">
                  Catatan / Permintaan Khusus:
                </span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium leading-relaxed">
                  {selectedDetail.description
                    ? selectedDetail.description.replace(/[\[\]{}#]/g, " ").replace(/\s+/g, " ").trim()
                    : "Tidak ada catatan khusus."}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2">
                {selectedDetail.status === "pending" && (
                  <button
                    type="button"
                    disabled={updatingId === selectedDetail.id}
                    onClick={() => handleUpdateStatus(selectedDetail.id, "confirmed")}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
                  >
                    Konfirmasi Meja
                  </button>
                )}

                {selectedDetail.status === "confirmed" && (
                  <button
                    type="button"
                    disabled={updatingId === selectedDetail.id}
                    onClick={() => handleUpdateStatus(selectedDetail.id, "completed")}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
                  >
                    Tandai Selesai
                  </button>
                )}

                {selectedDetail.status !== "cancelled" && selectedDetail.status !== "completed" && (
                  <button
                    type="button"
                    disabled={updatingId === selectedDetail.id}
                    onClick={() => {
                      if (confirm(`Batalkan reservasi ${selectedDetail.customer_name}?`)) {
                        handleUpdateStatus(selectedDetail.id, "cancelled");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-slate-50 font-medium text-xs cursor-pointer"
                  >
                    Batalkan
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
