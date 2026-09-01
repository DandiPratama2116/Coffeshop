'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
});

interface OrderItemDetail {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface WaitingViewProps {
  orderId: number | null;
  tableDatabaseId?: number;
  tableNumber?: string;
  onBackToMenu: () => void;
}

export default function WaitingView({
  orderId: propOrderId,
  tableDatabaseId,
  tableNumber,
  onBackToMenu,
}: WaitingViewProps) {
  const [activeOrderId, setActiveOrderId] = useState<number | null>(() => {
    if (propOrderId && propOrderId > 0) return propOrderId;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('order_createdOrderId');
      if (saved && Number(saved) > 0) return Number(saved);
    }
    return null;
  });

  const [status, setStatus] = useState<'pending' | 'processing' | 'ready' | 'completed' | 'done'>('pending');
  const [items, setItems] = useState<OrderItemDetail[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const onBackToMenuRef = useRef(onBackToMenu);
  useEffect(() => {
    onBackToMenuRef.current = onBackToMenu;
  }, [onBackToMenu]);

  useEffect(() => {
    if (propOrderId && propOrderId > 0) {
      setActiveOrderId(propOrderId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('order_createdOrderId', String(propOrderId));
      }
    }
  }, [propOrderId]);

  const fetchOrderStatus = useCallback(async () => {
    const targetId = activeOrderId || (typeof window !== 'undefined' ? Number(localStorage.getItem('order_createdOrderId')) : null);
    
    setIsRefreshing(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      let fetchedOrder: any = null;

      if (targetId && targetId > 0) {
        const response = await fetch(`${apiBase}/customer/orders/${targetId}`, { cache: 'no-store' });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            fetchedOrder = result.data;
          }
        }
      }

      if (!fetchedOrder && tableDatabaseId) {
        try {
          const allOrdersRes = await fetch(`${apiBase}/admin/orders`, { cache: 'no-store' });
          if (allOrdersRes.ok) {
            const allOrders = await allOrdersRes.json();
            if (allOrders.success && Array.isArray(allOrders.data)) {
              const matching = allOrders.data.filter((o: any) => String(o.table_id) === String(tableDatabaseId));
              if (matching.length > 0) {
                fetchedOrder = matching[0];
                if (fetchedOrder.id) {
                  setActiveOrderId(fetchedOrder.id);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('order_createdOrderId', String(fetchedOrder.id));
                  }
                }
              }
            }
          }
        } catch {}
      }

      if (fetchedOrder && fetchedOrder.status) {
        setStatus(fetchedOrder.status);
        setTotalAmount(fetchedOrder.total_amount || 0);

        if (Array.isArray(fetchedOrder.items) && fetchedOrder.items.length > 0) {
          const mappedItems: OrderItemDetail[] = fetchedOrder.items.map((i: any) => ({
            id: i.id,
            name: i.menu?.nama_menu || i.name || `Menu #${i.menu_id}`,
            qty: i.quantity,
            price: i.price,
          }));
          setItems(mappedItems);
        }

        setLastChecked(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error: any) {
      if (error.message !== "Failed to fetch" && error.name !== "TypeError") {
        console.error("Gagal polling status pesanan:", error);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [activeOrderId, tableDatabaseId]);

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 2500);
    return () => clearInterval(interval);
  }, [fetchOrderStatus]);

  const isCompleted = status === 'completed' || status === 'done';
  const isReady = status === 'ready';
  const isProcessing = status === 'processing';

  // Status mapping
  let statusBadge = 'Menunggu Konfirmasi';
  let title = 'Pesanan Diterima';
  let desc = 'Pesanan Anda sedang menunggu verifikasi kasir.';
  let progressWidth = '25%';

  if (isProcessing) {
    statusBadge = 'Sedang Diproses';
    title = 'Pesanan Sedang Dibuat';
    desc = 'Barista sedang menyiapkan pesanan Anda.';
    progressWidth = '60%';
  } else if (isReady) {
    statusBadge = 'Siap Diantar';
    title = 'Pesanan Siap';
    desc = 'Pesanan Anda telah selesai dan segera diantar ke meja.';
    progressWidth = '85%';
  } else if (isCompleted) {
    statusBadge = 'Selesai';
    title = 'Pesanan Selesai';
    desc = 'Pesanan telah diantar ke meja. Selamat menikmati.';
    progressWidth = '100%';
  }

  return (
    <div className={`min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col items-center justify-center p-4 sm:p-6 py-8 sm:py-12 overflow-y-auto ${montserrat.className}`}>
      
      {/* Clean, Elegant Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white border border-stone-200/90 rounded-[2rem] p-6 sm:p-8 shadow-sm shadow-stone-200/50 my-auto transition-all">
        
        {/* Header: Table & Order Number (Only Numbers, No #) */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 gap-3">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-stone-400 block mb-1">
              Nomor Meja
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <p className="text-sm sm:text-base font-bold text-stone-900 leading-tight truncate">
                Meja {tableNumber || '-'}
              </p>
            </div>
          </div>

          {activeOrderId && (
            <div className="text-right shrink-0">
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-stone-400 block mb-1">
                ID Pesanan
              </span>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-bold font-mono text-stone-900 tracking-wider shadow-2xs">
                {activeOrderId}
              </span>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="py-7 sm:py-8 text-center">
          {/* Status badge with animated pulse dot */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200/90 text-xs font-semibold text-stone-700 mb-3.5 shadow-2xs">
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              isCompleted
                ? 'bg-emerald-500'
                : isReady
                ? 'bg-blue-500'
                : isProcessing
                ? 'bg-amber-500'
                : 'bg-amber-400 animate-pulse'
            }`} />
            <span>{statusBadge}</span>
          </div>

          <h1 className="text-xl sm:text-[22px] font-extrabold text-stone-900 tracking-tight leading-snug">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            {desc}
          </p>

          {/* Clean Dual-Tone Progress Bar */}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-6 shadow-inner">
            <div
              className="h-full bg-stone-900 transition-all duration-700 ease-out rounded-full"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Order Items List - Receipt Style */}
        {items.length > 0 && (
          <div className="bg-stone-50/70 border border-stone-100 rounded-2xl p-4 mb-2">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
              Rincian Pesanan
            </p>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs gap-3">
                  <div className="flex items-center min-w-0">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white border border-stone-200 text-stone-800 font-bold text-[11px] mr-2 shrink-0 shadow-2xs">
                      {item.qty}
                    </span>
                    <span className="text-stone-700 font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-stone-600 font-semibold shrink-0">
                    Rp {(item.qty * item.price).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {totalAmount > 0 && (
              <div className="border-t border-dashed border-stone-200/90 mt-3 pt-3 flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-500">Total Pembayaran</span>
                <span className="font-extrabold text-stone-900 text-sm">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Clean Action Buttons */}
        <div className="pt-4 mt-2 space-y-2.5">
          <button
            type="button"
            onClick={() => onBackToMenuRef.current()}
            className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            {isCompleted ? 'Pesan Menu Lain' : 'Kembali ke Menu'}
          </button>

          <button
            type="button"
            onClick={fetchOrderStatus}
            disabled={isRefreshing}
            className="w-full py-3 px-4 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 active:scale-[0.99] text-xs font-semibold transition-all cursor-pointer"
          >
            {isRefreshing ? 'Memeriksa status...' : 'Perbarui Status'}
          </button>

          {lastChecked && (
            <p className="text-[10px] text-stone-400 text-center pt-0.5 tracking-wide">
              Diperiksa pukul {lastChecked}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
