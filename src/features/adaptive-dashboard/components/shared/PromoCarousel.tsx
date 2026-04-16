import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Promo {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  bgColor: string;
  icon: string;
}

const DEFAULT_PROMOS: Promo[] = [
  {
    id: '1',
    title: 'Diskon 50%',
    description: 'Untuk perjalanan pertama Anda',
    discount: '50%',
    code: 'FIRST50',
    bgColor: 'from-blue-500 to-blue-600',
    icon: '🎉',
  },
  {
    id: '2',
    title: 'Gratis Ongkir',
    description: 'Pengiriman gratis hari ini',
    discount: 'GRATIS',
    code: 'FREEONGKIR',
    bgColor: 'from-green-500 to-green-600',
    icon: '🚀',
  },
  {
    id: '3',
    title: 'Cashback 20%',
    description: 'Setiap transaksi Anda',
    discount: '20%',
    code: 'CASHBACK20',
    bgColor: 'from-purple-500 to-purple-600',
    icon: '💰',
  },
];

interface PromoCarouselProps {
  promos?: Promo[];
  isMobile?: boolean;
  autoPlay?: boolean;
}

export const PromoCarousel = ({
  promos = DEFAULT_PROMOS,
  isMobile = false,
  autoPlay = true,
}: PromoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [promos.length, autoPlay]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  if (isMobile) {
    return (
      <div className="px-4 py-4">
        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {promos.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0">
                  <div
                    className={`bg-gradient-to-r ${promo.bgColor} rounded-xl p-6 text-white relative overflow-hidden`}
                  >
                    <div className="absolute top-4 right-4 text-3xl">{promo.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                    <p className="text-sm text-white/90 mb-4">{promo.description}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-white/75">Kode Promo</p>
                        <p className="text-sm font-bold font-mono">{promo.code}</p>
                      </div>
                      <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-xs font-medium transition">
                        Gunakan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to promo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-t border-b py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {promos.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0">
                  <div
                    className={`bg-gradient-to-r ${promo.bgColor} rounded-lg p-8 text-white relative overflow-hidden min-h-48 flex items-end`}
                  >
                    <div className="absolute top-8 right-8 text-6xl opacity-20">{promo.icon}</div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                      <p className="text-white/90 mb-4">{promo.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/75">Kode Promo</p>
                          <p className="text-xl font-bold font-mono">{promo.code}</p>
                        </div>
                        <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition">
                          Gunakan Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
            aria-label="Previous promo"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition"
            aria-label="Next promo"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to promo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
