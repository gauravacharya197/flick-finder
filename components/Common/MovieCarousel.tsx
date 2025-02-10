import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import MovieCard from '../Movie/MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { IconType } from 'react-icons';

interface MovieCarouselProps {
  movies: any[];  // Consider replacing 'any' with your movie type
  title: string;
  icon?: IconType;  // Using IconType for Font Awesome icons
  variant?: 'default' | 'trending';
}

const MovieCarousel = ({ 
  movies = [], 
  title, 
  icon: Icon,
  variant = 'default'
}: MovieCarouselProps) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);
  const swiperRef = useRef<any>(null);

  // Define slide sizes based on variant
  const getSlideClasses = () => {
    if (variant === 'trending') {
      return "!w-[190px] sm:!w-[250px] md:!w-[320px] lg:!w-[280px] 2xl:!w-[320px]";
    }
    return "!w-[170px] sm:!w-[220px] md:!w-[240px] lg:!w-[260px]";
  };

  // Adjust container padding for trending variant
  const getContainerClasses = () => {
    const baseClasses = "px-4 lg:px-12 2xl:px-48";
    return variant === 'trending' 
      ? `${baseClasses} py-10` 
      : `${baseClasses} py-8`;
  };

  // Adjust heading size for trending variant
  const getHeadingClasses = () => {
    const baseClasses = "font-semibold";
    return variant === 'trending'
      ? `${baseClasses} text-2xl`
      : `${baseClasses} text-xl`;
  };

  return (
    <div className={getContainerClasses()}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && (
            <Icon 
              className={variant === 'trending' ? "w-7 h-7" : "w-6 h-6"} 
            />
          )}
          <h2 className={getHeadingClasses()}>{title}</h2>
        </div>
      )}

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={variant === 'trending' ? 20 : 16}
          slidesPerView="auto"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={{
            nextEl: `.swiper-button-next-${title.replace(/\s+/g, '-')}`,
            prevEl: `.swiper-button-prev-${title.replace(/\s+/g, '-')}`,
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index} className={getSlideClasses()}>
              <MovieCard 
                movie={movie}
                
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 md:p-4 rounded-r-lg transition-opacity swiper-button-prev-${title.replace(/\s+/g, '-')}`}
          style={{ color: 'white' }}
        >
          <FaChevronLeft className={variant === 'trending' ? "w-4 h-4 md:w-5 md:h-5" : "w-3 h-3 md:w-4 md:h-4"} />
        </button>
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 md:p-4 rounded-l-lg transition-opacity swiper-button-next-${title.replace(/\s+/g, '-')}`}
          style={{ color: 'white' }}
        >
          <FaChevronRight className={variant === 'trending' ? "w-4 h-4 md:w-5 md:h-5" : "w-3 h-3 md:w-4 md:h-4"} />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;