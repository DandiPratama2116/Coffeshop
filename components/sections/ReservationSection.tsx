"use client";

import { useState, useEffect } from "react";

interface TableData {
  id: string | number;
  table_number: number;
  capacity: number;
  seating_area: string;
  status: "available" | "occupied";
}

interface TableHotspot {
  number: number;
  code: string;
  area: "VIP" | "Indoor" | "Room Smoking" | "Outdoor";
  x: number;
  y: number;
  w: number;
  h: number;
  capacity: number;
  shape: "circle" | "rect";
  description: string;
}

const BLUEPRINT_TABLES: TableHotspot[] = [
  // ── 1. ZONA VIP ROOM ──
  { number: 101, code: "VIP 1", area: "VIP", x: 39.3, y: 25.5, w: 5.6, h: 14.0, capacity: 6, shape: "rect", description: "Meja VIP 1 (6 Kursi)" },
  { number: 102, code: "VIP 2", area: "VIP", x: 46.8, y: 25.5, w: 7.2, h: 14.0, capacity: 10, shape: "rect", description: "Meja VIP 2 (10 Kursi)" },
  { number: 103, code: "VIP 3", area: "VIP", x: 54.5, y: 25.5, w: 7.6, h: 14.0, capacity: 10, shape: "rect", description: "Meja VIP 3 (10 Kursi)" },
  { number: 104, code: "VIP 4", area: "VIP", x: 63.6, y: 25.5, w: 6.0, h: 14.0, capacity: 8, shape: "rect", description: "Meja VIP 4 (8 Kursi)" },

  // ── 2. SMOKING AREA ──
  { number: 201, code: "S1", area: "Room Smoking", x: 10.3, y: 46.5, w: 4.8, h: 9.0, capacity: 2, shape: "circle", description: "Meja S1 (2 Kursi)" },
  { number: 202, code: "S2", area: "Room Smoking", x: 15.8, y: 46.5, w: 5.2, h: 8.5, capacity: 3, shape: "rect", description: "Meja S2 (2-3 Kursi)" },
  { number: 203, code: "S3", area: "Room Smoking", x: 21.6, y: 46.5, w: 4.5, h: 8.5, capacity: 2, shape: "rect", description: "Meja S3 (2 Kursi)" },
  { number: 204, code: "S4", area: "Room Smoking", x: 11.0, y: 62.5, w: 6.0, h: 9.5, capacity: 5, shape: "rect", description: "Meja S4 (5 Kursi)" },
  { number: 205, code: "S5", area: "Room Smoking", x: 21.4, y: 62.5, w: 6.4, h: 9.5, capacity: 6, shape: "rect", description: "Meja S5 (6 Kursi)" },
  { number: 206, code: "S7", area: "Room Smoking", x: 11.0, y: 78.5, w: 6.5, h: 10.5, capacity: 8, shape: "rect", description: "Meja S7 (8 Kursi)" },
  { number: 207, code: "S8", area: "Room Smoking", x: 21.4, y: 78.5, w: 7.2, h: 10.5, capacity: 10, shape: "rect", description: "Meja S8 (10 Kursi)" },

  // ── 3. INDOOR LOUNGE ──
  { number: 1, code: "I1", area: "Indoor", x: 31.0, y: 50.5, w: 4.8, h: 8.8, capacity: 2, shape: "circle", description: "Meja I1 (2 Kursi)" },
  { number: 2, code: "I2", area: "Indoor", x: 31.0, y: 63.0, w: 4.8, h: 8.8, capacity: 4, shape: "circle", description: "Meja I2 (3-4 Kursi)" },
  { number: 3, code: "I3", area: "Indoor", x: 31.0, y: 78.5, w: 4.8, h: 8.8, capacity: 4, shape: "circle", description: "Meja I3 (3-4 Kursi)" },
  { number: 4, code: "I4", area: "Indoor", x: 39.5, y: 50.5, w: 5.2, h: 9.2, capacity: 3, shape: "rect", description: "Meja I4 (2-3 Kursi)" },
  { number: 5, code: "I5", area: "Indoor", x: 39.5, y: 63.0, w: 5.4, h: 9.5, capacity: 5, shape: "rect", description: "Meja I5 (4-5 Kursi)" },
  { number: 6, code: "I6", area: "Indoor", x: 39.5, y: 78.5, w: 5.4, h: 9.5, capacity: 5, shape: "rect", description: "Meja I6 (4-5 Kursi)" },
  { number: 7, code: "I7", area: "Indoor", x: 55.6, y: 76.5, w: 6.2, h: 12.0, capacity: 8, shape: "rect", description: "Meja I7 (8 Kursi)" },
  { number: 8, code: "I8", area: "Indoor", x: 63.9, y: 76.5, w: 7.6, h: 12.0, capacity: 12, shape: "rect", description: "Meja I8 (12 Kursi)" },

  // ── 4. OUTDOOR AREA ──
  { number: 301, code: "O1", area: "Outdoor", x: 73.3, y: 22.0, w: 4.5, h: 8.5, capacity: 2, shape: "circle", description: "Meja O1 (1-2 Kursi)" },
  { number: 302, code: "O2", area: "Outdoor", x: 73.3, y: 34.0, w: 4.5, h: 8.5, capacity: 3, shape: "circle", description: "Meja O2 (2-3 Kursi)" },
  { number: 303, code: "O3", area: "Outdoor", x: 73.3, y: 46.5, w: 4.5, h: 8.5, capacity: 4, shape: "circle", description: "Meja O3 (4-5 Kursi)" },
  { number: 304, code: "O4", area: "Outdoor", x: 73.3, y: 73.5, w: 4.5, h: 8.5, capacity: 6, shape: "circle", description: "Meja O4 (6-7 Kursi)" },
  { number: 305, code: "O5", area: "Outdoor", x: 81.3, y: 21.0, w: 5.0, h: 9.0, capacity: 2, shape: "rect", description: "Meja O5 (2 Kursi)" },
  { number: 306, code: "O6", area: "Outdoor", x: 89.5, y: 23.0, w: 7.2, h: 13.0, capacity: 6, shape: "circle", description: "Meja Payung O6 (6 Kursi)" },
  { number: 307, code: "O7", area: "Outdoor", x: 81.3, y: 39.5, w: 5.8, h: 10.5, capacity: 7, shape: "rect", description: "Meja Taman O7 (7 Kursi)" },
  { number: 308, code: "O8", area: "Outdoor", x: 89.5, y: 40.0, w: 7.2, h: 13.0, capacity: 12, shape: "circle", description: "Meja Payung O8 (12 Kursi)" },
  { number: 309, code: "O9", area: "Outdoor", x: 81.3, y: 60.5, w: 5.8, h: 10.5, capacity: 8, shape: "rect", description: "Meja O9 (7-8 Kursi)" },
  { number: 310, code: "O10", area: "Outdoor", x: 89.5, y: 60.0, w: 6.8, h: 11.5, capacity: 10, shape: "rect", description: "Meja Panjang O10 (10 Kursi)" },
  { number: 311, code: "O11", area: "Outdoor", x: 81.3, y: 77.0, w: 5.5, h: 10.0, capacity: 4, shape: "rect", description: "Meja O11 (4 Kursi)" },
  { number: 312, code: "O12", area: "Outdoor", x: 89.5, y: 76.0, w: 6.8, h: 11.5, capacity: 12, shape: "rect", description: "Meja Panjang O12 (12 Kursi)" },
];

export default function ReservationSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    area: "Indoor",
    selectedTableNumber: null as number | null,
    selectedTableCode: "",
    description: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [liveTables, setLiveTables] = useState<TableData[]>([]);
  const [modalSelectedTable, setModalSelectedTable] = useState<TableHotspot | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchLiveTables = () => {
    fetch(`${apiBase}/customer/tables`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Gagal memuat meja"))))
      .then((data) => {
        if (data && data.data) {
          setLiveTables(data.data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (showFloorPlan) {
      fetchLiveTables();
      const interval = setInterval(fetchLiveTables, 8000);
      return () => clearInterval(interval);
    }
  }, [showFloorPlan]);

  const updateField = (field: keyof typeof form, value: any) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const getTableStatus = (tableNumber: number): "available" | "occupied" => {
    const found = liveTables.find((t) => t.table_number === tableNumber);
    return found ? found.status : "available";
  };

  const handleSelectTableOnFloorPlan = (hotspot: TableHotspot) => {
    const tableStatus = getTableStatus(hotspot.number);
    if (tableStatus === "occupied") {
      alert(`Meja #${hotspot.number} (${hotspot.code}) saat ini sedang digunakan. Silakan pilih meja yang bertanda hijau.`);
      return;
    }
    setModalSelectedTable(hotspot);
  };

  const confirmTableSelection = (hotspot: TableHotspot) => {
    const tableTag = `Meja: ${hotspot.number} | Kursi: ${hotspot.capacity}`;
    setForm((current) => {
      // Bersihkan format lama
      const cleanDesc = current.description
        .replace(/\[Pilihan Meja:.*?\]/g, "")
        .replace(/\[Area:.*?\]/g, "")
        .replace(/Meja:\s*\(?\d+\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
        .replace(/^[•\s-]+|[•\s-]+$/g, "")
        .trim();

      return {
        ...current,
        area: hotspot.area,
        guests: String(Math.min(hotspot.capacity, 10)),
        selectedTableNumber: hotspot.number,
        selectedTableCode: hotspot.code,
        description: cleanDesc ? `${tableTag} • ${cleanDesc}` : tableTag,
      };
    });
    setShowFloorPlan(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      // Format deskripsi: "Meja: 11 | Kursi: 2"
      let finalDescription = form.description.trim();
      if (form.selectedTableNumber) {
        const tableHotspot = BLUEPRINT_TABLES.find((t) => t.number === form.selectedTableNumber);
        const totalKursi = tableHotspot ? tableHotspot.capacity : form.guests;
        const tableTag = `Meja: ${form.selectedTableNumber} | Kursi: ${totalKursi}`;

        const cleanDesc = finalDescription
          .replace(/\[Pilihan Meja:.*?\]/g, "")
          .replace(/\[Area:.*?\]/g, "")
          .replace(/Meja:\s*\(?\d+\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
          .replace(/^[•\s-]+|[•\s-]+$/g, "")
          .trim();

        finalDescription = cleanDesc ? `${tableTag} • ${cleanDesc}` : tableTag;
      }

      const response = await fetch(`${apiBase}/customer/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          reservation_date: form.date,
          reservation_time: form.time,
          number_of_people: Number(form.guests),
          description: finalDescription,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Reservasi gagal dikirim.");
      setStatus("Reservasi Anda berhasil terkirim. Konfirmasi telah kami kirimkan ke email Anda.");
      setForm({
        name: "",
        email: "",
        date: "",
        time: "",
        guests: "2",
        area: "Indoor",
        selectedTableNumber: null,
        selectedTableCode: "",
        description: "",
      });
      setModalSelectedTable(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Reservasi gagal dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalTables = BLUEPRINT_TABLES.length;
  const occupiedCount = BLUEPRINT_TABLES.filter((h) => getTableStatus(h.number) === "occupied").length;
  const availableCount = totalTables - occupiedCount;

  return (
    <section id="Reservasi" className="py-20 px-4 sm:px-6 md:px-12 bg-white relative">
      <div className="max-w-3xl mx-auto">
        {/* Header Bersih & Font Jelas */}
        <div className="text-center mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Booking & Reservasi Tempat
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-2 mb-3 tracking-tight">
            Reservasi Meja Cafe
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Pesan tempat duduk favorit Anda terlebih dahulu untuk kenyamanan menikmati kopi dan hidangan terbaik di Caffe Shop.
          </p>
        </div>

        {/* Kartu Formulir Reservasi */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Baris 1: Nama Lengkap & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Dandi Pratama"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Alamat Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Baris 2: Tanggal & Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Tanggal Kunjungan
                </label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all [color-scheme:light]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Waktu Kedatangan
                </label>
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all [color-scheme:light]"
                />
              </div>
            </div>

            {/* Baris 3: Jumlah Tamu & Pilihan Ruangan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Jumlah Tamu
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => updateField("guests", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang</option>
                  <option value="3">3 Orang</option>
                  <option value="4">4 Orang</option>
                  <option value="6">6 Orang</option>
                  <option value="8">8 Orang</option>
                  <option value="10">10+ Orang (Grup / Komunal)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Pilihan Area Ruangan
                </label>
                <select
                  value={form.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Indoor">Indoor Lounge (Ber-AC & Sofa)</option>
                  <option value="Outdoor">Outdoor / Patio (Taman Asri)</option>
                  <option value="VIP">VIP Room (Privat & Kedap Suara)</option>
                  <option value="Room Smoking">Smoking Area (Khusus Merokok)</option>
                </select>
              </div>
            </div>

            {/* Tombol Buka Denah & Status Meja Terpilih */}
            {form.selectedTableNumber ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Meja: {form.selectedTableNumber} | Kursi: {form.guests}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Area: <strong>{form.area}</strong> • Status: <span className="text-emerald-700 font-bold">Tersedia</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalSelectedTable(null);
                      setShowFloorPlan(true);
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    Ganti Meja
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((c) => ({
                        ...c,
                        selectedTableNumber: null,
                        selectedTableCode: "",
                        description: c.description
                          .replace(/Meja:\s*\(?\d+\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
                          .replace(/^[•\s-]+|[•\s-]+$/g, "")
                          .trim(),
                      }));
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setModalSelectedTable(null);
                  setShowFloorPlan(true);
                }}
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-800 text-slate-800 hover:bg-slate-50 text-sm font-bold flex items-center justify-center gap-2.5 transition-all bg-white shadow-xs"
              >
                <span className="material-symbols-outlined text-lg text-slate-700">map</span>
                <span>Lihat Denah Tempat Duduk & Pilih Meja Sendiri</span>
              </button>
            )}

            {/* Catatan Khusus */}
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                Catatan Khusus (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Permintaan khusus Anda (misal: kursi tambahan, dekorasi ulang tahun, dsb.)"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Tombol Submit */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-wider transition-all shadow-md"
              >
                {isSubmitting ? "Mengirim Reservasi..." : "Kirim Reservasi Sekarang"}
              </button>
              {status && <p className="mt-4 text-sm font-bold text-slate-700">{status}</p>}
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL POP-UP DENAH LOKASI - TEMA KETENANGAN (TENANG, BERSIH, TANPA BOLD)  */}
      {/* ========================================================================= */}
      {showFloorPlan && (
        <div className="fixed inset-0 z-50 bg-stone-900/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF9F6] border border-[#E7E5E0] rounded-3xl max-w-5xl w-full shadow-xl overflow-hidden my-auto text-[#2D2A26]">
            {/* Header Modal - Nuansa Ketenangan & Kalem */}
            <div className="px-6 sm:px-8 py-5 border-b border-[#EAE7E1] flex items-center justify-between bg-white/70">
              <div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#2D2A26] tracking-wide">
                  Denah Tempat Duduk
                </h3>
                <p className="text-xs sm:text-sm text-[#7A7670] mt-1 font-normal">
                  Pilih nomor meja yang Anda inginkan dengan menekan titik meja pada denah:
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs sm:text-sm text-[#6E6A63] hidden sm:flex items-center gap-3 bg-[#F4F1EB] px-3.5 py-1.5 rounded-full border border-[#E4E0D7] font-normal">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    {availableCount} Tersedia
                  </span>
                  <span className="text-[#C8C4BC]">|</span>
                  <span className="flex items-center gap-1.5 text-[#8C7A54]">
                    <span className="w-2 h-2 rounded-full bg-[#C29D59]"></span>
                    {occupiedCount} Terisi
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFloorPlan(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE6DE] hover:bg-[#DDD8CF] text-[#55524E] flex items-center justify-center transition-colors"
                  title="Tutup"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* Body Denah */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Bingkai Gambar Denah Serene */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E2DDD5] bg-white shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/denahlokasicoffeshop.jpeg"
                  alt="Denah Lokasi Coffee Shop"
                  className="w-full h-auto block select-none pointer-events-none"
                />

                {/* OVERLAY TITIK MEJA DENGAN UKURAN BORDER SERAGAM */}
                {BLUEPRINT_TABLES.map((hotspot) => {
                  const tableStatus = getTableStatus(hotspot.number);
                  const isOccupied = tableStatus === "occupied";
                  const isSelected = modalSelectedTable?.number === hotspot.number;

                  return (
                    <div
                      key={hotspot.number}
                      onClick={() => handleSelectTableOnFloorPlan(hotspot)}
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 select-none cursor-pointer"
                      title={
                        isOccupied
                          ? `Meja #${hotspot.number} (${hotspot.code}) - Sedang Terisi`
                          : `Meja #${hotspot.number} (${hotspot.code}) - Tersedia (${hotspot.capacity} Kursi)`
                      }
                    >
                      {/* Box Border dengan Ukuran Seragam di Setiap Nomor Meja */}
                      <div
                        className={`w-[48px] h-[34px] sm:w-[58px] sm:h-[40px] rounded-xl border flex flex-col items-center justify-center transition-all duration-200 shadow-2xs ${
                          isSelected
                            ? "bg-white border-[#2D2A26] ring-2 ring-[#2D2A26]/30 shadow-md scale-105"
                            : isOccupied
                            ? "bg-[#F7F2E7]/95 border-[#DFD7CA] cursor-not-allowed opacity-85"
                            : "bg-white/95 border-[#D5CFC5] hover:border-[#2D2A26] hover:scale-105"
                        }`}
                      >
                        {/* Baris 1: Titik Bulat + Kode Meja (persis seperti contoh gambar) */}
                        <div className="flex items-center gap-1 leading-none">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isOccupied ? "bg-[#C29D59]" : "bg-emerald-600"
                            }`}
                          />
                          <span className="text-[11px] sm:text-xs font-normal text-[#2D2A26] tracking-tight">
                            {hotspot.code}
                          </span>
                        </div>

                        {/* Baris 2: Jumlah Kursi di bawahnya */}
                        <span className="text-[9px] sm:text-[10px] font-normal text-[#6E6A63] leading-none mt-1">
                          {isOccupied ? "Terisi" : `${hotspot.capacity} Kursi`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar Konfirmasi Meja Terpilih - Halus & Rapi */}
              {modalSelectedTable ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E0DBD2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#2D2A26]">
                        Meja: {modalSelectedTable.number} | Kursi: {modalSelectedTable.capacity}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#736F68] mt-0.5 font-normal">
                        Area: {modalSelectedTable.area} • Status: Tersedia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModalSelectedTable(null)}
                      className="px-4 py-2 text-xs sm:text-sm text-[#736F68] hover:text-[#2D2A26] font-normal transition-colors"
                    >
                      Pilih Lainnya
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmTableSelection(modalSelectedTable)}
                      className="px-5 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#403C37] text-white text-xs sm:text-sm font-normal transition-colors shadow-2xs"
                    >
                      Gunakan Meja Ini
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-center text-[#7A756D] py-1 font-normal">
                  Tekan meja putih di atas denah untuk memilih tempat duduk Anda.
                </p>
              )}

              {/* Panduan Keterangan 3 Kolom - Nuansa Ketenangan, Halus, Tanpa Bold */}
              <div className="bg-[#F8F6F1] border border-[#E5E0D7] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E6E1D8]">
                  <span className="material-symbols-outlined text-base text-[#7A756D]">
                    info
                  </span>
                  <h4 className="text-xs sm:text-sm font-normal text-[#47433E] uppercase tracking-wider">
                    Panduan &amp; Keterangan Denah Meja
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Kolom 1: Status Meja */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-2xs">
                    <p className="text-xs text-[#7A756D] uppercase tracking-wider mb-3 font-normal">
                      1. Status Ketersediaan
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE8E0]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1"></span>
                        <div>
                          <p className="text-sm text-[#2D2A26] font-normal">Meja Putih (Tersedia)</p>
                          <p className="text-xs text-[#7A756D] mt-0.5 font-normal">Meja kosong dan siap Anda pilih.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F6F1E8] border border-[#E3DC CE]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C29D59] shrink-0 mt-1"></span>
                        <div>
                          <p className="text-sm text-[#61543E] font-normal">Meja Kuning Muda (Terisi)</p>
                          <p className="text-xs text-[#8A795F] mt-0.5 font-normal">Sedang digunakan pelanggan lain.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 2: Kapasitas Kursi */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-2xs">
                    <p className="text-xs text-[#7A756D] uppercase tracking-wider mb-2 font-normal">
                      2. Kapasitas Kursi
                    </p>
                    <p className="text-xs sm:text-sm text-[#5F5B55] mb-3 leading-relaxed font-normal">
                      Keterangan &ldquo;Kursi&rdquo; menunjukkan kapasitas jumlah orang yang dapat ditampung meja, bukan harga meja.
                    </p>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE8E0] space-y-1.5 text-xs sm:text-[13px] text-[#4A4742] font-normal">
                      <div className="flex items-center justify-between py-0.5 border-b border-[#E9E4DC]">
                        <span>• Meja 2 Kursi</span>
                        <span className="text-[#7A756D]">Maksimal 2 orang</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5 border-b border-[#E9E4DC]">
                        <span>• Meja 4 Kursi</span>
                        <span className="text-[#7A756D]">Maksimal 4 orang</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5 border-b border-[#E9E4DC]">
                        <span>• Meja 6 Kursi</span>
                        <span className="text-[#7A756D]">Maksimal 6 orang</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5 border-b border-[#E9E4DC]">
                        <span>• Meja 8 Kursi</span>
                        <span className="text-[#7A756D]">Maksimal 8 orang</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5">
                        <span>• Meja 10 Kursi</span>
                        <span className="text-[#7A756D]">Maksimal 10 orang</span>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 3: Cara Pemilihan */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-2xs">
                    <p className="text-xs text-[#7A756D] uppercase tracking-wider mb-2.5 font-normal">
                      3. Cara Memilih Meja
                    </p>
                    <div className="space-y-2.5 text-xs sm:text-sm text-[#54504A] font-normal">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#E5E0D6] text-[#44403B] flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-normal">
                          1
                        </span>
                        <span className="leading-snug">
                          Pilih meja berwarna putih pada denah meja.
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#E5E0D6] text-[#44403B] flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-normal">
                          2
                        </span>
                        <span className="leading-snug">
                          Klik meja yang ingin digunakan.
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#E5E0D6] text-[#44403B] flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-normal">
                          3
                        </span>
                        <span className="leading-snug">
                          Periksa informasi kapasitas meja.
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#E5E0D6] text-[#44403B] flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-normal">
                          4
                        </span>
                        <span className="leading-snug">
                          Klik tombol &ldquo;Gunakan Meja Ini&rdquo; untuk mengonfirmasi pilihan.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal Bersih & Kalem */}
            <div className="px-6 sm:px-8 py-4 border-t border-[#EAE7E1] bg-white/70 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFloorPlan(false)}
                className="px-5 py-2 rounded-xl bg-[#EBE7DF] hover:bg-[#DCD7CD] text-[#4A4742] text-xs sm:text-sm font-normal transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
