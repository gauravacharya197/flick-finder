import React from 'react';
import { MyTooltip } from '../ui/MyTooltip';
import Link from 'next/link';

interface CastCardProps {
  imgSrc?: string;
  name: string;
  role?: string;
  castId: string | number;
}

const CastCard = ({ imgSrc, name, role, castId }: CastCardProps) => {
  const fallBackImageUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  return (
    <MyTooltip 
      className='text-xs' 
      content={role ? `${name} as ${role}` : name}
    >
      <Link href={`/movies/cast/${castId}`} className="block">
        <div className="group relative overflow-hidden rounded-lg bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:bg-gray-900/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20">
          {/* Image Container - Optimized aspect ratios */}
          <div className="aspect-[3/4] sm:aspect-[2/3] overflow-hidden">
            <img
              src={imgSrc || fallBackImageUrl}
              alt={name}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallBackImageUrl;
              }}
            />
          </div>

          {/* Compact Info Section */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-1.5 sm:p-2">
            <div className="space-y-0.5">
              <h3 className="text-[10px] sm:text-xs font-semibold leading-tight text-white line-clamp-1">
                {name}
              </h3>
              {role && (
                <p className="text-[9px] sm:text-xs text-gray-300/90 line-clamp-1 font-medium">
                  {role}
                </p>
              )}
            </div>
          </div>

          {/* Subtle hover indicator */}
          <div className="absolute top-1 right-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </Link>
    </MyTooltip>
  );
};

export default CastCard;