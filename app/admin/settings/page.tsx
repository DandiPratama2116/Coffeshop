"use client";

import { useEffect, useState } from "react";

interface CafeSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  openDays: string;
  instagram: string;
  wifi: string;
  minOrder: number;
  currency: string;
  taxPercent: number;
}

const DEFAULT_SETTINGS: CafeSettings = {
  name: "Coffee Shop",
  tagline: "Your Daily Coffee Escape",
  address: "Pekanbaru, Riau, Indonesia",
  phone: "+62 812 3456 7890",
  email: "hello@coffeeshop.com",
  openTime: "08:00",
  closeTime: "22:00",
  openDays: "Senin - Minggu",
  instagram: "@coffeeshop",
  wifi: "CoffeeShopWifi123",
  minOrder: 0,
  currency: "IDR",
  taxPercent: 0,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "hours" | "payment">("general");

  useEffect(() => {
    const s = localStorage.getItem("admin_settings");
    if (s) setSettings(JSON.parse(s));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const TABS = [
    { id: "general" as const, label: "Informasi Cafe", icon: "store" },
    { id: "hours" as const, label: "Jam Operasional", icon: "schedule" },
    { id: "payment" as const, label: "Pembayaran", icon: "payments" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Pengaturan Sistem</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola konfigurasi cafe, jam operasional, dan pembayaran</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white text-[#3B4CB8] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#3B4CB8]">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-base">Informasi Cafe</h3>
                <p className="text-slate-400 text-xs mt-0.5">Profil umum toko yang akan ditampilkan ke pelanggan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ["name", "Nama Cafe", "Coffee Shop"],
                ["tagline", "Tagline", "Your Daily Coffee Escape"],
                ["address", "Alamat", "Pekanbaru, Riau, Indonesia"],
                ["phone", "Nomor Telepon", "+62 812 3456 7890"],
                ["email", "Email", "hello@coffeeshop.com"],
                ["instagram", "Instagram", "@coffeeshop"],
                ["wifi", "Password WiFi", "CoffeeShopWifi123"],
              ] as [keyof CafeSettings, string, string][]).map(([key, label, placeholder]) => (
                <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    {label}
                  </label>
                  <input
                    value={String(settings[key])}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operational Hours */}
        {activeTab === "hours" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#3B4CB8]">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-base">Jam Operasional</h3>
                <p className="text-slate-400 text-xs mt-0.5">Waktu buka dan tutup layanan toko</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Hari Buka</label>
                <input
                  value={settings.openDays}
                  onChange={e => setSettings(s => ({ ...s, openDays: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="Senin - Minggu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Jam Buka</label>
                  <input
                    type="time"
                    value={settings.openTime}
                    onChange={e => setSettings(s => ({ ...s, openTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Jam Tutup</label>
                  <input
                    type="time"
                    value={settings.closeTime}
                    onChange={e => setSettings(s => ({ ...s, closeTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#3B4CB8] shadow-sm">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">{settings.openDays}</p>
                  <p className="text-slate-400 text-xs font-medium">{settings.openTime} – {settings.closeTime} WIB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment & Tax */}
        {activeTab === "payment" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#3B4CB8]">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-base">Pengaturan Pembayaran</h3>
                <p className="text-slate-400 text-xs mt-0.5">Mata uang, persentase pajak, dan batas pemesanan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Mata Uang</label>
                <select
                  value={settings.currency}
                  onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                >
                  <option value="IDR">IDR - Rupiah Indonesia</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Minimum Order (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.minOrder}
                  onChange={e => setSettings(s => ({ ...s, minOrder: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="0"
                />
                <p className="text-slate-400 text-xs mt-1">Isi 0 jika tidak ada batasan minimum pemesanan</p>
              </div>

              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Pajak (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.taxPercent}
                  onChange={e => setSettings(s => ({ ...s, taxPercent: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  placeholder="0"
                />
                <p className="text-slate-400 text-xs mt-1">Isi 0 jika semua harga menu sudah termasuk pajak</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
          >
            <span className="material-symbols-outlined text-base">save</span>
            Simpan Pengaturan
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl animate-fade-in">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Pengaturan Berhasil Disimpan!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}