'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '../_data/menuData';

interface CartViewProps {
  cart: { item: MenuItem; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ item: MenuItem; quantity: number }[]>>;
  taxPercent?: number;
  onBack: () => void;
  onCheckout: () => void;
}

export default function CartView({ cart, setCart, taxPercent = 0, onBack, onCheckout }: CartViewProps) {
  const subTotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const deliveryFee = 2500;
  const adminFee = 2000;
  const taxAmount = Math.round((subTotal * taxPercent) / 100);
  
  const total = subTotal + deliveryFee + adminFee + taxAmount;

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
                      <div className="flex flex-col">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[11px] text-stone-400 line-through">
                            Rp {(item.originalPrice * quantity).toLocaleString('id-ID')}
                          </span>
                        )}
                        <span className="font-bold text-stone-700 text-sm">
                          Rp {(item.price * quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                      
                      {item.category === 'Promo' ? (
                        <div className="flex items-center h-7">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            Promo Digunakan (1x)
                          </span>
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


        {/* Summary */}
        <div className="space-y-3 mb-8 text-sm">
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Sub total</span>
            <span>Rp {subTotal.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex justify-between text-stone-600 font-medium">
            <span>Biaya Layanan</span>
            <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-stone-600 font-medium">
            <span>Biaya Admin</span>
            <span>Rp {adminFee.toLocaleString('id-ID')}</span>
          </div>
          {taxPercent > 0 && (
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Pajak Restoran ({taxPercent}%)</span>
              <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-800 font-bold pt-3 border-t border-gray-200 text-base">
            <span>Total Pembayaran</span>
            <span className="text-amber-700">Rp {total.toLocaleString('id-ID')}</span>
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
