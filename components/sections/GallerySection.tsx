import AccordionGallery, { AccordionItem } from '../ui/AccordionGallery';

export default function GallerySection() {
  const galleryItems: AccordionItem[] = [
    { image: '/assets/img1.jpeg', label: 'Suasana Nyaman'},
    { image: '/assets/img2.jpeg', label: 'Dengan baragam' },
    { image: '/assets/img3.jpeg', label: 'Estetika Ruang' },
    { image: '/assets/img4.jpeg', label: 'Momen Bersama' },
    { image: '/assets/img5.jpeg', label: 'Kopi Pilihan' }
  ];

  return (
    <section
      className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low pb-32 relative"
      id="gallery"
    >
      <div className="max-w-container-max mx-auto">
        <h2 className="font-headline-lg text-3xl md:text-5xl lg:text-[60px] font-black text-primary text-center mb-10 md:mb-16 italic">
          The Experience
        </h2>
        <div className="w-full">
          <AccordionGallery
            items={galleryItems}
            defaultIndex={2}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#1e3a8a"
          />
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
        <svg className="relative block w-full h-[40px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="var(--color-surface)"></path>
        </svg>
      </div>
    </section>
  );
}
