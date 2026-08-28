'use client';

import React, { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['500', '700'],
  style: ['normal', 'italic'],
});

interface WaitingViewProps {
  orderId: number | null;
  onBackToMenu: () => void;
}

export default function WaitingView({ orderId, onBackToMenu }: WaitingViewProps) {
  const [status, setStatus] = useState('pending'); // pending, processing, ready, completed
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!orderId) return;

    // Start progress bar
    setTimeout(() => setProgress(15), 50);

    const interval = setInterval(async () => {
      console.log("Polling order:", orderId);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/customer/orders/${orderId}`);
        console.log("Poll response status:", response.status);
        const result = await response.json();
        console.log("Poll result:", result);
        
        if (result.success && result.data) {
          const currentStatus = result.data.status;
          setStatus(currentStatus);

          if (currentStatus === 'processing') setProgress(50);
          if (currentStatus === 'ready') setProgress(75);
          
          if (currentStatus === 'completed') {
            setProgress(100);
            clearInterval(interval);
            setTimeout(() => {
              onBackToMenu();
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil status pesanan", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, onBackToMenu]);

  const isPreparing = status === 'pending' || status === 'processing';
  const isReady = status === 'ready';
  const isCompleted = status === 'completed';

  let title = 'Menunggu Konfirmasi...';
  let subtitle = 'Pesanan Anda sedang diverifikasi oleh kasir/admin.';
  let statusBadge = 'Pending';

  if (status === 'processing') {
    title = 'Pesanan Sedang Dibuat!';
    subtitle = 'Terima kasih! Barista kami sedang menyiapkan pesanan Anda.';
    statusBadge = 'Processing';
  } else if (status === 'ready') {
    title = 'Pesanan Siap!';
    subtitle = 'Pesanan Anda sudah selesai dan akan segera diantar ke meja.';
    statusBadge = 'Ready';
  } else if (status === 'completed') {
    title = 'Pesanan Diantar!';
    subtitle = 'Pesanan Anda sudah diantar. Selamat menikmati!';
    statusBadge = 'Completed';
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#fafafa] via-amber-50/30 to-amber-100/40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden ${montserrat.className}`}>

      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Premium Glassmorphism Card */}
      <div className="relative z-10 bg-white/70 backdrop-blur-2xl border border-white shadow-2xl shadow-amber-900/5 rounded-[2rem] p-8 w-full max-w-sm flex flex-col items-center">

        {/* Animation Container */}
        <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
          {!isCompleted && !isReady ? (
            <>
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-amber-100/50 rounded-full animate-ping opacity-30"></div>
              <div className="absolute inset-4 bg-amber-200/50 rounded-full animate-pulse opacity-50"></div>

              {/* Coffee Cup / Cooking SVG */}
              <div className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-amber-700 w-20 h-20">
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                  {/* Steam - animated */}
                  <path className="animate-[bounce_2s_infinite]" d="M9 3v4M12 2v5M15 3v4" stroke="url(#amber-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Cup */}
                  <path d="M4 8h14v7a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" stroke="url(#amber-gradient)" strokeWidth="2" strokeLinejoin="round" fill="white" />
                  {/* Handle */}
                  <path d="M18 10h1a3 3 0 013 3v0a3 3 0 01-3 3h-1" stroke="url(#amber-gradient)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Plate */}
                  <path d="M2 21h18" stroke="url(#amber-gradient)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <defs>
                    <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" /> {/* amber-500 */}
                      <stop offset="100%" stopColor="#b45309" /> {/* amber-700 */}
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </>
          ) : (
            <div className="animate-in zoom-in duration-500 flex items-center justify-center w-full h-full">
              {/* Success Background */}
              <div className="absolute inset-0 bg-emerald-100/50 rounded-full opacity-50 scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-4 bg-emerald-200/50 rounded-full opacity-60 scale-100"></div>

              {/* Success / Delivery Icon SVG */}
              <div className="relative z-10 text-emerald-500 w-20 h-20 drop-shadow-md animate-[bounce_2s_ease-in-out_infinite]">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Typography */}
        <h1 className={`text-2xl font-extrabold mb-3 transition-colors duration-500 ${!isCompleted ? 'text-transparent bg-clip-text bg-gradient-to-r from-stone-800 to-stone-600' : 'text-emerald-600'}`}>
          {title}
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-6 transition-all duration-300 h-10">
          {subtitle}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden shadow-inner relative">
          <div
            className={`h-full rounded-full transition-all ease-linear ${isCompleted || isReady ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`}
            style={{
              width: `${progress}%`,
              transitionDuration: '1000ms'
            }}
          />
        </div>

        {/* Status Text below progress bar */}
        <div className="w-full flex justify-between mt-2 px-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Status</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${!isCompleted && !isReady ? 'text-amber-600 animate-pulse' : 'text-emerald-600'}`}>
            {statusBadge}
          </span>
        </div>

      </div>
    </div>
  );
}
