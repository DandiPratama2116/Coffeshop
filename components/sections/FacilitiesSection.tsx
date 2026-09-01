"use client";

import { useEffect, useState } from "react";

interface AreaSummary {
  area: string;
  total_tables: number;
  available_tables: number;
  occupied_tables: number;
  total_capacity: number;
  available_capacity: number;
  occupied_capacity: number;
}

interface AreaCard {
  id: string;
  name: string;
  capacity: number;
  availableCapacity: number;
  totalTables: number;
  availableTables: number;
  unit: string;
  icon: string;
  desc: string;
}

const AREA_META: Record<string, { displayName: string; icon: string; desc: string; defaultCapacity: number }> = {
  "VIP": {
    displayName: "VIP Room",
    icon: "star",
    desc: "Ruang kedap suara dengan fasilitas privasi penuh, cocok untuk pertemuan bisnis atau momen eksklusif.",
    defaultCapacity: 40,
  },
  "Indoor": {
    displayName: "Indoor Lounge",
    icon: "weekend",
    desc: "Area utama yang luas dengan sofa nyaman dan bebas asap rokok. Cocok untuk bekerja santai atau mengobrol bersama teman.",
    defaultCapacity: 12,
  },
  "Outdoor": {
    displayName: "Outdoor / Patio",
    icon: "deck",
    desc: "Area terbuka hijau yang sejuk, dikelilingi taman asri. Sangat pas untuk bersantai di sore hari.",
    defaultCapacity: 8,
  },
  "Room Smoking": {
    displayName: "Smoking Room",
    icon: "smoking_rooms",
    desc: "Ruangan khusus merokok yang nyaman, dilengkapi dengan sirkulasi udara optimal dan pendingin ruangan.",
    defaultCapacity: 8,
  },
};

export default function FacilitiesSection() {
  const [areas, setAreas] = useState<AreaCard[]>([
    {
      id: "Indoor",
      name: "Indoor Lounge",
      capacity: 12,
      availableCapacity: 12,
      totalTables: 3,
      availableTables: 3,
      unit: "Tempat",
      icon: "weekend",
      desc: "Area utama yang luas dengan sofa nyaman dan bebas asap rokok. Cocok untuk bekerja santai atau mengobrol bersama teman.",
    },
    {
      id: "Outdoor",
      name: "Outdoor / Patio",
      capacity: 8,
      availableCapacity: 8,
      totalTables: 2,
      availableTables: 2,
      unit: "Tempat",
      icon: "deck",
      desc: "Area terbuka hijau yang sejuk, dikelilingi taman asri. Sangat pas untuk bersantai di sore hari.",
    },
    {
      id: "Room Smoking",
      name: "Smoking Room",
      capacity: 8,
      availableCapacity: 8,
      totalTables: 2,
      availableTables: 2,
      unit: "Tempat",
      icon: "smoking_rooms",
      desc: "Ruangan khusus merokok yang nyaman, dilengkapi dengan sirkulasi udara optimal dan pendingin ruangan.",
    },
    {
      id: "VIP",
      name: "VIP Room",
      capacity: 40,
      availableCapacity: 40,
      totalTables: 4,
      availableTables: 4,
      unit: "Tempat",
      icon: "star",
      desc: "Ruang kedap suara dengan fasilitas privasi penuh, cocok untuk pertemuan bisnis atau momen eksklusif.",
    },
  ]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    
    // Ambil data ruangan & kapasitas real-time dari backend
    fetch(`${apiBase}/customer/tables/summary`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((result) => {
        if (result.success && Array.isArray(result.data?.areas)) {
          const apiAreas: AreaSummary[] = result.data.areas;
          
          // Filter hanya ruangan yang didukung admin: VIP, Indoor, Outdoor, Room Smoking
          const mapped: AreaCard[] = apiAreas
            .filter((a) => {
              const key = a.area;
              return Object.keys(AREA_META).some((k) => k.toLowerCase() === key.toLowerCase());
            })
            .map((a) => {
              const matchedKey = Object.keys(AREA_META).find(
                (k) => k.toLowerCase() === a.area.toLowerCase()
              ) || a.area;
              const meta = AREA_META[matchedKey] || {
                displayName: a.area,
                icon: "chair",
                desc: "Area nyaman untuk bersantai dan menikmati kopi bersama teman dan kolega.",
                defaultCapacity: a.total_capacity || 4,
              };

              return {
                id: a.area,
                name: meta.displayName,
                capacity: a.total_capacity || meta.defaultCapacity,
                availableCapacity: a.available_capacity,
                totalTables: a.total_tables,
                availableTables: a.available_tables,
                unit: "Tempat",
                icon: meta.icon,
                desc: meta.desc,
              };
            });

          if (mapped.length > 0) {
            setAreas(mapped);
          }
        }
      })
      .catch(() => {
        // Jika backend belum aktif, tetap tampilkan 4 ruangan admin saja (tanpa Main Bar)
      });
  }, []);

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low relative overflow-hidden pb-32" id="facilities">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-3xl md:text-5xl lg:text-[60px] font-black text-primary mb-4">
            Kapasitas Ruangan
          </h2>
          <p className="font-body-lg font-normal text-on-surface-variant max-w-2xl mx-auto">
            Kami menyediakan pilihan area resmi sesuai konfigurasi yang tersedia untuk menyesuaikan gaya Anda menikmati kopi.
          </p>
        </div>

        {/* Grid 4 Ruangan Admin: VIP, Indoor, Outdoor, Room Smoking */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <div
              key={area.id}
              className="glass-panel rounded-[2rem] p-8 border border-outline/40 hover:border-primary/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div>
                <div className="relative z-10 flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500 shadow-inner">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {area.icon}
                    </span>
                  </div>
                  <div className="text-right glass-panel bg-surface-container-highest/50 border border-outline/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="font-display-lg text-2xl text-on-surface group-hover:text-primary transition-colors font-bold">
                        {area.capacity}
                      </span>
                      <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px] opacity-80 font-bold">
                        {area.unit}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h3 className="relative z-10 font-headline-md text-xl font-extrabold text-on-surface mb-2.5 group-hover:text-primary transition-colors duration-300">
                  {area.name}
                </h3>
                <p className="relative z-10 font-body-md text-xs font-normal text-on-surface-variant leading-relaxed">
                  {area.desc}
                </p>
              </div>

              {/* Status Ketersediaan Sisa Meja & Kursi */}
              <div className="relative z-10 pt-4 mt-4 border-t border-outline/20 flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant font-medium">Sisa Tersedia:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  {area.availableCapacity} Kursi ({area.availableTables} Meja)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
        <svg className="relative block w-full h-[40px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="var(--color-background)"></path>
        </svg>
      </div>
    </section>
  );
}
