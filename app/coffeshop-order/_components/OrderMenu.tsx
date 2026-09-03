'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from '../_data/menuData';
import CartView from './CartView';
import PaymentView from './PaymentView';
import WaitingView from './WaitingView';

interface OrderMenuProps {
  customerName: string;
  customerId?: number;
  tableNumber: string;
  tableDatabaseId: number;
  seatingArea: string;
  onBack: () => void;
}

export default function OrderMenu({ customerName, customerId, tableNumber, tableDatabaseId, seatingArea, onBack }: OrderMenuProps) {
  const [activeCategory, setActiveCategory] = useState('Coffee');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/customer/products`)
      .then(res => res.json())
      .then(result => {
        if(result.success && result.data) {
          const backendItems = result.data.map((p: any) => {
            // Build image path: support full URL, /assets/... path, or bare filename
            let imageSrc: string | null = null;
            if (p.image) {
              if (p.image.startsWith('http') || p.image.startsWith('/')) {
                imageSrc = p.image;
              } else {
                // Bare filename like "Espresso.jpeg" → resolve to /assets/Menu/
                imageSrc = `/assets/Menu/${p.image}`;
              }
            }
            return {
              id: String(p.id),
              name: p.nama_menu,
              description: p.deskripsi,
              price: p.harga,
              category: p.category?.nama_kategori || 'Coffee',
              subCategory: p.category?.nama_kategori || 'Coffee',
              image: imageSrc
            };
          });
          if (backendItems.length > 0) setMenuItems(backendItems);
          else setMenuItems(MENU_ITEMS);
        }
      })
      .catch(() => setMenuItems(MENU_ITEMS));
  }, []);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [currentView, setCurrentView] = useState<'menu' | 'cart' | 'payment' | 'waiting'>('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoId, setPromoId] = useState<number | undefined>(undefined);
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promos, setPromos] = useState<any[]>([]);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/customer/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(result => {
        if (result && result.success && result.data) {
          setTaxPercent(Number(result.data.tax_percent) || 0);
        }
      })
      .catch(() => {
        const local = localStorage.getItem('admin_settings');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setTaxPercent(Number(parsed.taxPercent) || 0);
          } catch (e) {}
        }
      });
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('order_cart');
    const savedView = localStorage.getItem('order_currentView');
    const savedOrderId = localStorage.getItem('order_createdOrderId');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
    if (savedOrderId && Number(savedOrderId) > 0) {
      setCreatedOrderId(Number(savedOrderId));
    }
    if (savedView === 'cart' || savedView === 'payment' || savedView === 'waiting') {
      setCurrentView(savedView);
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('order_cart', JSON.stringify(cart));
  }, [cart]);

  // Save view state
  useEffect(() => {
    localStorage.setItem('order_currentView', currentView);
  }, [currentView]);

  // Save createdOrderId state
  useEffect(() => {
    if (createdOrderId && createdOrderId > 0) {
      localStorage.setItem('order_createdOrderId', String(createdOrderId));
    }
  }, [createdOrderId]);

  useEffect(() => {
    if (promos.length <= 1) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setActivePromoIndex(0);
        } else {
          const nextLeft = scrollLeft + clientWidth;
          scrollRef.current.scrollTo({ left: nextLeft, behavior: 'smooth' });
          setActivePromoIndex(Math.round(nextLeft / (clientWidth || 1)));
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [promos.length]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/customer/promos`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(json => {
        if (json && json.success && Array.isArray(json.data)) {
          // Filter only active promos
          const activePromos = json.data.filter((p: any) => p && p.active);
          setPromos(activePromos);
        } else {
          setPromos([]);
        }
      })
      .catch(() => {
        // Fallback gracefully without throwing Next.js error overlay
        setPromos([]);
      });
  }, []);

  const resolveImageSrc = (src?: string | null) => {
    if (!src) return '/assets/coffe/Espresso.jpg';
    if (src.startsWith('http') || src.startsWith('/')) return src;
    return `/assets/Menu/${src}`;
  };

  const getPromoDetails = (promo: any) => {
    if (!promo) {
      return {
        linked: undefined,
        name: 'Promo',
        image: '/assets/coffe/Espresso.jpg',
        originalPrice: 0,
        discountedPrice: 0,
      };
    }
    const allMenus = menuItems.length > 0 ? menuItems : MENU_ITEMS;
    const linked = allMenus.find(m => m && String(m.id) === String(promo.product_id));

    const rawImage = promo.product?.image || linked?.image;
    const image = resolveImageSrc(rawImage);
    const name = promo.product?.nama_menu || linked?.name || promo.name || 'Promo Menu';
    const originalPrice = linked?.price || promo.product?.harga || 0;

    let discountedPrice = originalPrice;
    if (promo.type === 'percentage' || promo.type === 'percent') {
      discountedPrice = Math.max(0, Math.round(originalPrice * (1 - (Number(promo.discount) || 0) / 100)));
    } else if (promo.discount) {
      discountedPrice = Math.max(0, originalPrice - Number(promo.discount));
    }

    return {
      linked,
      name,
      image,
      originalPrice,
      discountedPrice,
    };
  };

  const handleUsePromo = (promo: any) => {
    const { linked, name, image, originalPrice, discountedPrice } = getPromoDetails(promo);
    const finalPrice = discountedPrice > 0 ? discountedPrice : (originalPrice > 0 ? originalPrice : 20000);
    const discount = originalPrice > finalPrice ? originalPrice - finalPrice : (Number(promo.discount) || 0);

    const promoItem: MenuItem = {
      id: promo.product_id ? String(promo.product_id) : `promo-${promo.id}`,
      name: name,
      price: finalPrice,
      originalPrice: originalPrice > 0 ? originalPrice : undefined,
      category: 'Promo',
      image: image,
      description: promo.description || linked?.description || 'Menu Promo Spesial',
    };

    addToCart(promoItem);
    if (promo.id) {
      setPromoId(Number(promo.id));
    }
    if (promo.code) {
      setPromoCode(promo.code);
      setAppliedPromo(true);
    }
    setDiscountAmount(discount);
    setCurrentView('cart');
  };

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
    ? (menuItems.length > 0 ? menuItems : MENU_ITEMS)
    : (menuItems.length > 0 ? menuItems : MENU_ITEMS).filter(item => item.category === activeCategory);

  const processedMenu = filteredMenu.map(item => {
    const promo = (promos || []).find(p => p && p.product_id && String(p.product_id) === item.id);
    if (promo) {
      let calcDiscount = 0;
      if (promo.type === 'fixed') {
        calcDiscount = Number(promo.discount) || 0;
      } else {
        calcDiscount = item.price * ((Number(promo.discount) || 0) / 100);
      }
      return {
        ...item,
        originalPrice: item.price,
        price: Math.max(0, item.price - calcDiscount),
      };
    }
    return item;
  });

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
  const deliveryFee = 2500;
  const adminFee = 2000;
  const taxAmount = Math.round((totalPrice * taxPercent) / 100);
  const totalAmountWithTax = totalPrice + deliveryFee + adminFee + taxAmount;

  // Get current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  if (currentView === 'cart') {
    return (
      <CartView
        cart={cart}
        setCart={setCart}
        taxPercent={taxPercent}
        onBack={() => setCurrentView('menu')}
        onCheckout={() => setCurrentView('payment')}
      />
    );
  }

  if (currentView === 'payment') {
    return (
      <PaymentView
        totalAmount={totalAmountWithTax}
        customerName={customerName}
        customerId={customerId || Number(localStorage.getItem('order_customerId')) || 0}
        tableId={tableDatabaseId}
        cart={cart}
        promoCode={promoCode}
        promoId={promoId}
        discountAmount={discountAmount}
        taxPercent={taxPercent}
        onBack={() => setCurrentView('cart')}
        onPaySuccess={(orderId) => {
          setCart([]);
          localStorage.removeItem('order_cart');
          localStorage.removeItem('order_customerId');
          if (orderId && orderId > 0) {
            setCreatedOrderId(orderId);
            localStorage.setItem('order_createdOrderId', String(orderId));
          }
          localStorage.setItem('order_currentView', 'waiting');
          setCurrentView('waiting');
        }}
      />
    );
  }

  if (currentView === 'waiting') {
    return (
      <WaitingView
        orderId={createdOrderId}
        tableDatabaseId={tableDatabaseId}
        tableNumber={tableNumber}
        onBackToMenu={() => {
          setCreatedOrderId(null);
          localStorage.removeItem('order_createdOrderId');
          localStorage.removeItem('order_currentView');
          setCurrentView('menu');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col pb-28">
      {/* Top App Bar */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#fafafa]/90 backdrop-blur-md z-20 border-b border-stone-200/50">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-[#edeae6] flex items-center justify-center text-stone-700 shadow-sm active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-stone-700 tracking-wide">Meja {tableNumber}</span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500">{seatingArea}</span>
        </div>

        {/* Cart Icon with badge */}
        <button
          onClick={() => setCurrentView('cart')}
          className="w-9 h-9 rounded-full bg-[#7a6a60] flex items-center justify-center text-white relative shadow-md shadow-[#7a6a60]/20 active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scale-up shadow-sm">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Greeting Title */}
      <div className="px-5 my-4 w-full max-w-3xl mx-auto">
        <p className="text-xs font-semibold text-[#a3948b] uppercase tracking-widest mb-0.5">{greeting} 👋</p>
        <h1 className="text-[22px] font-extrabold text-stone-900 leading-tight">{customerName}</h1>
        <p className="text-[13px] text-[#b5a89e] mt-0.5">Selamat datang di Coffee Shop</p>
      </div>

      {/* Promo Banner - Responsive across Mobile (Android/iOS), Tablet & Desktop */}
      {promos.length > 0 && (
        <div className="px-5 mb-6 w-full max-w-3xl mx-auto">
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full rounded-3xl"
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / (el.clientWidth || 1));
                setActivePromoIndex(idx);
              }}
            >
              {promos.map((promo, index) => {
                const { name, image, originalPrice, discountedPrice } = getPromoDetails(promo);
                
                // Variasi tema premium
                const themes = [
                  {
                    gradient: "from-[#2b1810] via-[#3d2419] to-[#1c0f0a]",
                    badgeBg: "bg-amber-400 text-stone-950",
                    accentGlow: "bg-amber-500/20",
                    btnBg: "bg-amber-500 hover:bg-amber-400 text-stone-950",
                  },
                  {
                    gradient: "from-[#1e2a22] via-[#2d3e33] to-[#141d17]",
                    badgeBg: "bg-emerald-400 text-stone-950",
                    accentGlow: "bg-emerald-500/20",
                    btnBg: "bg-emerald-500 hover:bg-emerald-400 text-stone-950",
                  },
                  {
                    gradient: "from-[#2a1b2d] via-[#3c2741] to-[#1b101d]",
                    badgeBg: "bg-rose-400 text-stone-950",
                    accentGlow: "bg-rose-500/20",
                    btnBg: "bg-rose-500 hover:bg-rose-400 text-white",
                  }
                ];
                const theme = themes[index % themes.length];
                const discountText = promo.type === 'percentage' || promo.type === 'percent'
                  ? `HEMAT ${promo.discount}%`
                  : `HEMAT Rp ${Number(promo.discount).toLocaleString('id-ID')}`;

                return (
                  <div key={promo.id} className="min-w-full snap-center">
                    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-4 sm:p-6 text-white shadow-xl shadow-stone-950/15 border border-white/10`}>
                      
                      {/* Glow dekoratif */}
                      <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full ${theme.accentGlow} blur-3xl pointer-events-none`}></div>
                      <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

                      <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-6">
                        {/* Info Promo (Kiri) */}
                        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full ${theme.badgeBg} shadow-sm`}>
                              🏷️ {discountText}
                            </span>
                            {promo.code && (
                              <span className="text-[10px] sm:text-xs font-mono font-bold bg-white/15 px-2 py-0.5 rounded-md border border-white/20 text-white/90">
                                {promo.code}
                              </span>
                            )}
                          </div>

                          <h2 className="text-white font-extrabold text-base sm:text-xl leading-tight line-clamp-1">
                            {promo.name}
                          </h2>

                          <p className="text-amber-200/90 font-medium text-xs sm:text-sm mt-0.5 line-clamp-1">
                            {name}
                          </p>

                          {promo.description && (
                            <p className="text-white/70 text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed">
                              {promo.description}
                            </p>
                          )}

                          {/* Harga & Tombol */}
                          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-white/10">
                            {originalPrice > 0 && (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-white font-black text-sm sm:text-base">
                                  Rp {discountedPrice.toLocaleString('id-ID')}
                                </span>
                                {originalPrice > discountedPrice && (
                                  <span className="text-[11px] text-white/50 line-through">
                                    Rp {originalPrice.toLocaleString('id-ID')}
                                  </span>
                                )}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => handleUsePromo(promo)}
                              className={`${theme.btnBg} font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer ml-auto`}
                            >
                              <span>Gunakan Promo</span>
                              <span className="text-sm">→</span>
                            </button>
                          </div>
                        </div>

                        {/* Foto Menu Terpilih (Kanan) */}
                        <div className="shrink-0 relative">
                          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden relative shadow-lg shadow-black/30 border-2 border-white/20 bg-stone-900/60">
                            <Image
                              src={image}
                              alt={name}
                              fill
                              sizes="(max-width: 640px) 80px, 128px"
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute -bottom-1.5 -left-1.5 bg-black/80 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-full border border-white/10 shadow-xs">
                            Menu Promo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot Indicators jika promo > 1 */}
            {promos.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                {promos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (scrollRef.current) {
                        const width = scrollRef.current.clientWidth;
                        scrollRef.current.scrollTo({ left: width * i, behavior: 'smooth' });
                      }
                      setActivePromoIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activePromoIndex === i ? "w-6 bg-amber-600" : "w-1.5 bg-stone-300"
                    }`}
                    aria-label={`Slide promo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
          processedMenu.reduce((acc, item) => {
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
                      <div className="flex flex-col">
                        {item.originalPrice && (
                          <span className="text-[10px] text-red-500 line-through">Rp {item.originalPrice.toLocaleString('id-ID')}</span>
                        )}
                        <span className="font-extrabold text-stone-800 text-[13px]">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>
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
                <div className="flex flex-col items-end">
                  {selectedItem.originalPrice && (
                    <span className="text-sm text-red-500 line-through">Rp {selectedItem.originalPrice.toLocaleString('id-ID')}</span>
                  )}
                  <span className="text-lg font-bold text-stone-800 shrink-0">
                    Rp {selectedItem.price.toLocaleString('id-ID')}
                  </span>
                </div>
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
