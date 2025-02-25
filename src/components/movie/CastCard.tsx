import React from 'react';
import { MyTooltip } from '../ui/MyTooltip';
import Link from 'next/link';

const CastCard = ({ imgSrc, name, role,castId }:any) => {
  const fallBackImageUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  return (
    <MyTooltip content={role ? `${name} as ${role}` : name}>
    <Link href={`/movies/cast/${castId}`}>
      <div className="group relative overflow-hidden rounded-lg bg-gray-900/40 transition-all duration-300 hover:bg-gray-900/60 hover:ring-1 hover:ring-gray-700">
        {/* Image Container - Smaller aspect ratio for mobile */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={imgSrc || fallBackImageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info Section - Compact for mobile */}
        <div className="relative p-2">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/0" />
          
          {/* Content - Smaller text for mobile */}
          <div className="relative">
            <h3 className="truncate text-xs font-medium leading-tight text-white">
              {name}
            </h3>
            {role && (
              <p className="mt-0.5 truncate text-xs text-gray-400">
                {role}
              </p>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  </MyTooltip>
  );
};

export default CastCard;