"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

const HERO_SLIDES = [
  {
    id: 1,
    title: "টাটকা ইলিশের মেলা",
    subtitle: "সরাসরি নদী থেকে আপনার পাতে",
    image:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=1200&q=80",
    color: "from-blue-600/90",
  },
  {
    id: 2,
    title: "রেডি-টু-কুক চিংড়ি",
    subtitle: "কাটার ঝামেলা নেই, শুধুই রান্না",
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200&q=80",
    color: "from-emerald-600/90",
  },
  {
    id: 3,
    title: "পাবদা ও টেংরা",
    subtitle: "শীতের স্পেশাল কালেকশন",
    image:
      "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1200&q=80",
    color: "from-orange-600/90",
  },
];

export default function HeroSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="relative flex-[0_0_100%] min-w-0">
                {/* Responsive Aspect Ratio */}
                <div className="relative aspect-video md:aspect-21/9 w-full overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t md:bg-linear-to-r ${slide.color} via-black/40 to-transparent opacity-90`}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full md:w-2/3">
                    <h3 className="text-xl md:text-4xl font-bold leading-tight mb-2 md:mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-sm md:text-xl opacity-90 mb-4 md:mb-6">
                      {slide.subtitle}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="md:h-10 md:px-6 md:text-base"
                    >
                      এখনই কিনুন
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
