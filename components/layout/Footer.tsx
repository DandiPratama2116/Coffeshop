export default function Footer() {
  return (
    <footer
      className="bg-[#0a0f1c] border-t border-white/5 w-full pt-24 pb-8 px-margin-mobile md:px-margin-desktop relative overflow-hidden"
      id="find-us"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-md animate-pulse"></div>
                  <img
                    alt="Coffee Shop Logo"
                    className="h-14 w-14 rounded-full object-cover border-2 border-white/20 relative z-10"
                    src="/assets/Coffeshoplogo.jpeg"
                  />
                </div>
                <span className="font-display-lg text-4xl text-white tracking-tighter drop-shadow-md">
                  Coffee Shop
                </span>
              </div>
              <p className="font-body-lg text-white/70 max-w-sm leading-relaxed mb-8 italic">
                "Two buildings, two vibes, one complete coffee experience. Coffee, food, and good moments — all in one place."
              </p>
            </div>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-headline-md text-lg text-white mb-6 uppercase tracking-widest flex items-center gap-2 drop-shadow-sm">
              <span className="w-8 h-[2px] bg-white/30"></span> Explore
            </h4>
            <ul className="space-y-4 font-label-bold text-white/60">
              {[
                { name: 'Our Story', href: '#home' },
                { name: 'Menu', href: '#menu' },
                { name: 'Experience', href: '#gallery' },
                { name: 'Find Us', href: '#find-us' },
              ].map((link) => (
                <li key={link.name} className="group">
                  <a
                    className="inline-flex items-center gap-2 hover:text-white transition-all duration-300 group-hover:translate-x-2"
                    href={link.href}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/0 group-hover:bg-white transition-colors duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-headline-md text-lg text-white mb-6 uppercase tracking-widest flex items-center gap-2 drop-shadow-sm">
              <span className="w-8 h-[2px] bg-white/30"></span> Legal
            </h4>
            <ul className="space-y-4 font-label-bold text-white/60">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Press Kit',
                'Careers',
              ].map((item) => (
                <li key={item} className="group">
                  <a
                    className="inline-flex items-center gap-2 hover:text-white transition-all duration-300 group-hover:translate-x-2"
                    href="#"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/0 group-hover:bg-white transition-colors duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-headline-md text-lg text-white mb-6 uppercase tracking-widest flex items-center gap-2 drop-shadow-sm">
              <span className="w-8 h-[2px] bg-white/30"></span> Kunjungi
            </h4>
            
            <div className="space-y-6">
              <div
                className="flex gap-4 items-start group cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300">
                  <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors duration-300">
                    location_on
                  </span>
                </div>
                <address className="font-body-md text-white/60 group-hover:text-white transition-colors duration-300 not-italic leading-relaxed pt-1">
                  Jl. Alamat Demo No. 123, Kota Demo, Provinsi Demo 12345
                </address>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-sm text-white/40 uppercase tracking-widest flex items-center gap-2 text-center md:text-left">
            © 2026 Coffee Shop. <span className="hidden md:inline">All Rights Reserved.</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
            <p className="font-label-sm text-white/80 uppercase tracking-widest font-bold drop-shadow-md">
              High-Contrast Boldness.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
