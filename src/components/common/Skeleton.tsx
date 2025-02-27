import React from 'react';

const Skeleton = ({ 
  className = '',
  rows = 3,
  rowWidths = [], // Custom widths for each row
  showTitle = true,
  animate = true,
  titleHeight = 'h-6',
  rowHeight = 'h-4',
  spacing = 'space-y-4'
}) => {
  // Default animation class
  const animationClass = animate ? 'animate-pulse' : '';
  
  // Default background color that matches your app theme
  const defaultBgColor = 'bg-gray-700/30';
  
  // Generate row widths if not provided
  const getRowWidth = (index:any) => {
    if (rowWidths[index]) return rowWidths[index];
    return index < Math.ceil(rows / 2) ? 'w-full' : 'w-2/3';
  };

  return (
    <div className={`${animationClass} ${spacing} ${className}`}>
      {/* Title skeleton */}
      {showTitle && (
        <div 
          className={`${defaultBgColor} ${titleHeight} rounded-md w-3/4`}
        />
      )}
      
      {/* Content rows */}
      <div className={`${spacing} `}>
        {[...Array(rows)].map((_, index) => (
          <div
            key={index}
            className={`${defaultBgColor} ${rowHeight} rounded-md ${getRowWidth(index)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Skeleton;