"use client";
import { useEffect, useState } from 'react';
// @ts-ignore
import FoldText from '../ui/FoldText';

export default function AboutSection() {
  const [settings, setSettings] = useState({
    openTime: "09.00",
    closeTime: "22.00",
    openDays: "Senin - Minggu",
    operationalHours: [
      { day: "Senin", open: "09:00", close: "22:00", isClosed: false },
      { day: "Selasa", open: "09:00", close: "22:00", isClosed: false },
      { day: "Rabu", open: "09:00", close: "22:00", isClosed: false },
      { day: "Kamis", open: "09:00", close: "22:00", isClosed: false },
      { day: "Jumat", open: "09:00", close: "22:00", isClosed: false },
      { day: "Sabtu", open: "09:00", close: "22:00", isClosed: false },
      { day: "Minggu", open: "09:00", close: "22:00", isClosed: false },
    ]
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        let res = await fetch(`${apiBase}/customer/settings`);
        if (!res.ok) res = await fetch(`${apiBase}/admin/settings`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setSettings({
              openTime: (result.data.open_time || "09:00").replace(":", "."),
              closeTime: (result.data.close_time || "22:00").replace(":", "."),
              openDays: result.data.open_days || "Senin - Minggu",
              operationalHours: result.data.operational_hours ? (typeof result.data.operational_hours === 'string' ? JSON.parse(result.data.operational_hours) : result.data.operational_hours) : [
                { day: "Senin", open: "09:00", close: "22:00", isClosed: false },
                { day: "Selasa", open: "09:00", close: "22:00", isClosed: false },
                { day: "Rabu", open: "09:00", close: "22:00", isClosed: false },
                { day: "Kamis", open: "09:00", close: "22:00", isClosed: false },
                { day: "Jumat", open: "09:00", close: "22:00", isClosed: false },
                { day: "Sabtu", open: "09:00", close: "22:00", isClosed: false },
                { day: "Minggu", open: "09:00", close: "22:00", isClosed: false },
              ]
            });
          }
        }
      } catch (e) {
        console.error("Gagal memuat pengaturan operasional", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section id="about" className="relative py-24 px-margin-mobile md:px-margin-desktop bg-surface pb-32">
      <div className="max-w-container-max mx-auto">
        {/* Heritage Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
          <div className="order-2 md:order-1 relative group flex justify-center">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 max-w-sm mx-auto w-full"></div>
            <img
              className="relative w-4/5 md:max-w-sm h-auto rounded-xl shadow-2xl border border-outline-variant/20 z-10 brightness-105 saturate-125 contrast-[1.15] hover:scale-[1.02] transition-transform duration-700"
              data-alt="A moody, high-end editorial style photograph of a barista's hands carefully pouring perfectly textured latte art into a dark ceramic cup."
              src="/assets/Moments.jpeg"
            />
          </div>
          <div className="order-1 md:order-2 mb-12 md:mb-0">
            <h2 className="font-black font-headline-lg text-3xl md:text-5xl lg:text-[60px] text-primary mb-6">
              Warisan Kami
            </h2>
            <div className="mb-6">
              <FoldText
                text="Kami percaya bahwa kopi bukan sekadar minuman, tetapi sebuah pengalaman yang hadir dalam setiap momen. Berawal dari kecintaan terhadap kopi dan keinginan untuk menciptakan tempat yang nyaman, kami menghadirkan pilihan kopi berkualitas dengan cita rasa yang khas dan berkarakter. Setiap biji kopi dipilih dengan penuh perhatian dan diolah melalui proses yang tepat untuk menghasilkan rasa dan aroma terbaik dalam setiap cangkir. Lebih dari sekadar menikmati kopi, kami ingin menjadi ruang untuk bertemu, berbagi cerita, menyelesaikan pekerjaan, atau sekadar beristirahat sejenak dari kesibukan. Karena bagi kami, secangkir kopi yang baik bukan hanya tentang bagaimana rasanya, tetapi juga tentang cerita, suasana, dan momen berharga yang tercipta di setiap kunjungan."
                splitBy="word"
                hinge="top"
                trigger="scroll"
                duration={0.65}
                stagger={0.03}
                perspective={700}
                creaseShading={0.3}
                fontSize={Infinity}
                fontWeight={Infinity}
                color="inherit"
                className="font-body-md font-normal text-on-surface-variant leading-relaxed w-full block"
              />
            </div>
          </div>
        </div>

        {/* Features / Standard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start pt-12 border-t border-outline/40">
          <div className="lg:col-span-4 mb-10 lg:mb-0">
            <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-[48px] font-black text-on-surface leading-[1.1] mb-4 break-words">
              Meningkatkan<br />
              <span className="text-primary italic">Standar</span>
            </h2>
            <p className="font-body-md font-normal text-on-surface-variant">
              Kami tidak sekadar menyajikan kopi; kami menciptakan suasana.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="group glass-panel border border-outline/40 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-primary/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="material-symbols-outlined text-primary text-3xl relative z-10">
                  local_cafe
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] font-extrabold text-on-surface mb-3">
                Biji Kopi Pilihan
              </h4>
              <p className="font-body-md font-normal text-on-surface-variant leading-relaxed">
                Bersumber dari perkebunan pilihan terbaik untuk menghasilkan profil rasa yang khas dan kontras.
              </p>
            </div>
            <div className="group glass-panel border border-outline/40 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-primary/30 transition-all duration-500 delay-100">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="material-symbols-outlined text-primary text-3xl relative z-10">
                  psychology
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] font-extrabold text-on-surface mb-3">
                Barista Ahli
              </h4>
              <p className="font-body-md font-normal text-on-surface-variant leading-relaxed">
                Para peracik yang berdedikasi pada presisi, memastikan setiap tuangan adalah mahakarya estetika.
              </p>
            </div>
            <div className="group glass-panel border border-outline/40 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-primary/30 transition-all duration-500 delay-200">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="material-symbols-outlined text-primary text-3xl relative z-10">
                  weekend
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] font-extrabold text-on-surface mb-3">
                Suasana Estetik
              </h4>
              <p className="font-body-md font-normal text-on-surface-variant leading-relaxed">
                Lingkungan yang trendi dan penuh energi, dirancang bagi penikmat gaya hidup modern.
              </p>
            </div>
          </div>
        </div>

        {/* Jam Operasional Section */}
        <div className="mt-24 pt-12 border-t border-outline/40">
          <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-[2rem] bg-surface-container-high/50 border border-outline/40 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-primary/20 transition-colors duration-500">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-[32px]">
                  schedule
                </span>
              </div>
              <h3 className="font-bold font-headline-lg text-xl md:text-2xl text-on-surface uppercase tracking-widest text-center">
                Jam Operasional
              </h3>
              <p className="font-body-md font-normal text-center text-on-surface-variant mt-3 max-w-sm">
                Kami siap menyambut Anda setiap hari untuk pengalaman kopi terbaik.
              </p>
            </div>

            <ul className="flex flex-col text-base font-body-lg max-w-md mx-auto relative z-10">
              {settings.operationalHours.map((schedule: any) => (
                <li key={schedule.day} className="group/item flex justify-between items-center py-4 border-b border-outline/40 last:border-0 hover:px-4 hover:bg-surface-variant/30 rounded-xl transition-all duration-300 -mx-4 px-4">
                  <span className="text-on-surface-variant group-hover/item:text-primary transition-colors">{schedule.day}</span>
                  <span className={`text-on-surface font-semibold tracking-wider transition-colors ${schedule.isClosed ? 'text-red-500 group-hover/item:text-red-600' : 'group-hover/item:text-primary'}`}>
                    {schedule.isClosed ? 'Tutup' : `${schedule.open.replace(":", ".")} - ${schedule.close.replace(":", ".")}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
        <svg className="relative block w-full h-[40px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="var(--color-surface-container-low)"></path>
        </svg>
      </div>
    </section>
  );
}
