import SpotlightCard from '../ui/SpotlightCard';

export default function MenuSection() {
  return (
    <section
      className="py-24 px-margin-mobile md:px-margin-desktop bg-background pb-32 relative"
      id="menu"
    >
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-black text-primary mb-4 italic">
            Signature Creations
          </h2>
          <p className="font-body-lg font-normal text-on-surface-variant max-w-2xl mx-auto">
            A curated selection of our most bold and striking beverages.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Menu Item 1 */}
          <SpotlightCard className="h-full">
            <div className="flex flex-col h-full">
              <div className="aspect-[4/5] w-full overflow-hidden relative shrink-0">
                <img
                  className="w-full h-full object-cover brightness-105 saturate-110"
                  data-alt="A close-up, dramatic shot of a double shot of espresso in a minimalist matte black cup."
                  src="/assets/Menu/MatchaPistachio.jpeg"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-primary italic px-4 py-1.5 rounded-full text-sm shadow-sm border border-white/20" style={{fontWeight: 400}}>
                  Rp 55.000
                </div>
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline-md text-xl md:text-[24px] font-bold text-primary leading-tight">
                    The Coffee Shop Matcha Pistachio
                  </h3>
                </div>
                <p className="text-sm italic font-light text-on-surface-variant mb-6 flex-grow leading-relaxed" style={{fontWeight: 300}}>
                  Perpaduan elegan matcha premium dan pistachio panggang dengan creamy-nya susu segar, menciptakan sensasi rasa yang kaya dan berkarakter.
                </p>
                <div className="flex gap-2 pt-4 border-t border-outline/20 mt-auto">
                  <span className="bg-primary/5 text-primary font-bold px-3 py-1.5 rounded-full border border-primary/20 tracking-wider uppercase text-[11px]">
                    ✨ Signature
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
          
          {/* Menu Item 2 */}
          <SpotlightCard className="h-full">
            <div className="flex flex-col h-full">
              <div className="aspect-[4/5] w-full overflow-hidden relative shrink-0">
                <img
                  className="w-full h-full object-cover brightness-105 saturate-110"
                  data-alt="A tall, elegant glass of iced latte resting on a textured concrete surface."
                  src="/assets/Menu/CoffeMagic.jpeg"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-primary italic px-4 py-1.5 rounded-full text-sm shadow-sm border border-white/20" style={{fontWeight: 400}}>
                  Rp 32.000
                </div>
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline-md text-xl md:text-[24px] font-bold text-primary leading-tight">
                    Coffee Magic
                  </h3>
                </div>
                <p className="text-sm italic font-light text-on-surface-variant mb-6 flex-grow leading-relaxed" style={{fontWeight: 300}}>
                  Ekstrak espresso murni yang disempurnakan dengan kelembutan susu rahasia kami. Memberikan magis di setiap tegukan.
                </p>
                <div className="flex gap-2 pt-4 border-t border-outline/20 mt-auto">
                  <span className="bg-secondary/10 text-secondary font-bold px-3 py-1.5 rounded-full border border-secondary/20 tracking-wider uppercase text-[11px]">
                    🔥 Best Seller
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
          
          {/* Menu Item 3 */}
          <SpotlightCard className="h-full">
            <div className="flex flex-col h-full">
              <div className="aspect-[4/5] w-full overflow-hidden relative shrink-0">
                <img
                  className="w-full h-full object-cover brightness-105 saturate-110"
                  data-alt="A unique, artistic presentation of a signature coffee mocktail."
                  src="/assets/Menu/Sweet&Cream.jpeg"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-primary italic px-4 py-1.5 rounded-full text-sm shadow-sm border border-white/20" style={{fontWeight: 400}}>
                  Rp 37.000
                </div>
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline-md text-xl md:text-[24px] font-bold text-primary leading-tight">
                    Sweet & Creamy
                  </h3>
                </div>
                <p className="text-sm italic font-light text-on-surface-variant mb-6 flex-grow leading-relaxed" style={{fontWeight: 300}}>
                  Kelezatan manis dengan sentuhan lembut krim yang memanjakan lidah. Pilihan sempurna untuk mencerahkan hari Anda.
                </p>
                <div className="flex gap-2 pt-4 border-t border-outline/20 mt-auto">
                  <span className="bg-[#2a9d8f]/10 text-[#2a9d8f] font-bold px-3 py-1.5 rounded-full border border-[#2a9d8f]/20 tracking-wider uppercase text-[11px]">
                    🌟 New Arrival
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
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
