"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Promo {
  id: number;
  name: string;
  description: string;
  discount: number;
  type: "percent" | "fixed";
  code: string;
  start_date: string;
  end_date: string;
  product_id?: number | null;
  product?: {
    id: number;
    nama_menu: string;
  };
  active: boolean;
}

interface Product {
  id: number;
  nama_menu: string;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  discount: 0,
  type: "percent" as "percent" | "fixed",
  code: "",
  start_date: "",
  end_date: "",
  product_id: null as number | null,
  active: true,
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchPromos = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${baseUrl}/admin/promos`);
      const json = await res.json();
      if (json.success) {
        setPromos(json.data);
      }
    } catch (err) {
      toast.error("Gagal mengambil data promo");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${baseUrl}/admin/products`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPromos();
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (promo: Promo) => {
    setEditing(promo);
    setForm({
      name: promo.name,
      description: promo.description,
      discount: promo.discount,
      type: promo.type,
      code: promo.code,
      start_date: promo.start_date,
      end_date: promo.end_date,
      product_id: promo.product_id || null,
      active: promo.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editing;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const url = isEdit
      ? `${baseUrl}/admin/promos/${editing.id}`
      : `${baseUrl}/admin/promos`;
    const method = isEdit ? "PUT" : "POST";

    const loadingToast = toast.loading("Menyimpan promo...");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Promo berhasil disimpan", { id: loadingToast });
        setShowModal(false);
        fetchPromos();
      } else {
        toast.error(json.message || "Gagal menyimpan", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan", { id: loadingToast });
    }
  };

  const toggleActive = async (promo: Promo) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${baseUrl}/admin/promos/${promo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...promo, active: !promo.active }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Promo ${!promo.active ? "diaktifkan" : "dinonaktifkan"}`);
        fetchPromos();
      }
    } catch (err) {
      toast.error("Gagal mengubah status");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${baseUrl}/admin/promos/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Promo dihapus");
        setDeleteConfirm(null);
        fetchPromos();
      }
    } catch (err) {
      toast.error("Gagal menghapus promo");
    }
  };

  const isExpired = (endDate: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
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
          className="bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-100 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Promo
        </button>
      </div>

      {/* Promos List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm animate-pulse">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-3"></div>
            <div className="h-4 bg-slate-100 rounded w-1/4 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-50 rounded w-1/3 mx-auto"></div>
          </div>
        ) : promos.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">local_offer</span>
            </div>
            <p className="text-slate-800 font-bold text-base">Belum Ada Promo</p>
            <p className="text-slate-400 text-xs mt-1">Klik tombol di atas untuk menambahkan promo baru.</p>
          </div>
        ) : (
          promos.map(promo => {
            const expired = isExpired(promo.end_date);
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
                    
                    {promo.product && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
                        <span className="material-symbols-outlined text-[14px]">restaurant_menu</span>
                        <span className="text-[11px] font-bold">Menu Spesifik: {promo.product.nama_menu}</span>
                      </div>
                    )}

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
                        <p className="text-slate-600 text-xs font-medium mt-0.5">{promo.start_date || "-"} — {promo.end_date || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(promo)}
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
          })
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[560px] rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">{editing ? "Edit Promo" : "Tambah Promo"}</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Body - Grid 2 kolom efisien tanpa scroll */}
            <form id="promo-form" onSubmit={handleSubmit} className="px-6 py-2 grid grid-cols-2 gap-3.5">
              {/* Nama Promo */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_name">
                  Nama Promo *
                </label>
                <input
                  id="promo_name"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Misal: Promo Akhir Tahun"
                />
              </div>

              {/* Menu yang Dipromo */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_menu">
                  Menu Promo *
                </label>
                <select
                  id="promo_menu"
                  required
                  value={form.product_id || ""}
                  onChange={e => setForm(f => ({ ...f, product_id: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="">Pilih menu...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nama_menu}</option>
                  ))}
                </select>
                {products.length === 0 && <p className="text-[10px] text-amber-500 mt-1">Menu belum termuat</p>}
              </div>

              {/* Besar Diskon */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_discount">
                  Besar Diskon (%) *
                </label>
                <div className="relative">
                  <input
                    id="promo_discount"
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={form.discount || ""}
                    onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value), type: "percent" }))}
                    className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg pl-3.5 pr-8 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>

              {/* Kode Promo */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_code">
                  Kode Promo <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <input
                  id="promo_code"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono uppercase"
                  placeholder="Code"
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_start">
                  Tanggal Mulai *
                </label>
                <input
                  id="promo_start"
                  required
                  type="date"
                  value={form.start_date}
                  onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Tanggal Berakhir */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_end">
                  Tanggal Berakhir *
                </label>
                <input
                  id="promo_end"
                  required
                  type="date"
                  min={form.start_date}
                  value={form.end_date}
                  onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div className="col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="promo_desc">
                  Deskripsi Promo
                </label>
                <textarea
                  id="promo_desc"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none h-14"
                  placeholder="Masukkan keterangan promo..."
                  rows={2}
                />
              </div>

              {/* Status Aktif */}
              <div className="col-span-2 flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Status Promo</p>
                  <p className="text-[11px] text-slate-400">{form.active ? 'Promo aktif dan dapat digunakan pelanggan' : 'Promo nonaktif'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer ${form.active ? "bg-blue-600" : "bg-slate-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.active ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="promo-form"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-slate-800 font-bold text-lg">Hapus Promo?</h2>
              <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-full hover:bg-slate-100">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Konfirmasi Hapus</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Tindakan ini tidak dapat dibatalkan. Promo tidak akan bisa digunakan lagi.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button onClick={() => setDeleteConfirm(null)}
                className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}