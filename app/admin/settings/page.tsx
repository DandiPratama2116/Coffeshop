"use client";

import { useEffect, useState } from "react";

interface DailySchedule {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface CafeSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  openDays: string;
  operationalHours: DailySchedule[];
  isOpen: boolean;
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
  operationalHours: [
    { day: "Senin", open: "09:00", close: "22:00", isClosed: false },
    { day: "Selasa", open: "09:00", close: "22:00", isClosed: false },
    { day: "Rabu", open: "09:00", close: "22:00", isClosed: false },
    { day: "Kamis", open: "09:00", close: "22:00", isClosed: false },
    { day: "Jumat", open: "09:00", close: "22:00", isClosed: false },
    { day: "Sabtu", open: "09:00", close: "22:00", isClosed: false },
    { day: "Minggu", open: "09:00", close: "22:00", isClosed: false },
  ],
  isOpen: true,
  instagram: "@coffeeshop",
  wifi: "CoffeeShopWifi123",
  minOrder: 0,
  currency: "IDR",
  taxPercent: 0,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "hours" | "payment">("general");
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    // Ambil dari backend API
    fetch(`${apiBase}/admin/settings`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error("Gagal mengambil pengaturan")))
      .then(result => {
        if (result.success && result.data) {
          const d = result.data;
          const mapped: CafeSettings = {
            name: d.name || DEFAULT_SETTINGS.name,
            tagline: d.tagline || DEFAULT_SETTINGS.tagline,
            address: d.address || DEFAULT_SETTINGS.address,
            phone: d.phone || DEFAULT_SETTINGS.phone,
            email: d.email || DEFAULT_SETTINGS.email,
            openTime: d.open_time || DEFAULT_SETTINGS.openTime,
            closeTime: d.close_time || DEFAULT_SETTINGS.closeTime,
            openDays: d.open_days || DEFAULT_SETTINGS.openDays,
            operationalHours: d.operational_hours ? (typeof d.operational_hours === 'string' ? JSON.parse(d.operational_hours) : d.operational_hours) : DEFAULT_SETTINGS.operationalHours,
            isOpen: d.is_open !== undefined ? d.is_open : true,
            instagram: d.instagram || DEFAULT_SETTINGS.instagram,
            wifi: d.wifi || DEFAULT_SETTINGS.wifi,
            minOrder: d.min_order || 0,
            currency: d.currency || "IDR",
            taxPercent: d.tax_percent || 0,
          };
          setSettings(mapped);
          localStorage.setItem("admin_settings", JSON.stringify(mapped));
        }
      })
      .catch(() => {
        // Fallback localStorage
        const s = localStorage.getItem("admin_settings");
        if (s) setSettings(JSON.parse(s));
      });
  }, [apiBase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simpan ke Backend Database
      await fetch(`${apiBase}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settings.name,
          tagline: settings.tagline,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          open_time: settings.openTime,
          close_time: settings.closeTime,
          open_days: settings.openDays,
          operational_hours: JSON.stringify(settings.operationalHours),
          is_open: settings.isOpen,
          instagram: settings.instagram,
          wifi: settings.wifi,
          min_order: Number(settings.minOrder),
          currency: settings.currency,
          tax_percent: Number(settings.taxPercent),
        }),
      });

      // Simpan juga ke localStorage
      localStorage.setItem("admin_settings", JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      localStorage.setItem("admin_settings", JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: "general" as const, label: "Informasi Cafe", icon: "storefront" },
    { id: "hours" as const, label: "Jam Operasional", icon: "schedule" },
    { id: "payment" as const, label: "Pembayaran & Pajak", icon: "payments" },
  ];

  // Hitung status buka/tutup toko saat ini (Sinkron 100% dengan Dashboard & Jadwal Operasional)
  const daysMap: { [key: number]: string } = {
    0: "Minggu",
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
  };
  const todayName = daysMap[new Date().getDay()];
  const todaySchedule = settings.operationalHours?.find((h) => h.day === todayName);

  const isStoreCurrentlyOpen = (() => {
    if (!settings.isOpen) return false;
    try {
      if (todaySchedule && todaySchedule.isClosed) return false;

      const openTimeStr = todaySchedule ? todaySchedule.open : settings.openTime;
      const closeTimeStr = todaySchedule ? todaySchedule.close : settings.closeTime;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [openH, openM] = (openTimeStr || "08:00").split(":").map(Number);
      const [closeH, closeM] = (closeTimeStr || "22:00").split(":").map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      if (closeMinutes > openMinutes) {
        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
      } else {
        // Toko buka melewati tengah malam
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
      }
    } catch {
      return settings.isOpen;
    }
  })();

  const handleApplyToAllDays = (sourceOpen: string, sourceClose: string) => {
    const updated = settings.operationalHours.map(d => ({
      ...d,
      open: sourceOpen,
      close: sourceClose,
      isClosed: false,
    }));
    setSettings(s => ({ ...s, operationalHours: updated }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Konsisten dengan Dashboard & Tables */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Sistem</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isStoreCurrentlyOpen
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}>
                <span className={`w-2 h-2 rounded-full ${isStoreCurrentlyOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                {isStoreCurrentlyOpen ? "Sedang Buka" : "Sedang Tutup"}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Konfigurasi identitas coffee shop, jadwal operasional, dan parameter transaksi
            </p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl animate-fade-in">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Tersimpan
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-[#3B4CB8] to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all flex items-center gap-2 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">save</span>
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>

      {/* 2. Sleek Segmented Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60 gap-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-[#3B4CB8] shadow-xs"
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

        <p className="text-xs text-slate-400 font-medium hidden sm:block">
          Terakhir disinkronkan ke database server
        </p>
      </div>

      {/* 3. Form Konten Sesuai Tab */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: INFORMASI CAFE */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profil Cafe */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold text-base">Profil & Identitas Usaha</h3>
                  <p className="text-slate-400 text-xs">Informasi yang dicetak pada struk belanja dan tampil di header website</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Nama Coffee Shop <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={settings.name}
                    onChange={e => setSettings(s => ({ ...s, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                    placeholder="Coffee Shop"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Tagline / Motto Cafe
                  </label>
                  <input
                    value={settings.tagline}
                    onChange={e => setSettings(s => ({ ...s, tagline: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                    placeholder="Your Daily Coffee Escape"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Alamat Lengkap Toko <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={settings.address}
                    onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400 resize-none"
                    placeholder="Jl. Sudirman No. 123, Pekanbaru, Riau"
                  />
                </div>
              </div>
            </div>

            {/* Kontak & Media Sosial */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>contacts</span>
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold text-base">Kontak & Akses WiFi</h3>
                  <p className="text-slate-400 text-xs">Informasi konektivitas pelanggan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    No. Telepon / WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-base">phone</span>
                    <input
                      value={settings.phone}
                      onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Email Cafe
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-base">mail</span>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                      placeholder="hello@coffeeshop.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Akun Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">@</span>
                    <input
                      value={settings.instagram.replace(/^@/, "")}
                      onChange={e => setSettings(s => ({ ...s, instagram: `@${e.target.value.replace(/^@/, "")}` }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                      placeholder="coffeeshop"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Password WiFi Toko
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-base">wifi</span>
                    <input
                      value={settings.wifi}
                      onChange={e => setSettings(s => ({ ...s, wifi: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 text-sm font-mono focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all placeholder-slate-400"
                      placeholder="normacoffee123"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JAM OPERASIONAL */}
        {activeTab === "hours" && (
          <div className="space-y-6">
            {/* Status Buka / Tutup Utama (Sinkron dengan Jadwal Operasional & Dashboard) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isStoreCurrentlyOpen ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isStoreCurrentlyOpen ? "storefront" : "door_front"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-slate-900 font-bold text-base">Status Operasional Cafe</h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                        isStoreCurrentlyOpen
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isStoreCurrentlyOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                      {isStoreCurrentlyOpen ? "Sedang Buka" : "Sedang Tutup"}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {isStoreCurrentlyOpen ? (
                      <span>
                        Sesuai jadwal hari <strong className="text-slate-800 font-semibold">{todayName}</strong> ({todaySchedule ? `${todaySchedule.open} – ${todaySchedule.close} WIB` : `${settings.openTime} – ${settings.closeTime} WIB`}), cafe saat ini sedang beroperasi dan melayani pesanan.
                      </span>
                    ) : !settings.isOpen ? (
                      <span className="text-rose-600 font-medium">
                        Cafe ditutup secara manual melalui Saklar Utama di samping.
                      </span>
                    ) : todaySchedule?.isClosed ? (
                      <span>
                        Hari ini (<strong className="text-slate-800 font-semibold">{todayName}</strong>) dijadwalkan sebagai hari libur / tutup reguler.
                      </span>
                    ) : (
                      <span>
                        Saat ini di luar jam operasional hari <strong className="text-slate-800 font-semibold">{todayName}</strong> (Jadwal buka: {todaySchedule ? `${todaySchedule.open} – ${todaySchedule.close} WIB` : `${settings.openTime} – ${settings.closeTime} WIB`}).
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Saklar Master Manual */}
              <div className="flex flex-col sm:items-end gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                <span className="text-[11px] font-semibold text-slate-500">Saklar Utama Toko:</span>
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, isOpen: !s.isOpen }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    settings.isOpen
                      ? "bg-slate-900 text-white shadow-xs hover:bg-slate-800"
                      : "bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                  }`}
                  title={settings.isOpen ? "Klik untuk menonaktifkan toko sementara" : "Klik untuk mengaktifkan toko"}
                >
                  <span className="material-symbols-outlined text-sm">
                    {settings.isOpen ? "check_circle" : "do_not_disturb_on"}
                  </span>
                  {settings.isOpen ? "Layanan Aktif (Otomatis Sesuai Jam)" : "Ditutup Manual (Tutup Paksa)"}
                </button>
              </div>
            </div>

            {/* Jadwal Harian Grid */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-slate-800 font-bold text-base">Jadwal Jam Buka Harian</h3>
                  <p className="text-slate-400 text-xs">Atur waktu operasional reguler untuk tiap-tiap hari</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const monday = settings.operationalHours[0];
                    handleApplyToAllDays(monday.open, monday.close);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-[#3B4CB8] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Terapkan Jam Senin ke Semua Hari
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {settings.operationalHours.map((schedule, index) => (
                  <div
                    key={schedule.day}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      schedule.isClosed
                        ? "bg-slate-50/70 border-slate-200/80 opacity-60"
                        : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="w-20 shrink-0">
                      <p className="font-bold text-sm text-slate-800">{schedule.day}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                        {schedule.isClosed ? "Libur" : "Aktif"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={schedule.open}
                        disabled={schedule.isClosed}
                        onChange={e => {
                          const newHours = [...settings.operationalHours];
                          newHours[index].open = e.target.value;
                          setSettings(s => ({ ...s, operationalHours: newHours }));
                        }}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-[#3B4CB8] focus:bg-white disabled:opacity-40"
                      />
                      <span className="text-slate-400 text-xs font-bold">-</span>
                      <input
                        type="time"
                        value={schedule.close}
                        disabled={schedule.isClosed}
                        onChange={e => {
                          const newHours = [...settings.operationalHours];
                          newHours[index].close = e.target.value;
                          setSettings(s => ({ ...s, operationalHours: newHours }));
                        }}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-[#3B4CB8] focus:bg-white disabled:opacity-40"
                      />
                    </div>

                    <div className="shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schedule.isClosed}
                          onChange={e => {
                            const newHours = [...settings.operationalHours];
                            newHours[index].isClosed = e.target.checked;
                            setSettings(s => ({ ...s, operationalHours: newHours }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-500"></div>
                        <span className="ml-1.5 text-[11px] font-bold text-slate-500">Libur</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PEMBAYARAN & PAJAK */}
        {activeTab === "payment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parameter Keuangan */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold text-base">Parameter Transaksi</h3>
                  <p className="text-slate-400 text-xs">Mata uang dan batasan minimal pemesanan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Mata Uang Utama
                  </label>
                  <select
                    value={settings.currency}
                    onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                  >
                    <option value="IDR">IDR - Rupiah Indonesia (Rp)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Minimal Nilai Pesanan (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={settings.minOrder}
                      onChange={e => setSettings(s => ({ ...s, minOrder: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium">Kosongkan atau isi 0 jika tidak ada batas minimal pembelian.</p>
                </div>
              </div>
            </div>

            {/* Pajak Transaksi */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold text-base">Pajak Restoran (PB1)</h3>
                  <p className="text-slate-400 text-xs">Kalkulasi pajak otomatis saat cetak struk kasir</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Persentase Pajak (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.taxPercent}
                      onChange={e => setSettings(s => ({ ...s, taxPercent: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#3B4CB8] focus:bg-white transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium">
                    Masukkan nilai 0 jika semua harga menu pada katalog sudah bersih (nett).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-700 text-xs leading-relaxed flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-indigo-600 text-base shrink-0 mt-0.5">calculate</span>
                  <div>
                    <p className="font-semibold text-slate-800">Sinkronisasi Pajak Pembayaran Pelanggan:</p>
                    <p className="text-slate-500 mt-0.5">
                      Besaran pajak yang Anda atur ({settings.taxPercent || 0}%) akan langsung diterapkan pada rincian keranjang dan total tagihan pembayaran pelanggan di menu pemesanan QR.
                    </p>
                    {Number(settings.taxPercent) > 0 && (
                      <p className="text-indigo-700 font-bold mt-1 text-[11px]">
                        Contoh: Pesanan Rp 50.000 ➔ Pajak ({settings.taxPercent}%): Rp {((50000 * Number(settings.taxPercent)) / 100).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}