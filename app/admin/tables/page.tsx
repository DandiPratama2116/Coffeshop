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

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [form, setForm] = useState({ number: 0, capacity: 4, locationId: 1, seatingArea: "Indoor" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/admin/tables`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Gagal memuat meja")))
      .then(result => {
        if (cancelled) return;
        const base = window.location.origin;
        const loadedTables: Table[] = (result.data || []).map((table: { id: number; table_number: number; location_id: number; seating_area?: string; status: "available" | "occupied"; location?: { nama_tempat?: string } }) => ({
          id: String(table.id), number: table.table_number, capacity: 4, locationId: table.location_id, locationName: table.location?.nama_tempat || "Coffee Shop", seatingArea: table.seating_area || "Indoor", status: table.status, qrUrl: `${base}/coffeshop-order/${table.table_number}`,
        }));
        setTables(loadedTables);
      })
      .catch(error => { if (!cancelled) console.error(error); });
    return () => { cancelled = true; };
  }, [apiBase]);

  const toggleStatus = (id: string) => {
    const table = tables.find(item => item.id === id);
    if (!table) return;
    const nextStatus = table.status === "available" ? "occupied" : "available";
    fetch(`${apiBase}/admin/tables/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table_number: table.number, location_id: table.locationId, seating_area: table.seatingArea, status: nextStatus }) })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Gagal mengubah status meja")))
      .then(() => setTables(current => current.map(item => item.id === id ? { ...item, status: nextStatus } : item)))
      .catch(error => console.error(error));
    if (selectedTable?.id === id) {
      setSelectedTable(prev => prev ? { ...prev, status: prev.status === "available" ? "occupied" : "available" } : null);
    }
  };

  const deleteTable = (id: string) => {
    fetch(`${apiBase}/admin/tables/${id}`, { method: "DELETE" })
      .then(response => response.ok ? setTables(current => current.filter(item => item.id !== id)) : Promise.reject(new Error("Gagal menghapus meja")))
      .catch(error => console.error(error));
    if (selectedTable?.id === id) setSelectedTable(null);
  };

  const addTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${apiBase}/admin/tables`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table_number: form.number, location_id: form.locationId, seating_area: form.seatingArea }) });
    if (!response.ok) return;
    const result = await response.json();
    const newTable = result.data;
    setTables(current => [...current, { id: String(newTable.id), number: newTable.table_number, capacity: form.capacity, locationId: form.locationId, locationName: "Coffee Shop", seatingArea: form.seatingArea, status: newTable.status, qrUrl: `${window.location.origin}/coffeshop-order/${newTable.table_number}` }]);
    setShowModal(false);
    setForm({ number: 0, capacity: 4, locationId: 1, seatingArea: "Indoor" });
  };

  const showQR = async (table: Table) => {
    setSelectedTable(table);
    const url = await QRCode.toDataURL(table.qrUrl, {
      width: 300,
      margin: 2,
      color: { dark: "#1e293b", light: "#ffffff" },
    });
    setQrDataUrl(url);
  };

  const downloadQR = () => {
    if (!qrDataUrl || !selectedTable) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-meja-${selectedTable.number}.png`;
    a.click();
  };

  const available = tables.filter(t => t.status === "available").length;
  const occupied = tables.filter(t => t.status === "occupied").length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Meja</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola tata letak meja, ketersediaan, dan QR Code</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Meja
        </button>
      </div>

      {/* Stats Widget */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-slate-800">{tables.length}</p>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Total Meja</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600">{available}</p>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Tersedia</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-500">{occupied}</p>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Terisi</p>
        </div>
      </div>

      {/* Main Grid & QR Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tables.sort((a, b) => a.number - b.number).map(table => {
            const isSelected = selectedTable?.id === table.id;
            const isOccupied = table.status === "occupied";
            return (
              <div
                key={table.id}
                onClick={() => showQR(table)}
                className={`bg-white border rounded-3xl p-5 text-center cursor-pointer hover:shadow-md transition-all duration-200 relative overflow-hidden ${isOccupied
                  ? "border-amber-200 bg-amber-50/20"
                  : "border-slate-100 hover:border-indigo-100"
                  } ${isSelected ? "ring-2 ring-[#3B4CB8] border-transparent" : ""}`}
              >
                <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-colors ${isOccupied ? "bg-amber-100 text-amber-600" : "bg-indigo-50 text-[#3B4CB8]"
                  }`}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    table_restaurant
                  </span>
                </div>
                <p className="text-slate-800 font-bold text-lg">#{table.number}</p>
                <p className="text-slate-400 text-xs font-medium">{table.capacity} Kursi</p>
                <p className="text-slate-500 text-[10px] mt-1 truncate" title={table.locationName}>{table.locationName}</p>
                <p className="text-[#3B4CB8] text-[11px] font-semibold mt-1">{table.seatingArea}</p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                  <div className={`w-2 h-2 rounded-full ${isOccupied ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span className={`text-[11px] font-bold ${isOccupied ? "text-amber-600" : "text-emerald-600"}`}>
                    {isOccupied ? "Terisi" : "Tersedia"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* QR Detail Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm h-fit sticky top-6 overflow-hidden">
          {!selectedTable ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">qr_code_2</span>
              </div>
              <p className="text-slate-700 font-bold text-sm">Pilih Meja</p>
              <p className="text-slate-400 text-xs mt-1">Klik salah satu meja di sebelah kiri untuk melihat QR Code & opsi kontrol.</p>
            </div>
          ) : (
            <div>
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 font-bold text-base">Meja #{selectedTable.number}</h3>
                  <p className="text-slate-400 text-xs">Kapasitas: {selectedTable.capacity} Orang</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${selectedTable.status === "occupied" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}>
                  {selectedTable.status === "occupied" ? "Terisi" : "Tersedia"}
                </span>
              </div>

              <div className="p-6 space-y-4">
                {qrDataUrl && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-center shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt={`QR Meja ${selectedTable.number}`} className="w-44 h-44 rounded-lg" />
                  </div>
                )}

                <p className="text-slate-400 text-[11px] text-center break-all font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedTable.qrUrl}
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={downloadQR}
                    className="w-full bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-bold py-2.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    Download QR Code
                  </button>

                  <button
                    onClick={() => toggleStatus(selectedTable.id)}
                    className={`w-full border font-semibold py-2.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 ${selectedTable.status === "occupied"
                      ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      : "border-amber-200 text-amber-700 hover:bg-amber-50"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {selectedTable.status === "occupied" ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    {selectedTable.status === "occupied" ? "Tandai Tersedia" : "Tandai Terisi"}
                  </button>

                  <button
                    onClick={() => deleteTable(selectedTable.id)}
                    className="w-full border border-rose-200 text-rose-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Hapus Meja
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-bold text-base">Tambah Meja Baru</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={addTable} className="p-6 space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Nomor Meja</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.number || ""}
                  onChange={e => setForm(f => ({ ...f, number: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Contoh: 11"
                />
              </div>

              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Kapasitas (Orang)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="4"
                />
              </div>

              <div>
                <label htmlFor="table-location" className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Lokasi Meja</label>
                <select
                  id="table-location"
                  value={form.locationId}
                  onChange={e => setForm(f => ({ ...f, locationId: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                >
                  <option value={1}>Coffee Shop</option>
                </select>
              </div>

              <div>
                <label htmlFor="seating-area" className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Lokasi Duduk</label>
                <select
                  id="seating-area"
                  value={form.seatingArea}
                  onChange={e => setForm(f => ({ ...f, seatingArea: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                >
                  {['Indoor', 'Outdoor', 'Room VIP', 'Room Smoking'].map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#3B4CB8] text-white font-bold py-2.5 rounded-2xl text-xs hover:bg-[#3241A3] transition-all shadow-md shadow-indigo-100"
                >
                  Tambah Meja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}