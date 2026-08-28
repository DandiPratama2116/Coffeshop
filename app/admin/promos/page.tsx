"use client";

import { useEffect, useState } from "react";

interface Promo {
  id: string;
  name: string;
  description: string;
  discount: number;
  type: "percent" | "fixed";
  code: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const EMPTY_FORM: Omit<Promo, "id"> = { name: "", description: "", discount: 0, type: "percent", code: "", startDate: "", endDate: "", active: true };

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState<Omit<Promo, "id">>({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_promos");
    setPromos(saved ? JSON.parse(saved) : []);
  }, []);

  const save = (updated: Promo[]) => {
    setPromos(updated);
    localStorage.setItem("admin_promos", JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (promo: Promo) => {
    setEditing(promo);
    setForm({ name: promo.name, description: promo.description, discount: promo.discount, type: promo.type, code: promo.code, startDate: promo.startDate, endDate: promo.endDate, active: promo.active });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      save(promos.map(p => p.id === editing.id ? { ...form, id: editing.id } : p));
    } else {
      save([...promos, { ...form, id: `promo_${Date.now()}` }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    save(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Promo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola voucher diskon dan penawaran khusus</p>
        </div>
      </div>

      {/* Controls & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <div className="bg-white border border-slate-100 rounded-full px-3.5 py-1.5 text-xs text-slate-500 shadow-sm">
            <span className="text-emerald-600 font-bold">{promos.filter(p => p.active).length}</span> Aktif
          </div>
          <div className="bg-white border border-slate-100 rounded-full px-3.5 py-1.5 text-xs text-slate-500 shadow-sm">
            <span className="text-slate-600 font-bold">{promos.filter(p => !p.active).length}</span> Nonaktif
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Promo
        </button>
      </div>

      {/* Promos List */}
      <div className="space-y-3">
        {promos.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">local_offer</span>
            </div>
            <p className="text-slate-800 font-bold text-base">Belum Ada Promo</p>
            <p className="text-slate-400 text-xs mt-1">Klik tombol di atas untuk menambahkan promo baru.</p>
          </div>
        )}
        
        {promos.map(promo => {
          const expired = isExpired(promo.endDate);
          return (
            <div 
              key={promo.id} 
              className={`bg-white border rounded-3xl p-5 shadow-sm transition-all ${
                promo.active && !expired ? "border-slate-100 hover:shadow-md" : "border-slate-200/60 bg-slate-50/50 opacity-70"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-slate-800 font-bold text-base">{promo.name}</h3>
                    {expired && <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-semibold">Kadaluarsa</span>}
                    {promo.active && !expired && <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-semibold">Aktif</span>}
                    {!promo.active && <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-semibold">Nonaktif</span>}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{promo.description || "Tidak ada deskripsi"}</p>
                  
                  <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-slate-400 text-[11px] uppercase font-semibold">Diskon</p>
                      <p className="text-[#3B4CB8] font-bold text-sm mt-0.5">
                        {promo.type === "percent" ? `${promo.discount}%` : `Rp ${promo.discount.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] uppercase font-semibold">Kode Promo</p>
                      <p className="text-slate-800 font-bold font-mono tracking-wider text-sm mt-0.5">{promo.code}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] uppercase font-semibold">Periode</p>
                      <p className="text-slate-600 text-xs font-medium mt-0.5">{promo.startDate} — {promo.endDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(promo.id)}
                    className={`relative w-11 h-6 rounded-full transition-all ${promo.active ? "bg-[#3B4CB8]" : "bg-slate-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${promo.active ? "left-6" : "left-1"}`} />
                  </button>
                  <button onClick={() => openEdit(promo)} title="Edit promo" className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-indigo-50 hover:text-[#3B4CB8] text-slate-500 transition-colors">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button onClick={() => setDeleteConfirm(promo.id)} title="Hapus promo" className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 text-slate-500 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-slate-800 font-bold text-base">{editing ? "Edit Promo" : "Tambah Promo Baru"}</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Nama Promo</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Contoh: Happy Hour Cafe" />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all resize-none h-16"
                  placeholder="Deskripsi ringkas mengenai penawaran..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Jenis Diskon</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "percent" | "fixed" }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all">
                    <option value="percent">Persentase (%)</option>
                    <option value="fixed">Nominal (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Nilai Diskon</label>
                  <input required type="number" min="0" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                    placeholder={form.type === "percent" ? "15" : "10000"} />
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Kode Promo</label>
                <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm font-mono focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all uppercase"
                  placeholder="HAPPY15" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Mulai</label>
                  <input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Berakhir</label>
                  <input required type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all" />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`relative w-11 h-6 rounded-full transition-all ${form.active ? "bg-[#3B4CB8]" : "bg-slate-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-6" : "left-1"}`} />
                </button>
                <span className="text-slate-700 text-xs font-semibold">Status Promo: {form.active ? "Aktif" : "Nonaktif"}</span>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#3B4CB8] text-white font-bold py-2.5 rounded-2xl text-xs hover:bg-[#3241A3] transition-all shadow-md shadow-indigo-100">{editing ? "Simpan Perubahan" : "Tambah Promo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-rose-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
            </div>
            <h3 className="text-slate-800 font-bold text-base mb-1">Hapus Promo?</h3>
            <p className="text-slate-400 text-xs mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all">Batal</button>
              <button onClick={() => { save(promos.filter(p => p.id !== deleteConfirm)); setDeleteConfirm(null); }} className="flex-1 bg-rose-500 text-white font-bold py-2.5 rounded-2xl text-xs hover:bg-rose-600 transition-all shadow-md shadow-rose-100">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}