"use client";

import { useEffect, useState, useTransition } from "react";

interface ReservationTable {
  id: number;
  table_number: number;
  capacity: number;
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

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  pending: {
    label: "Menunggu",
    badge: "bg-stone-100 text-stone-800 border-stone-300",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Dikonfirmasi",
    badge: "bg-stone-100 text-stone-900 border-stone-300",
    dot: "bg-emerald-600",
  },
  completed: {
    label: "Selesai",
    badge: "bg-stone-50 text-stone-500 border-stone-200",
    dot: "bg-stone-400",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-stone-50 text-stone-400 border-stone-200 line-through",
    dot: "bg-stone-300",
  },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<ReservationItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${apiBase}/admin/reservations`);
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
        setFeedbackMessage(
          newStatus === "confirmed"
            ? "Reservasi dikonfirmasi untuk persiapan meja."
            : newStatus === "completed"
            ? "Reservasi ditandai selesai."
            : "Reservasi dibatalkan."
        );
        setTimeout(() => setFeedbackMessage(null), 3500);
        await fetchReservations();
        if (selectedDetail && selectedDetail.id === id) {
          setSelectedDetail((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        alert(data.message || "Gagal memperbarui status");
      }
    } catch (err) {
      console.error("Error update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = reservations.filter((r) => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchSearch =
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.id).includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
  const completedCount = reservations.filter((r) => r.status === "completed").length;

  return (
    <div className="max-w-6xl mx-auto space-y-7 text-slate-800">
      {/* Top Header dengan Font Jelas */}
      <div className="pb-5 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Daftar Reservasi Meja
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Kelola kedatangan customer dan persiapan meja pesanan
        </p>
      </div>

      {/* Notification Toast Feedback */}
      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-slate-900 text-white text-sm font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-lg text-emerald-400">check_circle</span>
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Overview Stat Row - Ukuran Font Besar & Jelas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">Total Reservasi</span>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 block">{reservations.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">Menunggu</span>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            )}
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 block">{pendingCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">Dikonfirmasi</span>
            {confirmedCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            )}
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 block">{confirmedCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">Selesai</span>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 block">{completedCount}</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar - Font Terbaca Nyaman */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "Semua", count: reservations.length },
            { key: "pending", label: "Menunggu", count: pendingCount },
            { key: "confirmed", label: "Dikonfirmasi", count: confirmedCount },
            { key: "completed", label: "Selesai", count: completedCount },
            { key: "cancelled", label: "Dibatalkan", count: reservations.filter((r) => r.status === "cancelled").length },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari customer, meja, catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors"
          />
        </div>
      </div>

      {/* Reservation List - Font Besar & Nyaman Dibaca */}
      {loading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center">
          <div className="w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Memuat data reservasi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-400">
          <p className="text-base font-medium">Tidak ada data reservasi</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => {
            const conf = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const dateStr = item.reservation_date ? item.reservation_date.substring(0, 10) : "";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 transition-colors hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                {/* Left Information */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-slate-950 text-base sm:text-lg">{item.customer_name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm text-slate-500 font-medium">{item.customer_email}</span>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${conf.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                      <span>{conf.label}</span>
                    </span>
                  </div>

                  {/* Schedule & Table Metadata */}
                  <div className="flex items-center gap-3 text-sm sm:text-base text-slate-700 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      {dateStr} • Pukul {item.reservation_time}
                    </span>
                    {item.table ? (
                      <>
                        <span className="text-slate-300">|</span>
                        <span className="font-bold text-slate-950 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          Meja: {item.table.table_number} | Kursi: {item.number_of_people}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-300">|</span>
                        <span className="font-medium text-slate-700">Kursi: {item.number_of_people}</span>
                      </>
                    )}
                  </div>

                  {/* Description / Special Requests - Font Jelas & Tebal */}
                  {item.description && (
                    <div className="mt-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-lg text-slate-500 shrink-0 mt-0.5">
                        notes
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-relaxed">
                        {item.description.replace(/[\[\]{}#]/g, ' ').replace(/\s+/g, ' ').trim()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Font Jelas & Ukuran Proporsional */}
                <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDetail(item)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Detail
                  </button>

                  {item.status === "pending" && (
                    <button
                      type="button"
                      disabled={updatingId === item.id}
                      onClick={() => handleUpdateStatus(item.id, "confirmed")}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      Konfirmasi
                    </button>
                  )}

                  {item.status === "confirmed" && (
                    <button
                      type="button"
                      disabled={updatingId === item.id}
                      onClick={() => handleUpdateStatus(item.id, "completed")}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
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
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail dengan Font Besar & Terbaca Sangat Jelas */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                Detail Reservasi {selectedDetail.id}
              </h3>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-full hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="space-y-2.5 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nama Pemesan:</span>
                  <span className="font-bold text-slate-950 text-base">{selectedDetail.customer_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.customer_email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Waktu Kedatangan:</span>
                  <span className="font-bold text-slate-900">
                    {selectedDetail.reservation_date.substring(0, 10)} jam {selectedDetail.reservation_time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Jumlah Tamu:</span>
                  <span className="font-bold text-slate-900">{selectedDetail.number_of_people} Orang</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-slate-900">
                    {STATUS_CONFIG[selectedDetail.status]?.label}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider font-bold block mb-1.5">
                  Permintaan Khusus / Pilihan Meja:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-semibold leading-relaxed">
                  {selectedDetail.description ? selectedDetail.description.replace(/[\[\]{}#]/g, ' ').replace(/\s+/g, ' ').trim() : "Tidak ada catatan khusus."}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                {selectedDetail.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedDetail.id, "confirmed")}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer shadow-xs text-sm"
                  >
                    Konfirmasi Meja
                  </button>
                )}
                {selectedDetail.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedDetail.id, "completed")}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer shadow-xs text-sm"
                  >
                    Tandai Selesai
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer text-sm"
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
