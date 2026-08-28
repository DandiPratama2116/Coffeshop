"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "ready" | "done";
  time: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100" },
  processing: { label: "Diproses", color: "bg-indigo-50 text-[#3B4CB8] border-indigo-100" },
  ready: { label: "Siap", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  done: { label: "Selesai", color: "bg-slate-100 text-slate-500 border-slate-200" },
};

const STATUS_NEXT: Record<Order["status"], Order["status"] | null> = {
  pending: "processing",
  processing: "ready",
  ready: "done",
  done: null,
};

const STATUS_NEXT_LABEL: Record<Order["status"], string> = {
  pending: "Proses Pesanan",
  processing: "Tandai Siap",
  ready: "Selesaikan Pesanan",
  done: "",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const fetchOrders = () => {
    fetch(`${apiBase}/admin/orders`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const mapped = result.data.map((o: any) => ({
            id: String(o.id),
            tableId: String(o.table_id),
            items: o.order_items ? o.order_items.map((i: any) => ({ name: "Menu ID " + i.menu_id, qty: i.quantity, price: i.price })) : [],
            total: o.total_amount,
            status: o.status,
            time: new Date(o.created_at).toLocaleTimeString()
          }));
          setOrders(mapped);
        }
      })
      .catch(console.error);
  };
  useEffect(() => { fetchOrders(); }, []);



  const updateStatus = async (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const next = STATUS_NEXT[order.status];
    if (!next) return;
    
    try {
      const res = await fetch(`${apiBase}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      if (res.ok) {
        fetchOrders();
        if (selected?.id === id) {
          setSelected({ ...order, status: next });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = (id: string) => {
    // Delete order not supported via API currently. Just hide from view.
    setOrders(orders.filter(o => o.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = { all: orders.length, pending: 0, processing: 0, ready: 0, done: 0 };
  orders.forEach(o => {
    if (counts[o.status] !== undefined) {
      counts[o.status]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Pesanan</h2>
          <p className="text-xs text-[#3B4CB8] font-medium mt-0.5">Pantau dan kelola alur antrean pesanan pelanggan</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "processing", "ready", "done"] as const).map(s => {
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                isActive
                  ? "bg-[#3B4CB8] text-white border-[#3B4CB8] shadow-md shadow-indigo-100"
                  : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? "Semua Pesanan" : STATUS_CONFIG[s].label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Orders & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">receipt_long</span>
              </div>
              <p className="text-slate-800 font-bold text-base">Belum Ada Pesanan</p>
              <p className="text-slate-400 text-xs mt-1">
                {filter === "all" ? "Tidak ada pesanan yang masuk saat ini." : `Tidak ada pesanan dengan status "${STATUS_CONFIG[filter].label}".`}
              </p>
            </div>
          )}

          {filtered.map(order => {
            const isSelected = selected?.id === order.id;
            return (
              <div
                key={order.id}
                onClick={() => setSelected(order)}
                className={`bg-white border rounded-3xl p-5 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-transparent ring-2 ring-[#3B4CB8] shadow-md" : "border-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3B4CB8] flex items-center justify-center font-bold text-sm shrink-0">
                      #{order.tableId}
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold text-sm">{order.id}</p>
                      <p className="text-slate-400 text-xs mt-0.5">Meja {order.tableId} • {order.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${STATUS_CONFIG[order.status].color}`}>
                    {STATUS_CONFIG[order.status].label}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <p className="text-slate-500 text-xs truncate max-w-[240px]">
                    {order.items.map(i => `${i.name} (${i.qty})`).join(", ")}
                  </p>
                  <p className="text-[#3B4CB8] font-bold text-sm">Rp {order.total.toLocaleString("id-ID")}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Detail Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm h-fit sticky top-6 overflow-hidden">
          {!selected ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[#3B4CB8] text-3xl">touch_app</span>
              </div>
              <p className="text-slate-700 font-bold text-sm">Pilih Pesanan</p>
              <p className="text-slate-400 text-xs mt-1">Klik salah satu daftar pesanan di sebelah kiri untuk melihat rincian.</p>
            </div>
          ) : (
            <div>
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 font-bold text-base">{selected.id}</h3>
                  <p className="text-slate-400 text-xs">Meja {selected.tableId} • Waktu: {selected.time}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${STATUS_CONFIG[selected.status].color}`}>
                  {STATUS_CONFIG[selected.status].label}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {selected.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-slate-700 font-bold text-sm">{item.name}</p>
                        <p className="text-slate-400 mt-0.5">{item.qty}x @ Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>
                      <p className="text-slate-800 font-bold text-sm">Rp {(item.qty * item.price).toLocaleString("id-ID")}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <p className="text-slate-500 font-medium text-xs">Total Pembayaran</p>
                  <p className="text-[#3B4CB8] font-bold text-lg">Rp {selected.total.toLocaleString("id-ID")}</p>
                </div>

                <div className="space-y-2 pt-2">
                  {STATUS_NEXT[selected.status] && (
                    <button
                      onClick={() => updateStatus(selected.id)}
                      className="w-full bg-[#3B4CB8] hover:bg-[#3241A3] text-white font-bold py-2.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                    >
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                      {STATUS_NEXT_LABEL[selected.status]}
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteOrder(selected.id)}
                    className="w-full border border-rose-200 text-rose-600 font-semibold py-2.5 rounded-2xl text-xs hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
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