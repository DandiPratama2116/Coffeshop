'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '../_data/menuData';

interface CartViewProps {
  cart: { item: MenuItem; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ item: MenuItem; quantity: number }[]>>;
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedPromo: boolean;
  setAppliedPromo: (applied: boolean) => void;
  onBack: () => void;
  onCheckout: () => void;
}

export default function CartView({ cart, setCart, promoCode, setPromoCode, appliedPromo, setAppliedPromo, onBack, onCheckout }: CartViewProps) {
  const subTotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const deliveryFee = 2500;
  const adminFee = 2000;
  
  let discount = 0;
  if (appliedPromo) {
    if (promoCode === 'FREECOOKIE') {
      discount = 25000;
    } else if (promoCode === 'DISC20') {
      discount = 7400; // 20% from 37.000
    } else if (promoCode === 'MATCHA15') {
      discount = 10000;
    } else {
      discount = subTotal * 0.1; // fallback
    }
  }
  
  const total = subTotal - discount + deliveryFee + adminFee;

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(cartItem => {
        if (cartItem.item.id === id) {
          if (cartItem.item.category === 'Promo' && delta > 0) {
            return cartItem; // Cannot increase beyond 1
          }
          const newQuantity = Math.max(1, cartItem.quantity + delta);
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(cartItem => cartItem.item.id !== id));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().length > 0) {
      setAppliedPromo(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col  pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#fafafa] z-10 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-700 hover:text-amber-600 transition-colors p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-stone-800">Keranjang</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      <div className="px-5 mt-6 flex-1">
        <h2 className="text-stone-800 font-bold text-lg mb-4">Ringkasan Pesanan</h2>

        {/* Cart Items List */}
        <div className="space-y-4 mb-6">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              Keranjang kamu masih kosong
            </div>
          ) : (
            cart.map((cartItem) => {
              const { item, quantity } = cartItem;

              return (
                <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-stretch gap-4 relative">
                  {/* Image */}
                  <div className="w-24 h-24 bg-stone-100 rounded-xl relative overflow-hidden shrink-0 border border-stone-200">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-stone-800 text-sm leading-tight max-w-[140px]">
                        {item.name}
                      </h3>
                      <button onClick={() => removeItem(item.id)} className="p-1 -mt-1 -mr-1">
                        <Image src="/assets/delate.png" alt="Delete" width={18} height={18} className="object-contain" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-auto pt-2">
                      <span className="font-bold text-stone-600 text-sm">
                        Rp {(item.price * quantity).toLocaleString('id-ID')}
                      </span>
                      
                      {item.category === 'Promo' ? (
                        <div className="flex items-center h-7 pr-2">
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-full border border-stone-400 flex items-center justify-center text-stone-800 active:bg-stone-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="font-semibold text-stone-800 w-4 text-center text-sm">{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-full border border-amber-600 flex items-center justify-center text-amber-600 active:bg-amber-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add More Items Button */}
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl border-2 border-amber-600 text-amber-600 font-bold mb-8 active:bg-amber-50 transition-colors"
        >
          Tambah Pesanan
        </button>

        {/* Discount Coupon */}
        <h2 className="text-stone-800 font-bold text-sm mb-3">Kode Diskon</h2>
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Masukkan Kode Diskon"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={appliedPromo}
            className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 disabled:bg-green-50 disabled:text-green-600 disabled:font-bold disabled:border-green-200"
          />
          <button
            onClick={handleApplyPromo}
            disabled={appliedPromo || !promoCode.trim()}
            className="bg-amber-600 text-white font-bold px-6 py-3 rounded-xl active:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {appliedPromo ? 'Applied' : 'Apply'}
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-3 mb-8 text-sm">
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Sub total</span>
            <span>Rp {subTotal.toLocaleString('id-ID')}</span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Promo: {promoCode}</span>
              <span>- Rp {discount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Biaya Layanan</span>
            <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Biaya Admin</span>
            <span>Rp {adminFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-stone-800 font-bold pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="px-5 pb-5">
          <button
            onClick={onCheckout}
            className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/30 hover:bg-amber-700 transition-colors active:scale-[0.98]"
          >
            Pembayaran
          </button>
        </div>
      )}
    </div>
  );
}
