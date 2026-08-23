'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import OrderMenu from './OrderMenu';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['500', '700'],
  style: ['normal', 'italic'],
});

interface OrderViewProps {
  tableId: string;
}

export default function OrderView({ tableId }: OrderViewProps) {
  const [step, setStep] = useState<'form' | 'menu'>('form');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState(tableId);
  const [seatingArea, setSeatingArea] = useState('Indoor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('menu');
  };

  if (step === 'menu') {
    return (
      <div className={montserrat.className}>
        <OrderMenu
          customerName={customerName}
          tableNumber={tableNumber}
          seatingArea={seatingArea}
          onBack={() => setStep('form')}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden ${montserrat.className}`}>
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Norma.jpeg"
          alt="Cafe Background"
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Overlay to ensure text readability - Soft warm dark overlay */}
        <div className="absolute inset-0 bg-[#3a322d]/40 backdrop-blur-md"></div>
      </div>

      {/* Card - Soft milky background, delicate border */}
      <div className="relative z-10 bg-[#fdfdfc]/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-[#3a322d]/20 max-w-md w-full border border-[#edeae6]">

        {/* 1. Logo Norma */}
        <div className="flex justify-center mb-8 relative">
          <div className="w-28 h-28 relative rounded-full overflow-hidden shadow-xl shadow-[#8c7b70]/10 border-4 border-white bg-white ring-4 ring-[#f4f1eb]">
            <Image
              src="/assets/LogoNorma.jpg"
              alt="Caffe Norma Logo"
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">Norma Coffee</h1>
          <p className="text-sm font-medium italic text-stone-600 uppercase tracking-[0.15em]">Pemesanan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2. Input Nama Pemesan */}
          <div className="relative group">
            <label htmlFor="customerName" className="block text-xs font-medium italic text-stone-800 uppercase tracking-wider mb-2">
              Nama Pemesan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama Anda"
              required
              className="w-full px-5 py-4 rounded-2xl border border-[#edeae6] bg-[#f9f8f6] focus:bg-white focus:ring-4 focus:ring-[#e8ded7] focus:border-[#c7a48d] outline-none transition-all duration-300 shadow-sm text-stone-900 placeholder-stone-400 font-medium italic"
            />
          </div>

          {/* 3. Input No Meja */}
          <div className="relative group">
            <label htmlFor="tableNumber" className="block text-xs font-medium italic text-stone-800 uppercase tracking-wider mb-2">
              Nomor Meja <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="No "
              required
              className="w-full px-5 py-4 rounded-2xl border border-[#edeae6] bg-[#f9f8f6] focus:bg-white focus:ring-4 focus:ring-[#e8ded7] focus:border-[#c7a48d] outline-none transition-all duration-300 shadow-sm text-stone-900 placeholder-stone-400 font-medium italic [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* 4. Lokasi Tempat Duduk */}
          <div>
            <label className="block text-xs font-medium italic text-stone-800 uppercase tracking-wider mb-3">
              Lokasi Tempat Duduk <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Indoor', 'Outdoor', 'Lt. 2', 'VIP'].map((area) => (
                <label
                  key={area}
                  className={`
                    cursor-pointer relative rounded-2xl px-4 py-3.5 text-sm font-medium italic flex items-center justify-center transition-all duration-300 border
                    ${seatingArea === area
                      ? 'bg-[#7a6a60] text-white border-[#7a6a60] shadow-md shadow-[#7a6a60]/20 transform scale-[1.02]'
                      : 'bg-[#f9f8f6] border-[#edeae6] text-stone-800 hover:bg-white shadow-sm'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="seatingArea"
                    value={area}
                    className="sr-only"
                    checked={seatingArea === area}
                    onChange={() => setSeatingArea(area)}
                  />
                  <span>{area}</span>
                  {seatingArea === area && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/80"></span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full relative overflow-hidden bg-[#5c4d42] text-white font-bold italic py-4 px-4 rounded-2xl shadow-xl shadow-[#5c4d42]/30 hover:shadow-2xl hover:bg-[#4a3d34] transform active:scale-[0.98] transition-all duration-300 group"
            >
              <span className="relative z-10 text-[#fdfdfc] flex items-center justify-center gap-2">
                Mulai Pesan
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 text-[#d8c8bf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
