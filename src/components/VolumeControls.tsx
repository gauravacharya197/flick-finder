import React, { useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  showControls: boolean;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  onDragStart,
  onDragEnd,
  showControls
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeBarRef = React.useRef<HTMLDivElement>(null);

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const volumeBar = volumeBarRef.current;
    if (!volumeBar) return;

    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const rect = volumeBar.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    
    onVolumeChange(pos);
  };

  const startVolumeChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    onDragStart();
    handleVolumeChange(e);
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const mouseEvent = e as MouseEvent;
      const touchEvent = e as TouchEvent;
      
      const eventWithClientX = 'touches' in touchEvent 
        ? { touches: [{ clientX: touchEvent.touches[0].clientX }] } as any
        : { clientX: mouseEvent.clientX } as React.MouseEvent<HTMLDivElement>;
      
      handleVolumeChange(eventWithClientX);
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

  return (
    <div 
      className="relative flex items-center mr-6"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <button 
        onClick={onToggleMute}
        className="text-white focus:outline-none hover:text-gray-300 transition-colors flex items-center justify-center h-8 w-8"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
      </button>
      
      <div 
        className={`ml-2 w-20 h-1.5 bg-gray-700 rounded-full relative cursor-pointer ${showVolumeSlider ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity duration-200`}
        ref={volumeBarRef}
        onClick={handleVolumeChange}
        onMouseDown={startVolumeChange}
        onTouchStart={startVolumeChange}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{ width: `${isMuted ? 0 : volume * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
        </div>
      </div>
    </div>
  );
};

export default VolumeControl;