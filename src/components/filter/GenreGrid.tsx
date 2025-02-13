import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import Link from 'next/link';

interface Genre {
  id: number;
  name: string;
  externalId: number;
}

interface GenreGridProps {
  genres: Genre[];
}

const GenreGrid: React.FC<GenreGridProps> = ({ genres }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search genres..."
            className="pl-10 pr-4 py-2 focus:ring-primary w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredGenres.length > 0 ? (
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={12}
          slidesPerView="auto"
          freeMode={true}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          className="w-full"
        >
          {filteredGenres.map((genre) => (
            <SwiperSlide 
              key={genre.id}
              className="!w-auto"
            >
<Link href={`genre/${encodeURIComponent(genre?.name?.toLowerCase().replace(/\s+/g, '-') || '')}`}>

                <div
                  className="px-4 py-2 border-2 border-black rounded-lg bg-transparent
                    text-black hover:bg-white/10 transition-colors duration-200 cursor-pointer dark:text-white dark:border-white"
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    {genre.name}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center py-10 text-gray-400">
          No genres found matching your search.
        </div>
      )}
    </div>
  );
};

export default GenreGrid;