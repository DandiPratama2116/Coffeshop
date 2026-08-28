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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-bold text-base">
                {editing ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editing && (
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    ID Kategori
                  </label>
                  <input
                    required
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                    placeholder="Misal: Coffee"
                  />
                </div>
              )}
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Label
                </label>
                <input
                  required
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Nama kategori lengkap"
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Short Label
                </label>
                <input
                  value={form.shortLabel}
                  onChange={(e) => setForm((f) => ({ ...f, shortLabel: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Nama pendek untuk tab"
                />
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
                  {editing ? "Simpan" : "Tambah"}
                </button>
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
              <span
                className="material-symbols-outlined text-rose-500 text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                delete
              </span>
            </div>
            <h3 className="text-slate-800 font-bold text-base mb-1">Hapus Kategori?</h3>
            <p className="text-slate-400 text-xs mb-6">
              Item menu dalam kategori ini tidak akan ikut terhapus dari sistem.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  save(categories.filter((c) => c.id !== deleteConfirm));
                  setDeleteConfirm(null);
                }}
                className="flex-1 bg-rose-500 text-white font-bold py-2.5 rounded-2xl text-xs hover:bg-rose-600 transition-all shadow-md shadow-rose-100"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}