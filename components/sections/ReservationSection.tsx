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

interface AreaOption {
  key: string;
  label: string;
  area: "VIP" | "Indoor" | "Room Smoking" | "Outdoor";
  floor: 1 | 2;
  description: string;
}

const AREA_OPTIONS: AreaOption[] = [
  { key: "L1-Indoor", label: "Lantai 1 • Indoor AC Lounge", area: "Indoor", floor: 1, description: "Ruangan ber-AC nyaman & tenang" },
  { key: "L1-VIP", label: "Lantai 1 • VIP Room", area: "VIP", floor: 1, description: "Privat 6-10 orang" },
  { key: "L1-Smoking", label: "Lantai 1 • Smoking Area", area: "Room Smoking", floor: 1, description: "Area smoking tertutup" },
  { key: "L1-Outdoor", label: "Lantai 1 • Outdoor Garden", area: "Outdoor", floor: 1, description: "Taman terbuka & asri" },
  { key: "L2-VIP", label: "Lantai 2 • VIP Meeting Room (M1)", area: "VIP", floor: 2, description: "Ruang konferensi & rapat" },
  { key: "L2-Indoor", label: "Lantai 2 • Co-Working Lounge", area: "Indoor", floor: 2, description: "Meja kerja pod & sofa santai" },
  { key: "L2-Smoking", label: "Lantai 2 • Smoking Balcony", area: "Room Smoking", floor: 2, description: "Balkon semi terbuka" },
  { key: "L2-Outdoor", label: "Lantai 2 • Rooftop Terrace", area: "Outdoor", floor: 2, description: "Pemandangan rooftop terbuka" },
];

const BLUEPRINT_TABLES_L1: TableHotspot[] = [
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

const BLUEPRINT_TABLES_L2: TableHotspot[] = [
  // ── 1. VIP MEETING ROOM (1 MEJA BESAR KONFERENSI - 10 KURSI) ──
  { number: 401, code: "M1", area: "VIP", x: 45.4, y: 24.0, w: 8.5, h: 12.0, capacity: 10, shape: "rect", description: "Ruang VIP Meeting Room (10 Kursi)" },

  // ── 2. SMOKING BALCONY (2 MEJA: SB1, SB2 - 4 KURSI) ──
  { number: 402, code: "SB1", area: "Room Smoking", x: 20.8, y: 22.5, w: 5.5, h: 9.0, capacity: 4, shape: "rect", description: "Sofa Balcony 1 (4 Kursi)" },
  { number: 403, code: "SB2", area: "Room Smoking", x: 20.8, y: 41.5, w: 5.5, h: 9.0, capacity: 4, shape: "rect", description: "Sofa Balcony 2 (4 Kursi)" },

  // ── 3. INDOOR CO-WORKING LOUNGE (5 MEJA: CW1 - CW5) ──
  { number: 404, code: "CW1", area: "Indoor", x: 42.0, y: 51.5, w: 10.0, h: 11.0, capacity: 8, shape: "rect", description: "Meja Co-Working Pod Utama (8 Kursi)" },
  { number: 405, code: "CW2", area: "Indoor", x: 25.8, y: 64.0, w: 4.5, h: 8.0, capacity: 2, shape: "rect", description: "Focus Work Desk 1 (2 Kursi)" },
  { number: 406, code: "CW3", area: "Indoor", x: 31.8, y: 78.5, w: 4.5, h: 7.5, capacity: 2, shape: "rect", description: "Focus Work Desk 2 (2 Kursi)" },
  { number: 407, code: "CW4", area: "Indoor", x: 41.6, y: 74.5, w: 5.5, h: 8.5, capacity: 4, shape: "rect", description: "Meja Kerja Pod Tengah (4 Kursi)" },
  { number: 408, code: "CW5", area: "Indoor", x: 50.8, y: 73.5, w: 6.5, h: 9.0, capacity: 5, shape: "rect", description: "Sofa Lounge Indoor (5 Kursi)" },

  // ── 4. OUTDOOR ROOFTOP TERRACE (9 MEJA: RT1 - RT9) ──
  { number: 409, code: "RT1", area: "Outdoor", x: 60.5, y: 25.0, w: 5.0, h: 8.5, capacity: 4, shape: "rect", description: "Meja Teras Rooftop 1 (4 Kursi)" },
  { number: 410, code: "RT2", area: "Outdoor", x: 70.0, y: 19.5, w: 6.0, h: 9.0, capacity: 6, shape: "rect", description: "Meja Teras Rooftop 2 (6 Kursi)" },
  { number: 411, code: "RT3", area: "Outdoor", x: 79.5, y: 21.0, w: 7.0, h: 10.0, capacity: 6, shape: "rect", description: "Sofa Sudut Rooftop 3 (6 Kursi)" },
  { number: 412, code: "RT4", area: "Outdoor", x: 69.5, y: 37.0, w: 7.0, h: 12.0, capacity: 6, shape: "circle", description: "Meja Payung Rooftop 4 (6 Kursi)" },
  { number: 413, code: "RT5", area: "Outdoor", x: 79.2, y: 38.0, w: 5.5, h: 9.0, capacity: 4, shape: "rect", description: "Meja Teras Rooftop 5 (4 Kursi)" },
  { number: 414, code: "RT6", area: "Outdoor", x: 69.0, y: 56.5, w: 6.0, h: 10.0, capacity: 4, shape: "circle", description: "Meja Bundar Rooftop 6 (4 Kursi)" },
  { number: 415, code: "RT7", area: "Outdoor", x: 79.2, y: 56.0, w: 5.5, h: 9.0, capacity: 4, shape: "rect", description: "Meja Teras Rooftop 7 (4 Kursi)" },
  { number: 416, code: "RT8", area: "Outdoor", x: 70.0, y: 74.5, w: 5.5, h: 9.0, capacity: 4, shape: "rect", description: "Meja Santai Rooftop 8 (4 Kursi)" },
  { number: 417, code: "RT9", area: "Outdoor", x: 78.5, y: 72.5, w: 7.0, h: 12.0, capacity: 6, shape: "circle", description: "Meja Payung Rooftop 9 (6 Kursi)" },
];

const ALL_BLUEPRINT_TABLES = [...BLUEPRINT_TABLES_L1, ...BLUEPRINT_TABLES_L2];

export default function ReservationSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    areaKey: "L1-Indoor",
    area: "Indoor" as "VIP" | "Indoor" | "Room Smoking" | "Outdoor",
    selectedTableNumber: null as number | null,
    selectedTableCode: "",
    selectedFloor: 1 as 1 | 2,
    description: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);
  const [highlightArea, setHighlightArea] = useState<string>("Indoor");
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

  // Handler ketika Customer memilih Area di dropdown formulir
  const handleAreaChange = (areaKey: string) => {
    const selectedOption = AREA_OPTIONS.find((opt) => opt.key === areaKey);
    if (!selectedOption) return;

    // Otomatis sinkronkan lantai dan area fokus denah
    setSelectedFloor(selectedOption.floor);
    setHighlightArea(selectedOption.area);

    setForm((current) => {
      // Jika meja sebelumnya ada di area/lantai berbeda, reset meja terpilih
      let resetTable = false;
      if (current.selectedTableNumber) {
        const prevTable = ALL_BLUEPRINT_TABLES.find((t) => t.number === current.selectedTableNumber);
        if (!prevTable || prevTable.area !== selectedOption.area || current.selectedFloor !== selectedOption.floor) {
          resetTable = true;
        }
      }

      return {
        ...current,
        areaKey: selectedOption.key,
        area: selectedOption.area,
        selectedFloor: selectedOption.floor,
        ...(resetTable
          ? {
              selectedTableNumber: null,
              selectedTableCode: "",
              description: current.description
                .replace(/Lt\.\s*\d+\s*•\s*Meja:\s*\(?\d+\)?\s*\(?.*?\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
                .replace(/Meja:\s*\(?\d+\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
                .trim(),
            }
          : {}),
      };
    });
    setModalSelectedTable(null);
  };

  const getTableStatus = (tableNumber: number): "available" | "occupied" => {
    const found = liveTables.find((t) => t.table_number === tableNumber);
    return found ? found.status : "available";
  };

  const currentHotspots = selectedFloor === 1 ? BLUEPRINT_TABLES_L1 : BLUEPRINT_TABLES_L2;
  const currentFloorImage = selectedFloor === 1 ? "/assets/denahlokasicoffeshop.jpeg" : "/assets/denah_lantai_2.jpg";

  const handleSelectTableOnFloorPlan = (hotspot: TableHotspot) => {
    const tableStatus = getTableStatus(hotspot.number);
    if (tableStatus === "occupied") {
      alert(`Meja #${hotspot.number} (${hotspot.code}) saat ini sedang digunakan. Silakan pilih meja yang bertanda hijau.`);
      return;
    }
    setModalSelectedTable(hotspot);
  };

  const confirmTableSelection = (hotspot: TableHotspot) => {
    const tableTag = `Lt. ${selectedFloor} • Meja: ${hotspot.number} (${hotspot.code}) | Kursi: ${hotspot.capacity}`;

    // Cari areaKey yang cocok
    const matchedOpt = AREA_OPTIONS.find((opt) => opt.floor === selectedFloor && opt.area === hotspot.area);

    setForm((current) => {
      const cleanDesc = current.description
        .replace(/\[Pilihan Meja:.*?\]/g, "")
        .replace(/\[Area:.*?\]/g, "")
        .replace(/Lt\.\s*\d+\s*•\s*Meja:\s*\(?\d+\)?\s*\(?.*?\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
        .replace(/Meja:\s*\(?\d+\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
        .replace(/^[•\s-]+|[•\s-]+$/g, "")
        .trim();

      return {
        ...current,
        areaKey: matchedOpt ? matchedOpt.key : current.areaKey,
        area: hotspot.area,
        guests: String(Math.min(hotspot.capacity, 10)),
        selectedTableNumber: hotspot.number,
        selectedTableCode: hotspot.code,
        selectedFloor: selectedFloor,
        description: cleanDesc ? `${tableTag} • ${cleanDesc}` : tableTag,
      };
    });
    setHighlightArea(hotspot.area);
    setShowFloorPlan(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      let finalDescription = form.description.trim();
      if (form.selectedTableNumber) {
        const tableHotspot = ALL_BLUEPRINT_TABLES.find((t) => t.number === form.selectedTableNumber);
        const totalKursi = tableHotspot ? tableHotspot.capacity : form.guests;
        const floorInfo = form.selectedFloor ? `Lt. ${form.selectedFloor} • ` : "";
        const tableTag = `${floorInfo}Meja: ${form.selectedTableNumber} | Kursi: ${totalKursi}`;

        const cleanDesc = finalDescription
          .replace(/\[Pilihan Meja:.*?\]/g, "")
          .replace(/\[Area:.*?\]/g, "")
          .replace(/Lt\.\s*\d+\s*•\s*Meja:\s*\(?\d+\)?\s*\(?.*?\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
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
        areaKey: "L1-Indoor",
        area: "Indoor",
        selectedTableNumber: null,
        selectedTableCode: "",
        selectedFloor: 1,
        description: "",
      });
      setModalSelectedTable(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Reservasi gagal dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCurrentFloorTables = currentHotspots.length;
  const occupiedCurrentFloorCount = currentHotspots.filter((h) => getTableStatus(h.number) === "occupied").length;
  const availableCurrentFloorCount = totalCurrentFloorTables - occupiedCurrentFloorCount;

  // Nama label area aktif
  const currentAreaLabel = AREA_OPTIONS.find((opt) => opt.key === form.areaKey)?.label || `${form.area} (Lt. ${form.selectedFloor})`;

  return (
    <section id="Reservasi" className="py-20 px-4 sm:px-6 md:px-12 bg-white relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
                  placeholder="Nama"
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
                  placeholder="Alamat Email"
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
                  Tanggal Reservasi
                </label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Baris 3: Jumlah Tamu & Pilihan Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Jumlah Orang
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => updateField("guests", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} Orang
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Pilihan Area &amp; Suasana
                </label>
                <select
                  value={form.areaKey}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                >
                  <optgroup label="Lantai 1">
                    <option value="L1-Indoor">Lantai 1 • Indoor AC Lounge</option>
                    <option value="L1-VIP">Lantai 1 • VIP Room</option>
                    <option value="L1-Smoking">Lantai 1 • Smoking Area</option>
                    <option value="L1-Outdoor">Lantai 1 • Outdoor Garden</option>
                  </optgroup>
                  <optgroup label="Lantai 2">
                    <option value="L2-VIP">Lantai 2 • VIP Meeting Room (M1)</option>
                    <option value="L2-Indoor">Lantai 2 • Co-Working Lounge</option>
                    <option value="L2-Smoking">Lantai 2 • Smoking Balcony</option>
                    <option value="L2-Outdoor">Lantai 2 • Rooftop Terrace</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Tombol Buka Denah & Status Meja Terpilih */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">map</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {form.selectedTableNumber ? (
                      <span className="text-indigo-600">
                        Meja #{form.selectedTableNumber} ({form.selectedTableCode}) Terpilih (Lt. {form.selectedFloor})
                      </span>
                    ) : (
                      <span>Denah Otomatis: {currentAreaLabel}</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {form.selectedTableNumber
                      ? `Area ${form.area} • Anda dapat mengganti pilihan meja kapan saja.`
                      : `Denah akan langsung menampilkan area ${form.area} di Lantai ${form.selectedFloor}.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {form.selectedTableNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((c) => ({
                        ...c,
                        selectedTableNumber: null,
                        selectedTableCode: "",
                        description: c.description
                          .replace(/Lt\.\s*\d+\s*•\s*Meja:\s*\(?\d+\)?\s*\(?.*?\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
                          .replace(/Meja:\s*\(?\d+\)?\s*\|\s*Kursi:\s*\(?\d+\)?/g, "")
                          .trim(),
                      }));
                      setModalSelectedTable(null);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                  >
                    Reset Meja
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    // Pastikan denah terbuka langsung pada lantai & area yang dipilih
                    setSelectedFloor(form.selectedFloor);
                    setHighlightArea(form.area);
                    setShowFloorPlan(true);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-base">near_me</span>
                  <span>{form.selectedTableNumber ? "Ganti Meja" : "Buka Denah Meja"}</span>
                </button>
              </div>
            </div>

            {/* Baris 4: Catatan Khusus */}
            <div>
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                Catatan / Permintaan Khusus
              </label>
              <textarea
                rows={3}
                placeholder=""
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Tombol Submit */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Mengirim Reservasi..." : "Kirim Reservasi Sekarang"}
              </button>
              {status && <p className="mt-4 text-sm font-bold text-slate-700">{status}</p>}
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL POP-UP DENAH LOKASI - OTOMATIS TAMPILKAN AREA TERPILIH              */}
      {/* ========================================================================= */}
      {showFloorPlan && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF9F6] border border-[#E7E5E0] rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto text-[#2D2A26]">
            {/* Header Modal */}
            <div className="px-6 sm:px-8 py-5 border-b border-[#EAE7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A26] tracking-tight flex items-center gap-2">
                  <span>Denah Tempat Duduk Cafe</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Fokus: {currentAreaLabel}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#7A7670] mt-0.5 font-normal">
                  Meja pada area yang Anda pilih disorot khusus. Tekan meja untuk memilih:
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-xs sm:text-sm text-[#6E6A63] hidden md:flex items-center gap-3 bg-[#F4F1EB] px-3.5 py-1.5 rounded-full border border-[#E4E0D7]">
                  <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    {availableCurrentFloorCount} Tersedia (Lt. {selectedFloor})
                  </span>
                  <span className="text-[#C8C4BC]">|</span>
                  <span className="flex items-center gap-1.5 text-[#8C7A54] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#C29D59]"></span>
                    {occupiedCurrentFloorCount} Terisi
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFloorPlan(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE6DE] hover:bg-[#DDD8CF] text-[#55524E] flex items-center justify-center transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* Floor Switcher Bar */}
            <div className="px-6 sm:px-8 py-3.5 bg-[#F4F1EB] border-b border-[#EAE7E1] flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/80 p-1 rounded-2xl border border-[#E3DEC]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFloor(1);
                    setModalSelectedTable(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedFloor === 1
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-[#6E6A63] hover:text-[#2D2A26] hover:bg-black/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">foundation</span>
                  <span>Lantai 1 • Utama &amp; Outdoor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFloor(2);
                    setModalSelectedTable(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedFloor === 2
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-[#6E6A63] hover:text-[#2D2A26] hover:bg-black/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">roofing</span>
                  <span>Lantai 2 • VIP Meeting &amp; Rooftop</span>
                </button>
              </div>

              <div className="text-xs text-[#7A756D] font-medium hidden md:block">
                {selectedFloor === 1
                  ? "Area: VIP Room, Smoking Room, Indoor Lounge, Outdoor Garden"
                  : "Area: VIP Meeting Room, Smoking Balcony, Co-Working Lounge, Rooftop Terrace"}
              </div>
            </div>

            {/* Sorot Area Bar (Tepat Dibawah Border Lantai 1 atau 2) */}
            <div className="px-6 sm:px-8 py-2.5 bg-white/90 border-b border-[#EAE7E1] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#7A756D] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-indigo-600">filter_alt</span>
                  Sorot Area:
                </span>
                {[
                  { id: "all", label: "Semua Area" },
                  { id: "VIP", label: "VIP Room" },
                  { id: "Indoor", label: "Indoor AC" },
                  { id: "Room Smoking", label: "Smoking Area" },
                  { id: "Outdoor", label: "Outdoor" },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setHighlightArea(a.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      highlightArea === a.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                *Meja area yang disorot akan bercahaya / ber-border tebal di denah
              </span>
            </div>

            {/* Body Denah */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Bingkai Gambar Denah Serene */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E2DDD5] bg-white shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentFloorImage}
                  alt={`Denah Lantai ${selectedFloor} Coffee Shop`}
                  className="w-full h-auto block select-none pointer-events-none"
                />

                {/* OVERLAY TITIK MEJA SESUAI LANTAI AKTIF */}
                {currentHotspots.map((hotspot) => {
                  const tableStatus = getTableStatus(hotspot.number);
                  const isOccupied = tableStatus === "occupied";
                  const isSelected = modalSelectedTable?.number === hotspot.number;
                  const isAreaMatched = highlightArea === "all" || hotspot.area === highlightArea;

                  return (
                    <div
                      key={hotspot.number}
                      onClick={() => handleSelectTableOnFloorPlan(hotspot)}
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 select-none cursor-pointer transition-opacity duration-200 ${
                        isAreaMatched ? "opacity-100 scale-100" : "opacity-40 hover:opacity-90"
                      }`}
                      title={
                        isOccupied
                          ? `Meja #${hotspot.number} (${hotspot.code}) - Sedang Terisi`
                          : `Meja #${hotspot.number} (${hotspot.code}) - Area ${hotspot.area} - Tersedia (${hotspot.capacity} Kursi)`
                      }
                    >
                      <div
                        className={`w-[48px] h-[34px] sm:w-[58px] sm:h-[40px] rounded-xl border flex flex-col items-center justify-center transition-all duration-200 shadow-2xs ${
                          isSelected
                            ? "bg-white border-[#2D2A26] ring-2 ring-[#2D2A26]/30 shadow-md scale-105"
                            : isOccupied
                            ? "bg-[#F7F2E7]/95 border-[#DFD7CA] cursor-not-allowed opacity-85"
                            : isAreaMatched
                            ? "bg-white border-indigo-400 ring-2 ring-indigo-500/20 hover:border-indigo-600 hover:scale-105 shadow-xs"
                            : "bg-white/95 border-[#D5CFC5] hover:border-[#2D2A26] hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center gap-1 leading-none">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isOccupied ? "bg-[#C29D59]" : isAreaMatched ? "bg-indigo-600" : "bg-emerald-600"
                            }`}
                          />
                          <span className="text-[11px] sm:text-xs font-bold text-[#2D2A26] tracking-tight">
                            {hotspot.code}
                          </span>
                        </div>

                        <span className="text-[9px] sm:text-[10px] font-medium text-[#6E6A63] leading-none mt-1">
                          {isOccupied ? "Terisi" : `${hotspot.capacity} Kursi`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar Konfirmasi Meja Terpilih */}
              {modalSelectedTable ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E0DBD2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#2D2A26]">
                        Lt. {selectedFloor} • Meja {modalSelectedTable.number} ({modalSelectedTable.code}) | {modalSelectedTable.capacity} Kursi
                      </h4>
                      <p className="text-xs sm:text-sm text-[#736F68] mt-0.5 font-normal">
                        Area: {modalSelectedTable.area} • Deskripsi: {modalSelectedTable.description} • Status: Tersedia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModalSelectedTable(null)}
                      className="px-4 py-2 text-xs sm:text-sm text-[#736F68] hover:text-[#2D2A26] font-semibold transition-colors cursor-pointer"
                    >
                      Pilih Lainnya
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmTableSelection(modalSelectedTable)}
                      className="px-5 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#403C37] text-white text-xs sm:text-sm font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      Gunakan Meja Ini
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-center text-[#7A756D] py-1 font-medium">
                  Menampilkan meja di <strong className="text-slate-900 font-bold">{currentAreaLabel}</strong>. Tekan meja yang disorot untuk memilih.
                </p>
              )}

              {/* Panduan Keterangan 3 Kolom */}
              <div className="bg-[#F8F6F1] border border-[#E5E0D7] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E6E1D8]">
                  <span className="material-symbols-outlined text-base text-[#7A756D]">
                    info
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#47433E] uppercase tracking-wider">
                    Panduan &amp; Keterangan Denah Meja (Lantai 1 &amp; Lantai 2)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Kolom 1: Status Meja */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-2xs">
                    <p className="text-xs text-[#7A756D] uppercase tracking-wider mb-3 font-bold">
                      1. Status Ketersediaan
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE8E0]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1"></span>
                        <div>
                          <p className="text-sm text-[#2D2A26] font-bold">Meja Putih (Tersedia)</p>
                          <p className="text-xs text-[#7A756D] mt-0.5">Meja kosong dan siap Anda pilih.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F6F1E8] border border-[#E3DCCE]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C29D59] shrink-0 mt-1"></span>
                        <div>
                          <p className="text-sm text-[#61543E] font-bold">Meja Kuning Muda (Terisi)</p>
                          <p className="text-xs text-[#8A795F] mt-0.5">Sedang digunakan pelanggan lain.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 2: Area Lantai */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-2xs">
                    <p className="text-xs text-[#7A756D] uppercase tracking-wider mb-2 font-bold">
                      2. Pilihan Lantai &amp; Suasana
                    </p>
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE8E0] space-y-2 text-xs text-[#4A4742]">
                      <div className="py-0.5 border-b border-[#E9E4DC]">
                        <p className="font-bold text-[#2D2A26]">Lantai 1:</p>
                        <p className="text-[#7A756D] mt-0.5">VIP Room, Indoor AC, Smoking Room, &amp; Outdoor Garden</p>
                      </div>
                      <div className="py-0.5">
                        <p className="font-bold text-[#2D2A26]">Lantai 2:</p>
                        <p className="text-[#7A756D] mt-0.5">VIP Meeting (M1), Co-Working Pods, Balcony, &amp; Rooftop Terrace</p>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 3: Cara Pemilihan */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E1D8] shadow-2xs">
                    <p className="text-xs text-[#7A756D] uppercase tracking-wider mb-2.5 font-bold">
                      3. Cara Memilih Meja
                    </p>
                    <div className="space-y-2 text-xs text-[#54504A]">
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                          1
                        </span>
                        <span>Pilih area suasana yang Anda sukai di formulir atau tab lantai.</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                          2
                        </span>
                        <span>Denah otomatis menyesuaikan ke lantai &amp; menyorot meja di area tersebut.</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                          3
                        </span>
                        <span>Klik nomor meja dan tekan &ldquo;Gunakan Meja Ini&rdquo;.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 sm:px-8 py-4 border-t border-[#EAE7E1] bg-white/80 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFloorPlan(false)}
                className="px-5 py-2 rounded-xl bg-[#EBE7DF] hover:bg-[#DCD7CD] text-[#4A4742] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
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
