import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import MovieCard from '../Movie/MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const MovieCarousel = ({ movies, title }) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);
  const swiperRef = useRef<any>(null);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 ">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
          <span>{title}</span>
        </h2>
      )}

      <div className="relative">
        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={16} // Adjust the gap between slides
          slidesPerView="auto" // Automatically adjust the number of slides based on container width
          onSwiper={(swiper) => (swiperRef.current = swiper)} // Store Swiper instance
          navigation={{
            nextEl: `.swiper-button-next-${title.replace(/\s+/g, '-')}`, // Unique class for next button
            prevEl: `.swiper-button-prev-${title.replace(/\s+/g, '-')}`, // Unique class for prev button
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index} className="!w-[170px] sm:!w-[220px] md:!w-[240px] lg:!w-[260px]">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 md:p-4 rounded-r-lg transition-opacity swiper-button-prev-${title.replace(/\s+/g, '-')}`}
          style={{ color: 'white' }} // Add visible color
        >
          <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 md:p-4 rounded-l-lg transition-opacity swiper-button-next-${title.replace(/\s+/g, '-')}`}
          style={{ color: 'white' }} // Add visible color
        >
          <FaChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;