"use client";

import { useEffect, useState } from "react";
import { MENU_ITEMS } from "@/app/coffeshop-order/_data/menuData";

interface Category {
  id: string;
  label: string;
  shortLabel: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "Coffee", label: "Coffee", shortLabel: "Coffee" },
  { id: "Non-Coffee", label: "Non-Coffee", shortLabel: "Non-Coffee" },
  { id: "Mocktails & Juice", label: "Mocktails & Juice", shortLabel: "Mocktails" },
  { id: "Food", label: "Food", shortLabel: "Food" },
  { id: "Snacks", label: "Snacks", shortLabel: "Snacks" },
  { id: "Pastry & Dessert", label: "Pastry & Dessert", shortLabel: "Pastry" },
];

const ICONS: Record<string, string> = {
  Coffee: "coffee",
  "Non-Coffee": "local_cafe",
  "Mocktails & Juice": "local_bar",
  Food: "restaurant",
  Snacks: "cookie",
  "Pastry & Dessert": "cake",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ id: "", label: "", shortLabel: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_categories");
    setCategories(saved ? JSON.parse(saved) : DEFAULT_CATEGORIES);
  }, []);

  const save = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem("admin_categories", JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", label: "", shortLabel: "" });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ id: cat.id, label: cat.label, shortLabel: cat.shortLabel });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      save(categories.map((c) => (c.id === editing.id ? { ...form } : c)));
    } else {
      save([
        ...categories,
        { id: form.id || form.label, label: form.label, shortLabel: form.shortLabel || form.label },
      ]);
    }
    setShowModal(false);
  };

  const menuItems =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("admin_menu_items") || "null") || MENU_ITEMS
      : MENU_ITEMS;

  const countByCategory = (catId: string) =>
    menuItems.filter((i: { category: string }) => i.category === catId).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kategori Produk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola daftar kategori dan jumlah menu</p>
        </div>
        <button
          id="add-category-btn"
          onClick={openAdd}
          className="bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-200"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Kategori
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const count = countByCategory(cat.id);
          const icon = ICONS[cat.id] || "label";
          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F3FF] flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-[#3B4CB8]"
                      style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}
                    >
                      {icon}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(cat)}
                      className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:text-[#3B4CB8] text-slate-500 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cat.id)}
                      className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 text-slate-500 transition-colors"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-slate-800 font-bold text-base">{cat.label}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Short label: {cat.shortLabel}</p>
              </div>

              {/* Progress Bar & Count */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3B4CB8] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[#3B4CB8] text-xs font-bold bg-[#F0F3FF] px-2.5 py-1 rounded-full">
                  {count} item
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-[480px] border border-slate-200 shadow-xl overflow-hidden animate-scale-up">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">{editing ? "Edit Kategori" : "Tambah Kategori"}</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} id="category-form" className="px-6 py-2 space-y-4">
              {!editing && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="cat_id">
                    ID Kategori *
                  </label>
                  <input
                    id="cat_id"
                    required
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Misal: Coffee"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="cat_label">
                  Label Kategori *
                </label>
                <input
                  id="cat_label"
                  required
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Nama kategori lengkap"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="cat_short">
                  Short Label
                </label>
                <input
                  id="cat_short"
                  value={form.shortLabel}
                  onChange={(e) => setForm((f) => ({ ...f, shortLabel: e.target.value }))}
                  className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Nama pendek untuk tab"
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
                form="category-form"
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
              <h2 className="text-slate-800 font-bold text-lg">Hapus Kategori?</h2>
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
                  <p className="text-sm text-slate-500 leading-relaxed">Item menu dalam kategori ini tidak akan ikut terhapus dari sistem.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button onClick={() => setDeleteConfirm(null)}
                className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors">
                Batal
              </button>
              <button onClick={() => { save(categories.filter((c) => c.id !== deleteConfirm)); setDeleteConfirm(null); }}
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