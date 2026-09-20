'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '../_data/menuData';
import { getApiBase } from '@/app/_utils/api';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface PaymentViewProps {
  totalAmount: number;
  customerName: string;
  customerId?: number;
  tableId: number;
  cart: CartItem[];
  promoCode?: string;
  promoId?: number;
  discountAmount?: number;
  taxPercent?: number;
  onBack: () => void;
  onPaySuccess: (orderId: number) => void;
}

export default function PaymentView({ totalAmount, customerName, customerId, tableId, cart, promoCode, promoId, discountAmount, taxPercent = 0, onBack, onPaySuccess }: PaymentViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const apiBase = getApiBase();

  const groupedMethods = [
    {
      groupName: 'QR Code',
      methods: [
        { id: 'qris', name: 'QRIS', type: 'qris' },
      ]
    },
    {
      groupName: 'Transfer Bank',
      methods: [
        { id: 'mandiri', name: 'Bank Mandiri', type: 'transfer' },
        { id: 'bni', name: 'Bank BNI', type: 'transfer' },
      ]
    },
    {
      groupName: 'E-Wallet',
      methods: [
        { id: 'dana', name: 'DANA', type: 'ewallet' },
        { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet' },
      ]
    }
  ];

  const handlePay = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    try {
      const finalCustomerId = customerId || Number(localStorage.getItem('order_customerId')) || 0;
      const promoCartItem = cart.find(c => c.item.category === 'Promo');
      const calculatedDiscount = discountAmount || (promoCartItem && promoCartItem.item.originalPrice && promoCartItem.item.originalPrice > promoCartItem.item.price ? (promoCartItem.item.originalPrice - promoCartItem.item.price) * promoCartItem.quantity : 0);

      const response = await fetch(`${apiBase}/customer/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: finalCustomerId,
          customer_name: customerName,
          table_id: tableId,
          total_amount: totalAmount,
          promo_code: promoCode || '',
          promo_id: promoId || (promoCartItem ? Number(promoCartItem.item.id.replace(/\D/g, '')) || undefined : undefined),
          discount_amount: calculatedDiscount,
          notes: '',
          items: cart.map(c => ({
            menu_id: Number(c.item.id.replace(/\D/g, '')) || 1,
            quantity: c.quantity
          }))
        }),
      });
      const result = await response.json();
      console.log("Create order result:", result);
      if (!response.ok) throw new Error(result.message || 'Order gagal disimpan.');

      const orderId = result.data?.id || 0;

      // Create Payment Record
      try {
        const paymentResponse = await fetch(`${apiBase}/customer/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderId,
            payment_method: selectedMethod,
            amount: totalAmount,
            transaction_id: 'TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase()
          }),
        });
        if (!paymentResponse.ok) {
          console.error("Payment gagal disimpan di database, namun order sukses.");
        }
      } catch (err) {
        console.error("Network error saving payment:", err);
      }

      console.log("Passing orderId to onPaySuccess:", orderId);
      onPaySuccess(orderId);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Order gagal disimpan.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col  pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#fafafa] z-10 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-700 hover:text-amber-600 transition-colors p-1 active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-stone-800">Pilih Pembayaran</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      <div className="px-5 mt-6 flex-1">
        {/* Order Summary (Premium Gradient) */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-xl shadow-amber-500/20 mb-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/20"></div>
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full border border-white/10"></div>

          <span className="text-white/80 font-medium text-sm mb-1 relative z-10">Total Tagihan</span>
          <span className="text-3xl font-extrabold text-white tracking-tight relative z-10 drop-shadow-sm">
            Rp {totalAmount.toLocaleString('id-ID')}
          </span>
          {taxPercent > 0 && (
            <span className="text-white/80 text-[11px] font-medium mt-1 relative z-10 bg-black/10 px-2.5 py-0.5 rounded-full">
              Termasuk Pajak Restoran {taxPercent}%
            </span>
          )}
        </div>

        {/* Payment Methods */}
        <h2 className="text-stone-800 font-bold text-lg mb-4">Metode Pembayaran</h2>

        <div className="space-y-6 mb-8">
          {groupedMethods.map((group) => (
            <div key={group.groupName} className="space-y-3">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">{group.groupName}</h3>
              {group.methods.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div
                    key={method.id}
                    className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${isSelected ? 'border-amber-500 bg-amber-50/20 shadow-md transform -translate-y-0.5' : 'border-gray-100 hover:border-amber-200 hover:shadow-md'
                      }`}
                  >
                    <div
                      onClick={() => setSelectedMethod(isSelected ? null : method.id)}
                      className="p-4 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-500'
                          }`}>
                          {method.type === 'qris' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          )}
                          {method.type === 'transfer' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          )}
                          {method.type === 'ewallet' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-bold transition-colors ${isSelected ? 'text-stone-800' : 'text-stone-600'}`}>
                          {method.name}
                        </span>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-amber-500 scale-110' : 'border-gray-300'
                        }`}>
                        {isSelected && <div className="w-3 h-3 bg-amber-500 rounded-full animate-in zoom-in" />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="px-4 pb-4 pt-2 border-t border-amber-200/50 mt-1 bg-amber-50/10">
                        {method.type === 'qris' && (
                          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                            <div className="relative w-48 h-48 mb-3">
                              <Image src="/assets/scan.png" alt="QRIS Barcode" fill className="object-contain" />
                            </div>
                            <p className="text-sm text-stone-500 text-center font-medium">Scan QR Code ini menggunakan aplikasi M-Banking atau E-Wallet Anda.</p>
                          </div>
                        )}
                        {method.type === 'transfer' && (
                          <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                            <p className="text-xs text-stone-500 mb-1 font-semibold">Nomor Virtual Account</p>
                            <div className="flex items-center justify-between gap-2 bg-stone-50 p-3 rounded-xl border border-gray-100">
                              <span className="font-mono font-bold text-stone-800 text-[13px] sm:text-base tracking-wide">88000 1234 5678 90</span>
                              <button className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-amber-200 active:scale-95 transition-all shrink-0">Salin</button>
                            </div>
                            <p className="text-xs text-stone-400 mt-3 text-center">Silakan transfer sesuai dengan total tagihan.</p>
                          </div>
                        )}
                        {method.type === 'ewallet' && (
                          <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                            <p className="text-xs text-stone-500 mb-1 font-semibold">Nomor Handphone Terdaftar</p>
                            <div className="flex items-center justify-between gap-2 bg-stone-50 p-3 rounded-xl border border-gray-100">
                              <span className="font-mono font-bold text-stone-800 text-[13px] sm:text-base tracking-wide">0812 3456 7890</span>
                              <button className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-amber-200 active:scale-95 transition-all shrink-0">Salin</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {/* Pay Action Button */}
      <div className="px-5 pb-5">
        <button
          onClick={handlePay}
          disabled={!selectedMethod || isProcessing}
          className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/30 hover:bg-amber-700 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            'Bayar Sekarang'
          )}
        </button>
      </div>
    </div>
  );
}
