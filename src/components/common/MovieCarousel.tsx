import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import MovieCard from '../movie/MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { IconType } from 'react-icons';

interface MovieCarouselProps {
  movies: any[]; // Consider replacing 'any' with your movie type
  title: string;
  icon?: IconType; // Using IconType for Font Awesome icons
  variant?: 'default' | 'trending';
  // New configuration options
  autoplay?: boolean;
  autoplayDelay?: number;
  enableSwipe?: boolean;
  loop?: boolean;
  pauseOnHover?: boolean;
  slidesGap?: number;
}

const MovieCarousel = ({
  movies = [],
  title,
  icon: Icon,
  variant = 'default',
  // Default values for new props
  autoplay = false,
  autoplayDelay = 3000,
  enableSwipe = true,
  loop = false,
  pauseOnHover = true,
  slidesGap,
}: MovieCarouselProps) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);
  const swiperRef = useRef<any>(null);

  // Define slide sizes based on variant
  const getSlideClasses = () => {
    if (variant === 'trending') {
      return "!w-[225px] sm:!w-[250px] md:!w-[320px] lg:!w-[280px] 2xl:!w-[390px]";
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

  // Configure Swiper modules based on props
  const getSwiperModules = () => {
    const modules = [Navigation];
    if (autoplay) {
      modules.push(Autoplay);
    }
    return modules;
  };

  // Configure autoplay settings
  const getAutoplaySettings = () => {
    if (!autoplay) return false;
    return {
      delay: autoplayDelay,
      disableOnInteraction: false,
      pauseOnMouseEnter: pauseOnHover,
    };
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
          modules={getSwiperModules()}
          spaceBetween={slidesGap ?? (variant === 'trending' ? 20 : 16)}
          slidesPerView="auto"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={{
            nextEl: `.swiper-button-next-${title.replace(/\s+/g, '-')}`,
            prevEl: `.swiper-button-prev-${title.replace(/\s+/g, '-')}`,
          }}
          allowTouchMove={enableSwipe}
          loop={loop}
          autoplay={getAutoplaySettings()}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index} className={getSlideClasses()}>
              <MovieCard
                movie={movie}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Improved Navigation Buttons */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm hover:bg-black/90 rounded-lg p-2 md:p-3 shadow-md transition swiper-button-prev-${title.replace(/\s+/g, '-')}`}
          aria-label="Previous"
          style={{ color: 'white' }}
        >
          <FaChevronLeft className={variant === 'trending' ? "w-4 h-4 md:w-5 md:h-5" : "w-3 h-3 md:w-4 md:h-4"} />
        </button>
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm hover:bg-black/90 rounded-lg p-2 md:p-3 shadow-md transition swiper-button-next-${title.replace(/\s+/g, '-')}`}
          aria-label="Next"
          style={{ color: 'white' }}
        >
          <FaChevronRight className={variant === 'trending' ? "w-4 h-4 md:w-5 md:h-5" : "w-3 h-3 md:w-4 md:h-4"} />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;