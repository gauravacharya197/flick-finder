import React from 'react';
import { FaCheck, FaCog } from 'react-icons/fa';
import { IoArrowBack } from "react-icons/io5";

interface SettingsMenuProps {
  showSettingsMenu: boolean;
  showSpeedMenu: boolean;
  showQualityMenu: boolean;
  selectedSpeed: number;
  selectedQuality: string;
  speedOptions: number[];
  qualities: string[];
  onToggleSettings: () => void;
  onToggleSpeedMenu: () => void;
  onToggleQualityMenu: () => void;
  onSpeedChange: (speed: number) => void;
  onQualityChange: (quality: string) => void;
  onBackFromSpeed: () => void;
  onBackFromQuality: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  showSettingsMenu,
  showSpeedMenu,
  showQualityMenu,
  selectedSpeed,
  selectedQuality,
  speedOptions,
  qualities,
  onToggleSettings,
  onToggleSpeedMenu,
  onToggleQualityMenu,
  onSpeedChange,
  onQualityChange,
  onBackFromSpeed,
  onBackFromQuality
}) => {
  return (
<div className="relative mr-4 sm:mr-6">
  <button 
    id="settings-button"
    onClick={onToggleSettings}
    className="focus:outline-none transition-colors flex items-center justify-center h-8 w-8"
    aria-label="Settings"
  >
    <FaCog size={25} className={showSettingsMenu ? "animate-spin-slow" : ""} />
  </button>
  
  {showSettingsMenu && (
    <div 
      id="settings-menu"
      className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-md overflow-hidden shadow-xl w-48 sm:w-52 transform origin-bottom-right scale-100 transition-all duration-150"
      style={{ 
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100vh - 80px)',
        zIndex: 50
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {!showSpeedMenu && !showQualityMenu && (
        <>
          <div className="px-3 sm:px-4 py-2 bg-gray-800/70 text-white/90 font-medium border-b border-gray-700/60 text-sm sm:text-base">
            Settings
          </div>
          <div className="max-h-56 sm:max-h-72 overflow-y-auto">
            <div 
              className="px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer flex items-center justify-between text-white hover:bg-white/10 text-sm sm:text-base"
              onClick={onToggleSpeedMenu}
            >
              <span>Speed</span>
              <span className="text-gray-400 text-xs sm:text-sm">{selectedSpeed}x</span>
            </div>
            <div 
              className="px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer flex items-center justify-between text-white hover:bg-white/10 text-sm sm:text-base"
              onClick={onToggleQualityMenu}
            >
              <span>Quality</span>
              <span className="text-gray-400 text-xs sm:text-sm">{selectedQuality}</span>
            </div>
          </div>
        </>
      )}
      
      {showSpeedMenu && (
        <>
          <div 
            className="px-3 sm:px-4 py-2 bg-gray-800/70 text-white/90 text-xs sm:text-sm font-medium border-b border-gray-700/60 flex items-center"
          >
            <button 
              className="mr-2 text-white hover:text-gray-300"
              onClick={onBackFromSpeed}
              aria-label="Back to settings"
            >
              <IoArrowBack size={16}/>
            </button>
            <span>Playback Speed</span>
          </div>
          <div className="max-h-56 sm:max-h-72 overflow-y-auto">
            {speedOptions.map((speed) => (
              <div 
                key={speed}
                className={`px-3 sm:px-4 py-2 cursor-pointer flex items-center justify-between text-sm sm:text-base ${
                  selectedSpeed === speed ? 'bg-gray-700/50' : 'hover:bg-white/10'
                }`}
                onClick={() => onSpeedChange(speed)}
              >
                <span className="text-white">{speed}x</span>
                {selectedSpeed === speed && <FaCheck size={14} className="ml-2 sm:ml-4 text-white" />}
              </div>
            ))}
          </div>
        </>
      )}
      
      {showQualityMenu && (
        <>
          <div 
            className="px-3 sm:px-4 py-2 bg-gray-800/70 text-white/90 text-xs sm:text-sm font-medium border-b border-gray-700/60 flex items-center"
          >
            <button 
              className="mr-2 text-white hover:text-gray-300"
              onClick={onBackFromQuality}
              aria-label="Back to settings"
            >
              <IoArrowBack size={16}/>
            </button>
            <span>Quality</span>
          </div>
          <div className="max-h-56 sm:max-h-72 overflow-y-auto">
            {qualities.map((quality) => (
              <div 
                key={quality}
                className={`px-3 sm:px-4 py-2 cursor-pointer flex items-center justify-between text-sm sm:text-base ${
                  selectedQuality === quality ? 'bg-gray-700/50' : 'hover:bg-white/10'
                }`}
                onClick={() => onQualityChange(quality)}
              >
                <span className="text-white">{quality}</span>
                {selectedQuality === quality && <FaCheck size={14} className="ml-2 sm:ml-4 text-white" />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )}
</div>
  );
};

export default SettingsMenu;