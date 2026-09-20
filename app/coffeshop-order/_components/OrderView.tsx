'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import OrderMenu from './OrderMenu';
import { Montserrat } from 'next/font/google';
import { getApiBase } from '@/app/_utils/api';

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
  const [customerId, setCustomerId] = useState<number>(0);
  const [tableNumber, setTableNumber] = useState(tableId);
  const [tableDatabaseId, setTableDatabaseId] = useState(Number(tableId) || 1);
  const [seatingArea, setSeatingArea] = useState('Indoor');
  const [tableStatus, setTableStatus] = useState<'loading' | 'available' | 'occupied' | 'missing'>('loading');
  const [tableError, setTableError] = useState('');
  const apiBase = getApiBase();

  useEffect(() => {
    const savedTable = localStorage.getItem('order_tableNumber');
    const savedName = localStorage.getItem('order_customerName');
    const savedStep = localStorage.getItem('order_step');
    const savedCustId = localStorage.getItem('order_customerId');

    // If scanning the same table as before and was on menu, preserve session
    if (savedTable === tableId) {
      if (savedName) setCustomerName(savedName);
      if (savedCustId) setCustomerId(Number(savedCustId) || 0);
      if (savedStep === 'menu') setStep('menu');
    } else {
      // Scanned a new/different table: update table and reset order step
      localStorage.setItem('order_tableNumber', tableId);
      localStorage.removeItem('order_step');
      localStorage.removeItem('order_cart');
      localStorage.removeItem('order_createdOrderId');
      if (savedName) setCustomerName(savedName);
    }
  }, [tableId]);

  useEffect(() => {
    let cancelled = false;
    setTableStatus('loading');
    
    fetch(`${apiBase}/customer/tables/number/${encodeURIComponent(tableId)}`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Meja tidak ditemukan')))
      .then(result => {
        if (cancelled) return;
        const table = result.data;
        if (table) {
          setTableNumber(String(table.table_number || tableId));
          setTableDatabaseId(Number(table.id) || Number(tableId) || 1);
          setTableStatus(table.status || 'available');
          setSeatingArea(table.seating_area || 'Indoor');
        } else {
          setTableNumber(String(tableId));
          setTableDatabaseId(Number(tableId) || 1);
          setTableStatus('available');
          setSeatingArea('Indoor');
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback gracefully so customer can still order even if table not yet in DB
        setTableNumber(String(tableId));
        setTableDatabaseId(Number(tableId) || 1);
        setTableStatus('available');
        setSeatingArea('Indoor');
      });
    return () => { cancelled = true; };
  }, [apiBase, tableId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tableStatus === 'loading' || tableStatus === 'missing') return;
    
    try {
      const response = await fetch(`${apiBase}/customer/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: customerName,
          meja: tableNumber,
          lokasi_duduk: seatingArea
        })
      });
      if (!response.ok) {
        throw new Error('Gagal mendaftarkan nama pemesan ke database');
      }
      const result = await response.json();
      const customer = result.data;
      if (customer && customer.id) {
        setCustomerId(Number(customer.id));
        localStorage.setItem('order_customerId', String(customer.id));
      }
      
      localStorage.setItem('order_customerName', customerName);
      localStorage.setItem('order_step', 'menu');
      setStep('menu');
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Gagal terhubung ke database untuk menyimpan nama');
    }
  };

  if (step === 'menu') {
    return (
      <div className={montserrat.className}>
        <OrderMenu
          customerName={customerName}
          customerId={customerId}
          tableNumber={tableNumber}
          tableDatabaseId={tableDatabaseId}
          seatingArea={seatingArea}
          onBack={() => {
            localStorage.removeItem('order_step');
            localStorage.removeItem('order_customerId');
            setStep('form');
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden ${montserrat.className}`}>
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Latarbgcoffe_HD.jpg"
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
              src="/assets/Coffeshoplogo.jpeg"
              alt="Coffee Shop Logo"
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">Coffee Shop</h1>
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

          <div className="relative group">
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
              readOnly
              required
              className="w-full px-5 py-4 rounded-2xl border border-[#edeae6] bg-[#f1eee9] text-stone-600 outline-none shadow-sm font-medium italic cursor-not-allowed"
            />
          </div>

          {/* 4. Lokasi Tempat Duduk dari meja yang dipindai */}
          <div>
            <label className="block text-xs font-medium italic text-stone-800 uppercase tracking-wider mb-3">
              Lokasi Tempat Duduk <span className="text-red-500">*</span>
            </label>
            <div className="rounded-2xl px-5 py-4 bg-[#f1eee9] text-stone-900 border border-[#f1eee9] shadow-md shadow-[#7a6a60]/20 flex items-center justify-between gap-3 cursor-not-allowed">
              <p className="text-base font-bold italic">{seatingArea}</p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={tableStatus === 'loading' || tableStatus === 'missing'}
              aria-disabled={tableStatus === 'loading' || tableStatus === 'missing'}
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
