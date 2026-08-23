export default function FeaturesSection() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline/40">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-4 mb-10 lg:mb-0 min-w-0">
            <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-[48px] font-black text-on-surface leading-[1.1] mb-4 break-words">
              Meningkatkan<br />
              <span className="text-primary italic">Standar</span>
            </h2>
            <p className="font-body-md font-normal text-on-surface-variant">
              Kami tidak sekadar menyajikan kopi; kami menciptakan suasana.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Feature 1 */}
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
              <p className="font-body-sm font-normal text-on-surface-variant leading-relaxed">
                Dipanen dari perkebunan elit yang berkelanjutan untuk profil rasa
                yang khas dan berkarakter kuat.
              </p>
            </div>
            {/* Feature 2 */}
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
              <p className="font-body-sm font-normal text-on-surface-variant leading-relaxed">
                Dibuat oleh peracik kopi dengan presisi tinggi, memastikan setiap
                tuangan adalah sebuah karya seni esterik.
              </p>
            </div>
            {/* Feature 3 */}
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
              <p className="font-body-sm font-normal text-on-surface-variant leading-relaxed">
                Lingkungan premium yang nyaman dan trendi, dirancang khusus untuk
                menikmati momen dan gaya hidup urban.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
