"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  subtotal?: number;
}

interface Order {
  id: string;
  tableId: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  promo?: {
    id?: number;
    name?: string;
    code?: string;
    discount?: number;
    type?: string;
  } | null;
  total: number;
  status: "pending" | "processing" | "ready" | "done" | "completed";
  time: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending:    { label: "Menunggu",  dot: "bg-amber-500",   badge: "bg-stone-100 text-stone-700 border-stone-300" },
  processing: { label: "Diproses", dot: "bg-blue-500",    badge: "bg-stone-100 text-stone-700 border-stone-300" },
  ready:      { label: "Siap",     dot: "bg-emerald-600", badge: "bg-stone-100 text-stone-700 border-stone-300" },
  done:       { label: "Selesai",  dot: "bg-stone-400",   badge: "bg-stone-50  text-stone-500 border-stone-200" },
  completed:  { label: "Selesai",  dot: "bg-stone-400",   badge: "bg-stone-50  text-stone-500 border-stone-200" },
};

const STATUS_NEXT: Record<Order["status"], Order["status"] | null> = {
  pending: "processing",
  processing: "ready",
  ready: "completed",
  done: null,
  completed: null,
};

const STATUS_NEXT_LABEL: Record<Order["status"], string> = {
  pending: "Proses Pesanan",
  processing: "Tandai Siap",
  ready: "Selesaikan",
  done: "",
  completed: "",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchOrders = async () => {
    try {
      let productMap: Record<number, string> = {};
      try {
        const prodRes = await fetch(`${apiBase}/admin/products`, { cache: "no-store" });
        const prodResult = await prodRes.json();
        if (prodResult.success && Array.isArray(prodResult.data)) {
          prodResult.data.forEach((p: any) => {
            if (p.id && p.nama_menu) productMap[p.id] = p.nama_menu;
          });
        }
      } catch {}

      const res = await fetch(`${apiBase}/admin/orders`, { cache: "no-store" });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const mapped = result.data.map((o: any) => {
          const discount = Number(o.discount_amount) || 0;
          const items = o.items
            ? o.items.map((i: any) => ({
                name: i.menu?.nama_menu || productMap[i.menu_id] || (i.name && !i.name.startsWith("Menu ID") ? i.name : `Menu ${i.menu_id}`),
                qty: i.quantity,
                price: i.price,
                subtotal: i.subtotal || (i.quantity * i.price),
              }))
            : [];
          const rawSubtotal = items.reduce((acc: number, curr: any) => acc + (curr.price * curr.qty), 0);

          return {
            id: String(o.id),
            tableId: String(o.table_id),
            customerName: o.customer_name || (o.customer ? o.customer.name : `Pelanggan Meja ${o.table_id}`),
            items,
            subtotal: rawSubtotal > 0 ? rawSubtotal : o.total_amount + discount,
            discountAmount: discount,
            promo: o.promo || (discount > 0 ? { name: "Potongan Diskon Promo", discount } : null),
            total: o.total_amount,
            status: o.status,
            time: new Date(o.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          };
        });
        setOrders(mapped);
      }
    } catch (err: any) {
      if (err.message !== "Failed to fetch" && err.name !== "TypeError") {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const next = STATUS_NEXT[order.status];
    if (!next) return;
    try {
      const res = await fetch(`${apiBase}/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        fetchOrders();
        if (selected?.id === id) setSelected({ ...order, status: next });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts: Record<string, number> = { all: orders.length, pending: 0, processing: 0, ready: 0, completed: 0, done: 0 };
  orders.forEach(o => {
    if (counts[o.status] !== undefined) counts[o.status]++;
    else counts[o.status] = 1;
  });

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Pesanan</h1>
        <p className="text-base text-slate-500 mt-1">Pantau dan kelola alur antrean pesanan pelanggan</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: "all",       label: "Total Pesanan" },
          { key: "pending",   label: "Menunggu" },
          { key: "processing",label: "Diproses" },
          { key: "completed", label: "Selesai" },
        ].map(s => (
          <div key={s.key} className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-4xl font-extrabold text-slate-900 mt-2">{counts[s.key] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap gap-2">
        {(["all", "pending", "processing", "ready", "completed"] as const).map(s => {
          const isActive = filter === s;
          const label = s === "all" ? "Semua" : STATUS_CONFIG[s]?.label || s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {counts[s] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Layout: Tabel + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabel Pesanan Bernomor */}
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
              <p className="text-base font-semibold text-slate-500">Tidak ada pesanan</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[48px_1fr_100px_130px_130px] border-b border-slate-100 bg-slate-50 px-5 py-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">No</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pesanan</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meja</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100">
                {filtered.map((order, idx) => {
                  const conf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const isSelected = selected?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelected(order)}
                      className={`grid grid-cols-[48px_1fr_100px_130px_130px] items-center px-5 py-4 cursor-pointer transition-colors ${
                        isSelected ? "bg-slate-900 text-white" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Nomor Urut */}
                      <span className={`text-sm font-bold ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        {idx + 1}
                      </span>

                      {/* Info Pesanan */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                            Pesanan #{order.id}
                          </p>
                          {order.discountAmount > 0 && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}>
                              🏷️ Promo -Rp {order.discountAmount.toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 truncate max-w-[240px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {order.items.map(i => `${i.name} (${i.qty})`).join(", ")}
                        </p>
                      </div>

                      {/* Meja */}
                      <p className={`text-sm font-semibold ${isSelected ? "text-slate-200" : "text-slate-700"}`}>
                        Meja {order.tableId}
                      </p>

                      {/* Total */}
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                          Rp {order.total.toLocaleString("id-ID")}
                        </p>
                        {order.discountAmount > 0 && (
                          <p className={`text-[10px] line-through font-medium ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                            Rp {order.subtotal.toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border w-fit ${
                        isSelected ? "bg-white/20 text-white border-white/30" : conf.badge
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : conf.dot}`} />
                        {conf.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-fit sticky top-6 overflow-hidden">
          {!selected ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 block mb-3">touch_app</span>
              <p className="text-base font-semibold text-slate-700">Pilih Pesanan</p>
              <p className="text-sm text-slate-400 mt-1">Klik baris pesanan di sebelah kiri untuk melihat rincian</p>
            </div>
          ) : (
            <div>
              {/* Detail Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pesanan #{selected.id}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Meja {selected.tableId} • Pukul {selected.time}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${STATUS_CONFIG[selected.status]?.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selected.status]?.dot}`} />
                  {STATUS_CONFIG[selected.status]?.label}
                </span>
              </div>

              {/* Item List */}
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {selected.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.qty}x @ Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">Rp {(item.qty * item.price).toLocaleString("id-ID")}</p>
                    </div>
                  ))}
                </div>

                {/* Rincian Harga & Promo Diskon */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {/* Subtotal */}
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Subtotal Pesanan</span>
                    <span className="font-semibold">
                      Rp {selected.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Promo Potongan Harga */}
                  {selected.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-xs bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 text-amber-900">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="material-symbols-outlined text-sm text-amber-700">local_offer</span>
                        <span>{selected.promo?.name ? `Promo: ${selected.promo.name}` : "Potongan Diskon Promo"}</span>
                        {selected.promo?.code && (
                          <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-800">
                            {selected.promo.code}
                          </span>
                        )}
                      </div>
                      <span className="font-extrabold text-amber-700">
                        - Rp {selected.discountAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  {/* Total Akhir */}
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Total Pembayaran</p>
                      {selected.discountAmount > 0 && (
                        <p className="text-[11px] text-emerald-600 font-bold">
                          Hemat Rp {selected.discountAmount.toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">
                      Rp {selected.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  {STATUS_NEXT[selected.status] && (
                    <button
                      onClick={() => updateStatus(selected.id)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      {STATUS_NEXT_LABEL[selected.status]}
                    </button>
                  )}
                  <button
                    onClick={() => deleteOrder(selected.id)}
                    className="w-full border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Hapus Pesanan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}