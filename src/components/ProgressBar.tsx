import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  isDragging: boolean;
  onProgressChange: (percent: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  showControls: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  buffered,
  isDragging,
  onProgressChange,
  onDragStart,
  onDragEnd,
  showControls
}) => {
  const progressBarRef = React.useRef<HTMLDivElement>(null);

const handleProgressClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  console.log('Progress click detected');
  if (!progressBarRef.current) {
    console.error('Progress bar ref not set');
    return;
  }
  
  const rect = progressBarRef.current.getBoundingClientRect();
  console.log('Progress bar dimensions:', rect);
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  console.log('Click position:', clientX);
  
  const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  console.log('Calculated position:', pos);
  
  onProgressChange(pos);
};

  const startProgressDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    onDragStart();
    handleProgressClick(e);
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const mouseEvent = e as MouseEvent;
      const touchEvent = e as TouchEvent;
      
      const eventWithClientX = 'touches' in touchEvent 
        ? { touches: [{ clientX: touchEvent.touches[0].clientX }] } as any
        : { clientX: mouseEvent.clientX } as React.MouseEvent<HTMLDivElement>;
      
      handleProgressClick(eventWithClientX);
    };
    
    const handleEnd = () => {
      onDragEnd();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
   
      <div 
        ref={progressBarRef}
        className="w-full h-1.5  bg-gray-700 hover:h-2.5 cursor-pointer mb-4 rounded-full relative transition-all duration-150"
        onClick={handleProgressClick}
        onMouseDown={startProgressDrag}
        onTouchStart={startProgressDrag}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-gray-500 rounded-full"
          style={{ width: `${buffered}%` }}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 "></div>
        </div>
      </div>
   
  );
};

export default ProgressBar;