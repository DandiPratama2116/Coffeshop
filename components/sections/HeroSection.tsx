export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-24 px-margin-mobile md:px-margin-desktop overflow-hidden bg-black"
      id="home"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-80"
          data-alt="A striking, high-contrast, wide-angle cinematic shot of dark roasted espresso beans mid-air, with a splash of rich, dark coffee."
          style={{
            backgroundImage: `url('/assets/Latarbgcoffe_HD.jpg')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Subtle glowing orb */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-pulse" style={{ animationDuration: '4s' }}></div>
      </div>
      <div className="relative z-10 w-full max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter pb-32">
        <div className="md:col-span-8 flex flex-col items-start justify-center">
          <h1 className="font-display-lg font-black text-4xl sm:text-5xl md:text-6xl lg:text-display-lg text-white mb-6 leading-tight">
            Nikmati <br className="" />
            <span className="text-white italic font-bold-extra tracking-tighter">
              Kopi Terbaik
            </span>{" "}
            <br className="" />
            <span style={{ color: '#1784e9c1' }}>di Coffee Shop</span>
          </h1>
          <p className="font-body-lg text-base md:text-lg text-white/90 max-w-lg mb-10 leading-relaxed">
            Tempat terbaik untuk menikmati kopi berkualitas tinggi dengan cita rasa istimewa suasana yang nyaman, berkarakter, dan penuh cerita. Lebih dari sekadar café.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#Reservasi" className="inline-block text-center bg-white/10 backdrop-blur-md border border-white/30 text-white font-label-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Reservasi Sekarang
            </a>  
          </div>
        </div>
      </div>
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
        <svg className="relative block w-full h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="var(--color-background)"></path>
        </svg>
      </div>
    </section>
  );
}
