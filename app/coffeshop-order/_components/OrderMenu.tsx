'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from '../_data/menuData';
import CartView from './CartView';
import PaymentView from './PaymentView';
import WaitingView from './WaitingView';

interface OrderMenuProps {
  customerName: string;
  tableNumber: string;
  seatingArea: string;
  onBack: () => void;
}

export default function OrderMenu({ customerName, tableNumber, seatingArea, onBack }: OrderMenuProps) {
  const [activeCategory, setActiveCategory] = useState('Coffee');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [currentView, setCurrentView] = useState<'menu' | 'cart' | 'payment' | 'waiting'>('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          // Reset to start
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll to next
          scrollRef.current.scrollTo({ left: scrollLeft + clientWidth, behavior: 'smooth' });
        }
      }
    }, 4000); // Auto slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const PROMOS = [
    {
      id: 1,
      title: "Buy 2\nGet a Free Cookie !",
      image: "/assets/Menu/CoffeMagic.jpeg",
      gradient: "from-[#8c7b70] to-[#a3948b]",
      code: "FREECOOKIE",
      item: {
        id: 'promo-1',
        name: 'Promo: 2 Coffee + Free Cookie',
        description: 'Paket Buy 2 Selected Coffee + 1 Free Choco Tiramisu Cookies.',
        price: 89000,
        category: 'Promo',
        subCategory: 'Promo'
      }
    },
    {
      id: 2,
      title: "Special\nDiscount 20%",
      image: "/assets/Menu/Sweet&Cream.jpeg",
      gradient: "from-[#b5a397] to-[#cbbdb3]",
      code: "DISC20",
      item: {
        id: 'promo-2',
        name: 'Promo: Sweet & Cream (20% OFF)',
        description: 'Special Discount 20% untuk menu signature Sweet & Cream.',
        price: 37000,
        category: 'Promo',
        subCategory: 'Promo'
      }
    },
    {
      id: 3,
      title: "New Arrival\nPistachio Matcha",
      image: "/assets/Menu/MatchaPistachio.jpeg",
      gradient: "from-[#8a9a86] to-[#a2b29e]",
      code: "MATCHA15",
      item: {
        id: 'promo-3',
        name: 'Promo: Pistachio Matcha',
        description: 'New Arrival! Pistachio Matcha dengan harga spesial.',
        price: 55000,
        category: 'Rekomendasi',
        subCategory: 'Rekomendasi'
      }
    }
  ];

  const getCategoryIconSrc = (id: string) => {
    switch (id) {
      case 'Coffee': return '/assets/coffee.png';
      case 'Non-Coffee': return '/assets/water-glass.png';
      case 'Mocktails & Juice': return '/assets/juice.png';
      case 'Food': return '/assets/food.png';
      case 'Snacks': return '/assets/potato.png';
      case 'Pastry & Dessert': return '/assets/coockies.png';
      default: return '/assets/coffee.png';
    }
  };

  const categories = MENU_CATEGORIES.map(cat => ({
    ...cat,
    iconSrc: getCategoryIconSrc(cat.id)
  }));

  const filteredMenu = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        if (item.category === 'Promo') {
          return prev;
        }
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  // Get current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  if (currentView === 'cart') {
    return (
      <CartView
        cart={cart}
        setCart={setCart}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
        onBack={() => setCurrentView('menu')}
        onCheckout={() => setCurrentView('payment')}
      />
    );
  }

  if (currentView === 'payment') {
    return (
      <PaymentView
        totalAmount={totalPrice}
        onBack={() => setCurrentView('cart')}
        onPaySuccess={() => {
          setCart([]);
          setCurrentView('waiting');
        }}
      />
    );
  }

  if (currentView === 'waiting') {
    return (
      <WaitingView
        onBackToMenu={() => setCurrentView('menu')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col pb-24 relative">

      {/* Top Header Icons */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button onClick={onBack} className="text-[#8c7b70] hover:text-[#5c4d42] transition-colors p-1">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={() => setCurrentView('cart')} className="relative p-1">
          <div className="relative w-7 h-7">
            <Image src="/assets/keranjang.png" alt="Cart" fill className="object-contain" />
          </div>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#fcfbf9]">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Greeting Title */}
      <div className="px-5 mb-5">
        <p className="text-xs font-semibold text-[#a3948b] uppercase tracking-widest mb-0.5">{greeting} 👋</p>
        <h1 className="text-[22px] font-extrabold text-stone-900 leading-tight">{customerName}</h1>
        <p className="text-[13px] text-[#b5a89e] mt-0.5">Selamat datang di Coffee Shop</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] font-semibold bg-[#f4f1eb] text-[#7a6a60] px-3 py-1.5 rounded-full border border-[#edeae6]">🪑 Meja {tableNumber}</span>
          <span className="text-[11px] font-semibold bg-[#f4f1eb] text-[#7a6a60] px-3 py-1.5 rounded-full border border-[#edeae6]">{seatingArea}</span>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="mb-8 w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full"
        >
          {PROMOS.map((promo) => (
            <div key={promo.id} className="min-w-full px-5 snap-center">
              <div className={`bg-gradient-to-r ${promo.gradient} rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-black/5`}>
                {/* Decorative circles */}
                <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full border border-white/20"></div>
                <div className="absolute top-10 left-10 w-24 h-24 rounded-full border border-white/10"></div>

                <div className="relative z-10 w-2/3">
                  <h2 className="text-white font-bold text-lg leading-tight mb-1 whitespace-pre-line">{promo.title}</h2>
                  <button 
                  onClick={() => {
                    addToCart(promo.item as MenuItem);
                    setPromoCode(promo.code);
                    setAppliedPromo(true);
                    setCurrentView('cart');
                  }}
                  className="mt-3 bg-white text-stone-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-stone-100 transition-colors w-max shadow-sm active:scale-95"
                >
                  Order Now
                </button>
                </div>

                {/* Images overlapping on right */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full overflow-hidden shadow-xl rotate-[-10deg]">
                  <Image src={promo.image} alt="Promo" fill className="object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-5 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between md:justify-center mb-3">
          <h2 className="text-[15px] font-extrabold text-stone-800">Kategori</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 md:justify-center md:mx-0 md:px-0">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-2 min-w-[72px] group"
              >
                <div className={`
                  w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300
                  ${isActive
                    ? 'bg-[#7a6a60] shadow-md shadow-[#7a6a60]/20 transform scale-[1.05]'
                    : 'bg-white border border-[#edeae6] group-hover:bg-[#f9f8f6] shadow-sm'}
                `}>
                  <div className="relative w-10 h-10">
                    <Image
                      src={cat.iconSrc}
                      alt={cat.label}
                      fill
                      className={`object-contain transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-md brightness-0 invert' : 'opacity-70 grayscale'}`}
                    />
                  </div>
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight transition-colors max-w-[72px] ${isActive ? 'text-[#5c4d42]' : 'text-[#a3948b]'}`}>
                  {cat.shortLabel}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-5 pb-32 flex flex-col gap-10">
        {Object.entries(
          filteredMenu.reduce((acc, item) => {
            const group = item.subCategory || 'Other';
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
          }, {} as Record<string, MenuItem[]>)
        ).map(([subCategory, items]) => (
          <div key={subCategory}>
            {/* Group Title */}
            {subCategory !== 'Other' && (
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1 h-4 rounded-full bg-[#8c7b70]"></div>
                <h3 className="text-[13px] font-extrabold text-stone-700 tracking-wide">
                  {activeCategory === 'All' ? <span className="text-[#a3948b] font-semibold mr-1">{items[0].category} ·</span> : ''}{subCategory}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent"></div>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#edeae6] flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group overflow-hidden">
                  <div
                    onClick={() => setSelectedItem(item)}
                    className="w-full h-36 bg-[#f4f1eb] relative shrink-0 cursor-pointer"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill quality={100} sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl opacity-40">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-3">
                    <h3 className="font-bold text-stone-900 text-[13px] leading-snug mb-1">{item.name}</h3>
                    <p className="text-[10px] text-[#b5a89e] leading-snug line-clamp-3 mb-2">
                      {item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-[#edeae6]/60 mt-auto">
                      <span className="font-extrabold text-stone-800 text-[13px]">Rp {item.price.toLocaleString('id-ID')}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-[#5c4d42] text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-95 shadow-sm shrink-0 hover:bg-[#4a3d34] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
      {/* Floating Checkout Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-10 bg-gradient-to-t from-[#fcfbf9] via-[#fcfbf9]/95 to-transparent pointer-events-none z-20">
          <button
            onClick={() => setCurrentView('cart')}
            className="pointer-events-auto w-full max-w-md mx-auto flex items-center justify-between bg-[#2c2118] text-white py-3.5 px-5 rounded-2xl shadow-[0_8px_32px_rgba(44,33,24,0.45)] active:scale-[0.98] transition-transform"
          >
            {/* Left: icon + label */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-[#e07b39] text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#2c2118]">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Lihat Pesanan</p>
                <p className="text-white/50 text-[11px] leading-tight">{cart.length} jenis menu</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2" />

            {/* Right: price */}
            <div className="text-right">
              <p className="text-white/60 text-[10px] leading-tight">Total</p>
              <p className="text-white font-extrabold text-sm leading-tight">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
          </button>
        </div>
      )}



      {/* Item Details Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-5"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-sm bg-[#fcfbf9] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="w-full h-56 bg-[#f4f1eb] relative shrink-0">
              {selectedItem.image ? (
                <Image src={selectedItem.image} alt={selectedItem.name} fill quality={100} priority className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl opacity-30">🍽️</span>
                </div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="text-xl font-bold text-stone-900">{selectedItem.name}</h2>
                <span className="text-lg font-bold text-stone-800 shrink-0">
                  Rp {selectedItem.price.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-sm text-[#8c7b70] font-medium mb-6 leading-relaxed">
                {selectedItem.description}
              </p>

              <button
                onClick={() => {
                  addToCart(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full bg-[#4a3d34] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#4a3d34]/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
