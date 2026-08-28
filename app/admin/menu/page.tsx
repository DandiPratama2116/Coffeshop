"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/app/coffeshop-order/_data/menuData";

const EMPTY_FORM = { id: "", name: "", description: "", price: 0, category: "Coffee", subCategory: "", image: "" };

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [catFilter, setCatFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_menu_items");
    const initialItems = saved ? JSON.parse(saved) as MenuItem[] : MENU_ITEMS;
    const timer = window.setTimeout(() => setItems(initialItems), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = (updated: MenuItem[]) => {
    setItems(updated);
    localStorage.setItem("admin_menu_items", JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ id: item.id, name: item.name, description: item.description, price: item.price, category: item.category, subCategory: item.subCategory || "", image: item.image || "" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      save(items.map(i => i.id === editing.id ? { ...form } : i));
    } else {
      const newId = `custom_${Date.now()}`;
      save([...items, { ...form, id: newId }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    save(items.filter(i => i.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = items.filter(i => {
    const matchCat = catFilter === "all" || i.category === catFilter;
    return matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Menu Produk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola daftar produk, harga, dan gambar menu</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#3B4CB8] shadow-sm transition-all"
        >
          <option value="all">Semua Kategori</option>
          {MENU_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>

        <button
          id="add-menu-btn"
          onClick={openAdd}
          className="w-full sm:w-auto bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-indigo-100"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Menu
        </button>
      </div>

      {/* Badges / Stats */}
      <div className="flex gap-2 flex-wrap">
        <div className="bg-white border border-slate-100 rounded-full px-3.5 py-1.5 text-xs text-slate-500 shadow-sm">
          Menampilkan <span className="text-[#3B4CB8] font-bold">{filtered.length}</span> item
        </div>
        <div className="bg-white border border-slate-100 rounded-full px-3.5 py-1.5 text-xs text-slate-500 shadow-sm">
          Total menu <span className="text-slate-800 font-bold">{items.length}</span>
        </div>
      </div>

      {/* Grid Menu dengan Image & Border Action Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(item => (
          <div key={item.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Image Preview Container */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/50">
                    <span className="material-symbols-outlined text-slate-300 text-4xl">restaurant</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-[#3B4CB8] text-[11px] px-3 py-1 rounded-full font-bold shadow-sm">{item.category}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-slate-800 font-bold text-base leading-snug">{item.name}</h3>
                  <p className="text-[#3B4CB8] font-bold text-sm whitespace-nowrap">Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Actions Inside Border Footer */}
            <div className="p-4 pt-0">
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-[#3B4CB8] text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 text-xs font-semibold transition-colors flex items-center justify-center"
                  title="Hapus menu"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <span className="material-symbols-outlined text-slate-300 text-5xl">restaurant_menu</span>
            <p className="text-slate-400 mt-2 text-xs font-medium">Tidak ada menu pada kategori ini</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-bold text-base">{editing ? "Edit Menu" : "Tambah Menu Baru"}</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Nama Menu</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Nama menu..." />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Deskripsi</label>
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all resize-none h-20"
                  placeholder="Deskripsi menu..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Harga (Rp)</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                    placeholder="25000" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Kategori</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all">
                    {MENU_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Sub Kategori</label>
                <input value={form.subCategory} onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Basic Coffee, Sweet Edition, dll..." />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Path / URL Gambar</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="/assets/Menu/nama-gambar.jpg" />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 bg-[#3B4CB8] text-white font-bold py-2.5 rounded-2xl text-xs hover:bg-[#3241A3] transition-all shadow-md shadow-indigo-100">
                  {editing ? "Simpan Perubahan" : "Tambah Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-rose-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
            </div>
            <h3 className="text-slate-800 font-bold text-base mb-1">Hapus Menu?</h3>
            <p className="text-slate-400 text-xs mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-rose-500 text-white font-bold py-2.5 rounded-2xl text-xs hover:bg-rose-600 transition-all shadow-md shadow-rose-100">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}