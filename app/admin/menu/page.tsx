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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[560px] rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">{editing ? "Edit Menu" : "Tambah Menu"}</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Body - Grid 2 kolom efisien tanpa scroll */}
            <form onSubmit={handleSubmit} id="menu-form" className="px-6 py-2 grid grid-cols-2 gap-3.5">
              {/* Nama Menu */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_name">
                  Nama Menu *
                </label>
                <input
                  id="menu_name"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Nama menu..."
                />
              </div>

              {/* Harga */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_price">
                  Harga (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">Rp</span>
                  <input
                    id="menu_price"
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="25000"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_category">
                  Kategori *
                </label>
                <select
                  id="menu_category"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  {MENU_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              {/* Sub Kategori */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_sub">
                  Sub Kategori
                </label>
                <input
                  id="menu_sub"
                  value={form.subCategory}
                  onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Basic Coffee, dll..."
                />
              </div>

              {/* Deskripsi */}
              <div className="col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_desc">
                  Deskripsi *
                </label>
                <textarea
                  id="menu_desc"
                  required
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none h-16"
                  placeholder="Deskripsi menu..."
                  rows={2}
                />
              </div>

              {/* Gambar */}
              <div className="col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_image">
                  Path / URL Gambar
                </label>
                <input
                  id="menu_image"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="/assets/Menu/nama-gambar.jpg"
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
                form="menu-form"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-slate-800 font-bold text-lg">Hapus Menu?</h2>
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
                  <p className="text-sm text-slate-500 leading-relaxed">Tindakan ini tidak dapat dibatalkan.</p>
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