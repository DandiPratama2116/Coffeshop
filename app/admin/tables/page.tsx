"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";

interface Table {
  id: string;
  number: number;
  capacity: number;
  locationId: number;
  locationName: string;
  seatingArea: string;
  status: "available" | "occupied";
  qrUrl: string;
}

// Konfigurasi presisi batas fisik meja pada denah asli: public/assets/denahlokasicoffeshop.jpeg
interface TableHotspot {
  number: number;
  code: string; // e.g. "VIP 1", "S1", "I1", "O1"
  area: "VIP" | "Indoor" | "Room Smoking" | "Outdoor";
  x: number; // Center X (%)
  y: number; // Center Y (%)
  w: number; // Width (%)
  h: number; // Height (%)
  capacity: number;
  shape: "circle" | "rect";
  description: string;
}

const BLUEPRINT_TABLES: TableHotspot[] = [
  // ── 1. ZONA VIP ROOM (4 MEJA: 6, 10, 10, 8 KURSI) ──
  { number: 101, code: "VIP 1", area: "VIP", x: 39.3, y: 25.5, w: 5.6, h: 14.0, capacity: 6, shape: "rect", description: "Meja VIP 1 (6 Kursi)" },
  { number: 102, code: "VIP 2", area: "VIP", x: 46.8, y: 25.5, w: 7.2, h: 14.0, capacity: 10, shape: "rect", description: "Meja VIP 2 (10 Kursi)" },
  { number: 103, code: "VIP 3", area: "VIP", x: 54.5, y: 25.5, w: 7.6, h: 14.0, capacity: 10, shape: "rect", description: "Meja VIP 3 (10 Kursi)" },
  { number: 104, code: "VIP 4", area: "VIP", x: 63.6, y: 25.5, w: 6.0, h: 14.0, capacity: 8, shape: "rect", description: "Meja VIP 4 (8 Kursi)" },

  // ── 2. SMOKING AREA (7 MEJA: S1, S2, S3, S4, S5, S7, S8) ──
  { number: 201, code: "S1", area: "Room Smoking", x: 10.3, y: 46.5, w: 4.8, h: 9.0, capacity: 2, shape: "circle", description: "Meja S1 (2 Kursi)" },
  { number: 202, code: "S2", area: "Room Smoking", x: 15.8, y: 46.5, w: 5.2, h: 8.5, capacity: 3, shape: "rect", description: "Meja S2 (2-3 Kursi)" },
  { number: 203, code: "S3", area: "Room Smoking", x: 21.6, y: 46.5, w: 4.5, h: 8.5, capacity: 2, shape: "rect", description: "Meja S3 (2 Kursi)" },
  { number: 204, code: "S4", area: "Room Smoking", x: 11.0, y: 62.5, w: 6.0, h: 9.5, capacity: 5, shape: "rect", description: "Meja S4 (5 Kursi)" },
  { number: 205, code: "S5", area: "Room Smoking", x: 21.4, y: 62.5, w: 6.4, h: 9.5, capacity: 6, shape: "rect", description: "Meja S5 (6 Kursi)" },
  { number: 206, code: "S7", area: "Room Smoking", x: 11.0, y: 78.5, w: 6.5, h: 10.5, capacity: 8, shape: "rect", description: "Meja S7 (8 Kursi)" },
  { number: 207, code: "S8", area: "Room Smoking", x: 21.4, y: 78.5, w: 7.2, h: 10.5, capacity: 10, shape: "rect", description: "Meja S8 (10 Kursi)" },

  // ── 3. INDOOR (DALAM RUANGAN - 8 MEJA: I1 - I8) ──
  { number: 1, code: "I1", area: "Indoor", x: 31.0, y: 50.5, w: 4.8, h: 8.8, capacity: 2, shape: "circle", description: "Meja Bundar I1 (2 Kursi)" },
  { number: 2, code: "I2", area: "Indoor", x: 31.0, y: 63.0, w: 4.8, h: 8.8, capacity: 4, shape: "circle", description: "Meja Bundar I2 (3-4 Kursi)" },
  { number: 3, code: "I3", area: "Indoor", x: 31.0, y: 78.5, w: 4.8, h: 8.8, capacity: 4, shape: "circle", description: "Meja Bundar I3 (3-4 Kursi)" },
  { number: 4, code: "I4", area: "Indoor", x: 39.5, y: 50.5, w: 5.2, h: 9.2, capacity: 3, shape: "rect", description: "Meja I4 (2-3 Kursi)" },
  { number: 5, code: "I5", area: "Indoor", x: 39.5, y: 63.0, w: 5.4, h: 9.5, capacity: 5, shape: "rect", description: "Meja I5 (4-5 Kursi)" },
  { number: 6, code: "I6", area: "Indoor", x: 39.5, y: 78.5, w: 5.4, h: 9.5, capacity: 5, shape: "rect", description: "Meja I6 (4-5 Kursi)" },
  { number: 7, code: "I7", area: "Indoor", x: 55.6, y: 76.5, w: 6.2, h: 12.0, capacity: 8, shape: "rect", description: "Meja I7 (8 Kursi)" },
  { number: 8, code: "I8", area: "Indoor", x: 63.9, y: 76.5, w: 7.6, h: 12.0, capacity: 12, shape: "rect", description: "Meja I8 (12 Kursi)" },

  // ── 4. OUTDOOR AREA (AREA LUAR - 12 MEJA: O1 - O12) ──
  { number: 301, code: "O1", area: "Outdoor", x: 73.3, y: 22.0, w: 4.5, h: 8.5, capacity: 2, shape: "circle", description: "Meja Teras O1 (1-2 Kursi)" },
  { number: 302, code: "O2", area: "Outdoor", x: 73.3, y: 34.0, w: 4.5, h: 8.5, capacity: 3, shape: "circle", description: "Meja Teras O2 (2-3 Kursi)" },
  { number: 303, code: "O3", area: "Outdoor", x: 73.3, y: 46.5, w: 4.5, h: 8.5, capacity: 4, shape: "circle", description: "Meja Teras O3 (4-5 Kursi)" },
  { number: 304, code: "O4", area: "Outdoor", x: 73.3, y: 73.5, w: 4.5, h: 8.5, capacity: 6, shape: "circle", description: "Meja Teras O4 (6-7 Kursi)" },
  { number: 305, code: "O5", area: "Outdoor", x: 81.3, y: 21.0, w: 5.0, h: 9.0, capacity: 2, shape: "rect", description: "Meja Taman O5 (2 Kursi)" },
  { number: 306, code: "O6", area: "Outdoor", x: 89.5, y: 23.0, w: 7.2, h: 13.0, capacity: 6, shape: "circle", description: "Meja Payung O6 (6 Kursi)" },
  { number: 307, code: "O7", area: "Outdoor", x: 81.3, y: 39.5, w: 5.8, h: 10.5, capacity: 7, shape: "rect", description: "Meja Taman O7 (7 Kursi)" },
  { number: 308, code: "O8", area: "Outdoor", x: 89.5, y: 40.0, w: 7.2, h: 13.0, capacity: 12, shape: "circle", description: "Meja Payung Besar O8 (12 Kursi)" },
  { number: 309, code: "O9", area: "Outdoor", x: 81.3, y: 60.5, w: 5.8, h: 10.5, capacity: 8, shape: "rect", description: "Meja Taman O9 (7-8 Kursi)" },
  { number: 310, code: "O10", area: "Outdoor", x: 89.5, y: 60.0, w: 6.8, h: 11.5, capacity: 10, shape: "rect", description: "Meja Panjang O10 (10 Kursi)" },
  { number: 311, code: "O11", area: "Outdoor", x: 81.3, y: 77.0, w: 5.5, h: 10.0, capacity: 4, shape: "rect", description: "Meja Taman O11 (4 Kursi)" },
  { number: 312, code: "O12", area: "Outdoor", x: 89.5, y: 76.0, w: 6.8, h: 11.5, capacity: 12, shape: "rect", description: "Meja Panjang O12 (12 Kursi)" },
];

const ROOM_AREAS = [
  { id: "VIP", name: "VIP Room", icon: "star", count: 4, badge: "👑 VIP (4 Meja)" },
  { id: "Indoor", name: "Indoor Lounge", icon: "weekend", count: 8, badge: "🛋️ Indoor (8 Meja)" },
  { id: "Room Smoking", name: "Smoking Area", icon: "smoking_rooms", count: 7, badge: "🚬 Smoking (7 Meja)" },
  { id: "Outdoor", name: "Outdoor Area", icon: "deck", count: 12, badge: "🌿 Outdoor (12 Meja)" },
];

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [viewMode, setViewMode] = useState<"floorplan" | "grid">("floorplan");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("ALL");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ number: 0, capacity: 4, locationId: 1, seatingArea: "Indoor" });
  const barcodeCardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchTables = () => {
    fetch(`${apiBase}/admin/tables`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Gagal memuat meja"))))
      .then((result) => {
        const base = window.location.origin;
        const loadedTables: Table[] = (result.data || []).map((table: any) => ({
          id: String(table.id),
          number: table.table_number,
          capacity: table.capacity || 4,
          locationId: table.location_id,
          locationName: table.location?.nama_tempat || "Coffee Shop",
          seatingArea: table.seating_area || "Indoor",
          status: table.status,
          qrUrl: `${base}/coffeshop-order/${table.table_number}`,
        }));
        setTables(loadedTables);

        if (selectedTable) {
          const updated = loadedTables.find((t) => t.id === selectedTable.id || t.number === selectedTable.number);
          if (updated) setSelectedTable(updated);
        }
      })
      .catch((err) => {
        if (err.message !== "Failed to fetch") {
          console.error(err);
        }
      });
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 6000);
    return () => clearInterval(interval);
  }, [apiBase]);

  const showQR = async (table: Table) => {
    setSelectedTable(table);
    const url = await QRCode.toDataURL(table.qrUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
    setQrDataUrl(url);
  };

  const downloadQR = () => {
    if (!qrDataUrl || !selectedTable) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `QR-Meja-${selectedTable.number}-${selectedTable.seatingArea}.png`;
    a.click();
  };

  const deleteTable = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus meja ini?")) return;
    fetch(`${apiBase}/admin/tables/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setTables((current) => current.filter((item) => item.id !== id));
          if (selectedTable?.id === id) setSelectedTable(null);
        }
      })
      .catch(console.error);
  };

  const addTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${apiBase}/admin/tables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_number: form.number,
        location_id: form.locationId,
        seating_area: form.seatingArea,
        capacity: form.capacity,
      }),
    });
    if (!response.ok) {
      alert("Gagal menambahkan meja. Pastikan nomor meja belum digunakan.");
      return;
    }
    const result = await response.json();
    const newTable = result.data;
    setTables((current) => [
      ...current,
      {
        id: String(newTable.id),
        number: newTable.table_number,
        capacity: newTable.capacity || form.capacity,
        locationId: form.locationId,
        locationName: "Coffee Shop",
        seatingArea: form.seatingArea,
        status: newTable.status || "available",
        qrUrl: `${window.location.origin}/coffeshop-order/${newTable.table_number}`,
      },
    ]);
    setShowModal(false);
    setForm({ number: 0, capacity: 4, locationId: 1, seatingArea: "Indoor" });
  };

  const available = tables.filter((t) => t.status === "available").length;
  const occupied = tables.filter((t) => t.status === "occupied").length;
  const totalSeats = tables.reduce((acc, t) => acc + (t.capacity || 0), 0);
  const availableSeats = tables
    .filter((t) => t.status === "available")
    .reduce((acc, t) => acc + (t.capacity || 0), 0);

  const findTableForHotspot = (hotspot: TableHotspot): Table => {
    const found = tables.find((t) => t.number === hotspot.number);
    if (found) return found;
    return {
      id: `virtual-${hotspot.number}`,
      number: hotspot.number,
      capacity: hotspot.capacity,
      locationId: 1,
      locationName: "Coffee Shop",
      seatingArea: hotspot.area,
      status: "available",
      qrUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/coffeshop-order/${hotspot.number}`,
    };
  };

  const filteredTables = tables.filter((t) => {
    if (selectedAreaFilter === "ALL") return true;
    return t.seatingArea.toLowerCase().includes(selectedAreaFilter.toLowerCase());
  });

  const filteredHotspots = BLUEPRINT_TABLES.filter((h) => {
    if (selectedAreaFilter === "ALL") return true;
    return h.area.toLowerCase().includes(selectedAreaFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-24 max-w-[1600px] mx-auto">
      {/* 1. Header Info & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">table_restaurant</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Denah Lokasi Tempat Duduk & Barcode QR
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Denah tata letak besar dan jelas. Klik meja manapun pada denah untuk menampilkan Barcode QR & status di bawahnya.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle View: Denah vs Grid */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setViewMode("floorplan")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "floorplan"
                  ? "bg-white text-[#3B4CB8] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-base">map</span>
              Denah Lokasi
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-white text-[#3B4CB8] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              Daftar Grid
            </button>
          </div>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">table_restaurant</span>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{tables.length} Meja</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Total Kapasitas: {totalSeats} Kursi
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">event_seat</span>
          </div>
          <div>
            <p className="text-xl font-black text-emerald-600">{available} Meja</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Sisa {availableSeats} Kursi Kosong
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div>
            <p className="text-xl font-black text-amber-500">{occupied} Meja</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Diduduki ({totalSeats - availableSeats} Kursi)
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">meeting_room</span>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">4 Ruangan</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">VIP, Indoor, Smoke, Out</p>
          </div>
        </div>
      </div>

      {/* 3. Filter Lokasi Ruangan & Legend */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedAreaFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedAreaFilter === "ALL"
                ? "bg-[#3B4CB8] text-white shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined text-sm">apartment</span>
            Semua Ruangan ({BLUEPRINT_TABLES.length})
          </button>

          {ROOM_AREAS.map((area) => {
            const isSelected = selectedAreaFilter.toLowerCase() === area.id.toLowerCase();
            return (
              <button
                key={area.id}
                onClick={() => setSelectedAreaFilter(area.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{area.icon}</span>
                {area.name}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {area.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Tersedia (Kosong)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
            Terisi Pelanggan
          </span>
        </div>
      </div>

      {/* 4. DENAH LOKASI TEMPAT DUDUK BESAR (FULL WIDTH) */}
      {viewMode === "floorplan" ? (
        <div className="space-y-6">
          {/* Card Denah Besar */}
          <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-lg border border-slate-200/80">
            {/* Header Denah */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-500 text-xl">touch_app</span>
                <div>
                  <span className="text-slate-800 font-extrabold text-sm block">
                    Denah Arsitektural Coffee Shop
                  </span>
                  <span className="text-slate-500 text-xs font-medium">
                    Klik langsung meja pada denah di bawah untuk membuka Barcode QR & memantau status
                  </span>
                </div>
              </div>

              {selectedTable ? (
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-indigo-50 text-[#3B4CB8] rounded-full font-black border border-indigo-200/80 flex items-center gap-2 text-xs shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B4CB8] animate-ping"></span>
                    Meja Terpilih: #{selectedTable.number} ({selectedTable.seatingArea})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  Belum ada meja dipilih
                </span>
              )}
            </div>

            {/* Kanvas Denah Besar Penuh */}
            <div className="relative rounded-3xl overflow-hidden shadow-inner border border-slate-200 bg-[#f8fafc]">
              {/* Gambar Arsitektural Asli */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/denahlokasicoffeshop.jpeg"
                alt="Denah Lokasi Coffee Shop"
                className="w-full h-auto block select-none pointer-events-none"
              />

              {/* OVERLAY TEMPAT DUDUK INTERAKTIF PRESISI & BESAR */}
              {BLUEPRINT_TABLES.map((hotspot) => {
                const table = findTableForHotspot(hotspot);
                const isSelected = selectedTable?.number === hotspot.number;
                const isOccupied = table.status === "occupied";
                const isDimmed =
                  selectedAreaFilter !== "ALL" &&
                  !hotspot.area.toLowerCase().includes(selectedAreaFilter.toLowerCase());

                return (
                  <div
                    key={hotspot.number}
                    onClick={() => showQR(table)}
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 select-none cursor-pointer ${isDimmed ? "opacity-20 hover:opacity-100" : "opacity-100"}`}
                    title={hotspot.description}
                  >
                    {/* Box Border dengan Ukuran Seragam di Setiap Nomor Meja */}
                    <div
                      className={`w-[48px] h-[34px] sm:w-[58px] sm:h-[40px] rounded-xl border flex flex-col items-center justify-center transition-all duration-200 shadow-2xs ${
                        isSelected
                          ? "bg-slate-900 border-white ring-2 ring-white/50 shadow-md scale-105"
                          : isOccupied
                          ? "bg-amber-600/90 border-amber-300 shadow-sm"
                          : "bg-slate-900/90 border-slate-600 hover:border-white hover:scale-105"
                      }`}
                    >
                      {/* Baris 1: Titik Status + Kode Meja */}
                      <div className="flex items-center gap-1.5 leading-none">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isOccupied ? "bg-amber-300 animate-ping" : "bg-emerald-400"
                          }`}
                        />
                        <span className="text-xs sm:text-sm font-normal tracking-tight text-white">
                          {hotspot.code}
                        </span>
                      </div>

                      {/* Baris 2: Sub-label Kapasitas Kursi */}
                      <span className="text-[10px] sm:text-[11px] font-normal mt-0.5 leading-tight text-slate-200">
                        {hotspot.capacity} Kursi
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dock Pilih Cepat Meja di Bawah Denah */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#3B4CB8]">table_restaurant</span>
                  Pilih Cepat Tempat Duduk di Ruangan Ini:
                </p>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredHotspots.length} meja siap dipilih
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredHotspots.map((hotspot) => {
                  const table = findTableForHotspot(hotspot);
                  const isSelected = selectedTable?.number === hotspot.number;
                  const isOccupied = table.status === "occupied";

                  return (
                    <button
                      key={hotspot.number}
                      onClick={() => showQR(table)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        isSelected
                          ? "bg-[#3B4CB8] text-white border-[#3B4CB8] shadow-md scale-105"
                          : isOccupied
                          ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOccupied ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                        }`}
                      />
                      <span>{hotspot.code}</span>
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected ? "text-indigo-100" : "text-slate-400"
                        }`}
                      >
                        ({hotspot.capacity} Kursi)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. PANEL BARCODE QR & DETAIL MEJA DI BAWAH DENAH */}
          <div ref={barcodeCardRef} className="scroll-mt-6">
            {!selectedTable ? (
              /* State Kosong: Petunjuk untuk mengklik meja */
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
                </div>
                <h3 className="text-slate-800 font-extrabold text-base">Barcode QR & Detail Meja</h3>
                <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                  Silakan klik salah satu meja pada denah lokasi di atas untuk menampilkan Barcode QR pemesanan, kapasitas tempat duduk, dan status pelanggan di sini.
                </p>
              </div>
            ) : (
              /* State Meja Terpilih: Card Barcode QR Lebar di Bawah Denah */
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg overflow-hidden animate-fade-in">
                {/* Banner Header Meja */}
                <div className="px-7 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                      <span className="material-symbols-outlined text-2xl">table_restaurant</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white tracking-tight">
                          Detail Meja #{selectedTable.number}
                        </span>
                        <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {selectedTable.seatingArea}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5">
                        Kapasitas Ruangan: <strong className="text-white">{selectedTable.capacity} Kursi</strong> • Lokasi: {selectedTable.locationName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider flex items-center gap-2 ${
                        selectedTable.status === "occupied"
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                          : "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      {selectedTable.status === "occupied" ? "Sedang Terisi (Pelanggan)" : "Meja Kosong (Tersedia)"}
                    </span>
                  </div>
                </div>

                {/* Body Content 3 Kolom: Info Status | Barcode QR | Tombol Aksi */}
                <div className="p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Kolom 1: Status & Deskripsi Otomatis (4 Kolom) */}
                  <div className="md:col-span-4 space-y-3">
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        selectedTable.status === "occupied"
                          ? "bg-amber-50/90 border-amber-200 text-amber-900"
                          : "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1.5">
                        <span className="material-symbols-outlined text-base">
                          {selectedTable.status === "occupied" ? "smart_toy" : "check_circle"}
                        </span>
                        <span className="text-xs">
                          {selectedTable.status === "occupied"
                            ? "Status Otomatis: Meja Aktif"
                            : "Status Otomatis: Siap Digunakan"}
                        </span>
                      </div>
                      <p className="opacity-90 text-[11px] leading-relaxed">
                        {selectedTable.status === "occupied"
                          ? "Meja ini otomatis terisi karena ada pelanggan yang telah scan barcode & memesan. Meja otomatis kosong kembali setelah pesanan selesai."
                          : "Meja ini kosong dan siap dipakai. Saat pelanggan scan barcode di meja ini dan memesan, denah akan langsung menyala kuning."}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">URL Pemesanan Meja</p>
                      <p className="text-slate-600 text-xs font-mono break-all">{selectedTable.qrUrl}</p>
                    </div>
                  </div>

                  {/* Kolom 2: Gambar Barcode QR HD (4 Kolom) */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {qrDataUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={qrDataUrl}
                            alt={`QR Meja ${selectedTable.number}`}
                            className="w-44 h-44 rounded-xl block"
                          />
                        </div>
                        <p className="text-xs font-bold text-slate-700 mt-2.5 text-center">
                          Barcode QR Meja #{selectedTable.number}
                        </p>
                        <p className="text-[10px] text-slate-400 text-center">
                          Tempel barcode ini di meja fisik restoran
                        </p>
                      </div>
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                        Membuat QR Code...
                      </div>
                    )}
                  </div>

                  {/* Kolom 3: Tombol Aksi Cepat (4 Kolom) */}
                  <div className="md:col-span-4 space-y-2.5">
                    <button
                      onClick={downloadQR}
                      className="w-full bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      Download Barcode QR (PNG)
                    </button>

                    <a
                      href={selectedTable.qrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                      Buka Menu Pemesanan Pelanggan
                    </a>

                    {selectedTable.id && !selectedTable.id.startsWith("virtual") && (
                      <button
                        onClick={() => deleteTable(selectedTable.id)}
                        className="w-full text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 font-semibold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 mt-1"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        Hapus Meja Ini
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* TAMPILAN DAFTAR GRID KARTU (GRID VIEW)                          */
        /* ============================================================== */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredTables.map((table) => {
            const isSelected = selectedTable?.id === table.id;
            const isOccupied = table.status === "occupied";
            const isVIP = table.seatingArea.toLowerCase().includes("vip");

            return (
              <div
                key={table.id}
                onClick={() => showQR(table)}
                className={`bg-white border rounded-3xl p-4 sm:p-5 text-center cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden group ${
                  isOccupied
                    ? "border-amber-200 bg-amber-50/30"
                    : isVIP
                    ? "border-amber-200/60 bg-gradient-to-b from-amber-50/20 to-white"
                    : "border-slate-100 hover:border-indigo-200"
                } ${isSelected ? "ring-2 ring-[#3B4CB8] border-transparent shadow-md" : ""}`}
              >
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isVIP ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {table.seatingArea}
                  </span>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isOccupied
                      ? "bg-amber-100 text-amber-600"
                      : isVIP
                      ? "bg-amber-100 text-amber-700"
                      : "bg-indigo-50 text-[#3B4CB8]"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isVIP ? "star" : "table_restaurant"}
                  </span>
                </div>

                <p className="text-slate-800 font-extrabold text-lg">#{table.number}</p>
                <p className="text-slate-500 text-xs font-semibold">{table.capacity} Kursi</p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOccupied ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-bold ${
                      isOccupied ? "text-amber-600" : "text-emerald-600"
                    }`}
                  >
                    {isOccupied ? "Terisi" : "Tersedia"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. ADD TABLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-[480px] border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Tambah Meja</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={addTable} id="table-form" className="px-6 py-2 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Nomor Meja *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.number || ""}
                  onChange={(e) => setForm((f) => ({ ...f, number: Number(e.target.value) }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Contoh: 11"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Lokasi Ruangan *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROOM_AREAS.map((room) => {
                    const isSelected = form.seatingArea === room.id;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            seatingArea: room.id,
                            capacity: room.id === "VIP" ? 10 : 4,
                          }));
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">{room.icon}</span>
                          <div>
                            <p className="font-semibold text-xs leading-tight">{room.name}</p>
                            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{room.id === "VIP" ? "8-10 orang" : "2-6 orang"}</p>
                          </div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Kapasitas Kursi *
                  </label>
                  <div className="flex gap-1">
                    {[2, 4, 6, 8, 10].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, capacity: cap }))}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                          form.capacity === cap
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Contoh: 4"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 mt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="table-form"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}