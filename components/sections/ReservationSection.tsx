export default function ReservationSection() {
  return (
    <section id="Reservasi" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto glass-panel p-8 md:p-16 rounded-2xl border border-outline/40 relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-headline-lg text-3xl md:text-5xl lg:text-[60px] font-black text-primary mb-2">
            Reservasi Tempat
          </h2>
          <p className="font-body-md font-normal text-on-surface-variant">
            Pesan tempat untuk pengalaman menikmati kopi yang tak terlupakan.
          </p>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                className="w-full bg-white/5 border border-outline/40 rounded-xl text-on-surface font-body-md px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-on-surface-variant/60 backdrop-blur-md"
                id="name"
                placeholder="Nama Lengkap"
                type="text"
              />
            </div>
            <div className="relative">
              <input
                className="w-full bg-white/5 border border-outline/40 rounded-xl text-on-surface font-body-md px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-on-surface-variant/60 backdrop-blur-md"
                id="email"
                placeholder="Alamat Email"
                type="email"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                className="w-full bg-white/5 border border-outline/40 rounded-xl text-on-surface font-body-md px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-on-surface-variant/60 backdrop-blur-md [color-scheme:light]"
                id="date"
                type="date"
              />
            </div>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-outline/40 rounded-xl text-on-surface font-body-md px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none backdrop-blur-md"
                id="guests"
                defaultValue="2"
              >
                <option className="bg-surface-container-high text-on-surface" value="1">
                  1 Orang
                </option>
                <option className="bg-surface-container-high text-on-surface" value="2">
                  2 Orang
                </option>
                <option className="bg-surface-container-high text-on-surface" value="3">
                  3 Orang
                </option>
                <option className="bg-surface-container-high text-on-surface" value="4+">
                  4+ Orang
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="relative">
            <textarea
              className="w-full bg-white/5 border border-outline/40 rounded-xl text-on-surface font-body-md px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-on-surface-variant/60 backdrop-blur-md resize-none"
              id="description"
              placeholder="Catatan Khusus / Deskripsi (Opsional)"
              rows={4}
            ></textarea>
          </div>
          <div className="pt-6 text-center">
            <button
              className="bg-primary/10 backdrop-blur-md border border-primary/50 text-primary font-label-bold px-12 py-4 rounded-full transition-all duration-300 hover:bg-primary/20 hover:-translate-y-1 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] w-full md:w-auto"
              type="submit"
            >
              Konfirmasi Reservasi
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
