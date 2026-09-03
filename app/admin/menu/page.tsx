"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/app/coffeshop-order/_data/menuData";

const EMPTY_FORM = { id: "", name: "", description: "", price: 0, category: "Coffee", subCategory: "Basic Coffee", image: "" };

const CATEGORY_SUB_MAP: Record<string, string[]> = {
  Coffee: ["Basic Coffee", "Sweet Edition", "Taste of Coffee Shop", "Barista Choice"],
  "Non-Coffee": ["Non-Coffee", "Matcha Series"],
  "Mocktails & Juice": ["Mocktails", "Smoothies & Juice"],
  Food: ["Salad & Burger", "Main Course", "Noodle Edition", "Neapolitan Pizza", "Sushi Club"],
  Snacks: ["Easy Bites", "Dimsum Series"],
  "Pastry & Dessert": ["Cookies Series", "Croissant", "Donut", "Cinnamon Roll", "Pastry"],
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [catFilter, setCatFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_menu_items");
    const initialItems = saved ? (JSON.parse(saved) as MenuItem[]) : MENU_ITEMS;
    const timer = window.setTimeout(() => setItems(initialItems), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = (updated: MenuItem[]) => {
    setItems(updated);
    localStorage.setItem("admin_menu_items", JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      category: "Coffee",
      subCategory: CATEGORY_SUB_MAP["Coffee"][0] || "Basic Coffee",
    });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    const defaultSub = (CATEGORY_SUB_MAP[item.category] || [])[0] || "";
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory || defaultSub,
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      save(items.map((i) => (i.id === editing.id ? { ...form } : i)));
    } else {
      const newId = `custom_${Date.now()}`;
      save([...items, { ...form, id: newId }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    save(items.filter((i) => i.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = items.filter((i) => {
    const matchCat = catFilter === "all" || i.category === catFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.subCategory && i.subCategory.toLowerCase().includes(q)) ||
      i.category.toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-7 text-slate-900">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Menu Produk</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar hidangan kopi, minuman, makanan, dan harga</p>
        </div>

        <button
          id="add-menu-btn"
          onClick={openAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Tambah Menu
        </button>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Left: Category Dropdown / Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full sm:w-56">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-800 transition-colors cursor-pointer"
            >
              <option value="all">Semua Kategori ({items.length})</option>
              {MENU_CATEGORIES.map((c) => {
                const count = items.filter((i) => i.category === c.id).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="hidden sm:flex items-center text-xs font-medium text-slate-500 pl-1">
            Menampilkan <span className="font-bold text-slate-900 mx-1">{filtered.length}</span> menu
          </div>
        </div>

        {/* Right: Search Input Box */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama hidangan, deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Menu Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <span className="material-symbols-outlined text-slate-300 text-5xl block mb-2">restaurant_menu</span>
          <p className="text-base font-bold text-slate-800">Tidak ada menu yang cocok</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm
              ? `Tidak ada hasil pencarian untuk "${searchTerm}" pada kategori ini.`
              : "Belum ada produk di kategori ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <span className="material-symbols-outlined text-slate-300 text-4xl">restaurant</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-md font-semibold shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-slate-900 font-bold text-sm leading-snug">{item.name}</h3>
                    <p className="text-slate-900 font-extrabold text-sm whitespace-nowrap font-inter">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0">
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-500">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer border border-slate-200/60"
                    title="Hapus menu"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah / Edit Menu */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[560px] rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {editing ? "Edit Menu Produk" : "Tambah Menu Produk"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} id="menu-form" className="p-6 grid grid-cols-2 gap-3.5">
              {/* Nama Menu */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_name">
                  Nama Menu *
                </label>
                <input
                  id="menu_name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all font-medium"
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
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all font-medium"
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
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const availableSubs = CATEGORY_SUB_MAP[newCat] || [];
                    setForm((f) => ({
                      ...f,
                      category: newCat,
                      subCategory: availableSubs[0] || "",
                    }));
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-slate-800 transition-all font-medium cursor-pointer"
                >
                  {MENU_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Kategori */}
              <div className="col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block" htmlFor="menu_sub">
                  Sub Kategori *
                </label>
                <select
                  id="menu_sub"
                  value={form.subCategory}
                  onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-slate-800 transition-all font-medium cursor-pointer"
                >
                  {(CATEGORY_SUB_MAP[form.category] || []).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  {form.subCategory && !(CATEGORY_SUB_MAP[form.category] || []).includes(form.subCategory) && (
                    <option value={form.subCategory}>{form.subCategory}</option>
                  )}
                </select>
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
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all resize-none h-16 font-medium"
                  placeholder="Deskripsi bahan dan rasa menu..."
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
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all font-medium"
                  placeholder="/assets/Menu/BlackCoffe.jpeg"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                form="menu-form"
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Simpan Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-900 font-bold text-base">Hapus Menu?</h2>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus hidangan ini dari daftar menu produk? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}