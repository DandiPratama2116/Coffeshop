export default function FacilitiesSection() {
  const areas = [
    {
      id: 1,
      name: "Indoor Lounge",
      capacity: 8,
      unit: "Tempat",
      icon: "weekend",
      desc: "Area utama yang luas dengan sofa nyaman dan bebas asap rokok. Cocok untuk bekerja santai atau mengobrol bersama teman.",
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      id: 2,
      name: "Outdoor / Patio",
      capacity: 4,
      unit: "Tempat",
      icon: "deck",
      desc: "Area terbuka hijau yang sejuk, dikelilingi taman asri. Sangat pas untuk bersantai di sore hari.",
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      id: 3,
      name: "Smoking Room",
      capacity: 4,
      unit: "Tempat",
      icon: "smoking_rooms",
      desc: "Ruangan khusus merokok yang nyaman, dilengkapi dengan sirkulasi udara optimal dan pendingin ruangan.",
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      id: 4,
      name: "VIP Room",
      capacity: 8,
      unit: "Tempat",
      icon: "star",
      desc: "Ruang kedap suara dengan fasilitas privasi penuh, cocok untuk pertemuan bisnis atau momen eksklusif.",
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      id: 5,
      name: "Main Bar",
      capacity: 10,
      unit: "Tempat",
      icon: "local_cafe",
      desc: "Berinteraksi langsung dengan para barista ahli kami sambil menikmati proses penyeduhan kopi yang estetik.",
      colSpan: "md:col-span-1 lg:col-span-1",
    },
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low relative overflow-hidden pb-32" id="facilities">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-3xl md:text-5xl lg:text-[60px] font-black text-primary mb-4">
            Kapasitas Ruangan
          </h2>
          <p className="font-body-lg font-normal text-on-surface-variant max-w-2xl mx-auto">
            Kami menyediakan berbagai pilihan area untuk menyesuaikan dengan kebutuhan dan gaya Anda menikmati kopi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div
              key={area.id}
              className={`glass-panel rounded-[2rem] p-8 border border-outline/40 hover:border-primary/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group relative overflow-hidden ${area.colSpan}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex justify-between items-start mb-10">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500 shadow-inner">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {area.icon}
                  </span>
                </div>
                <div className="text-right glass-panel bg-surface-container-highest/50 border border-outline/40 px-5 py-2 rounded-full backdrop-blur-md shadow-sm">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="font-display-lg text-3xl text-on-surface group-hover:text-primary transition-colors">
                      {area.capacity}
                    </span>
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-1 opacity-80">
                      {area.unit}
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="relative z-10 font-headline-md text-[24px] font-extrabold text-on-surface mb-3 group-hover:text-primary transition-colors duration-300">
                {area.name}
              </h3>
              <p className="relative z-10 font-body-md font-normal text-on-surface-variant leading-relaxed">
                {area.desc}
              </p>
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
