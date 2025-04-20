import React from 'react';
import { FaCheck, FaCog } from 'react-icons/fa';

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
    <div className="relative mr-6">
      <button 
        id="settings-button"
        onClick={onToggleSettings}
        className="text-white focus:outline-none hover:text-gray-300 transition-colors flex items-center justify-center h-8 w-8"
        aria-label="Settings"
      >
        <FaCog size={20} className={showSettingsMenu ? "animate-spin-slow" : ""} />
      </button>
      
      {showSettingsMenu && (
        <div 
          id="settings-menu"
          className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-md overflow-hidden shadow-xl min-w-40 transform origin-bottom-right scale-95 transition-all duration-150"
        >
          {!showSpeedMenu && !showQualityMenu && (
            <>
              <div className="px-3 py-2 bg-gray-800/70 text-white/90 text-sm font-medium border-b border-gray-700/60">
                Settings
              </div>
              <div 
                className="px-4 py-2.5 cursor-pointer flex items-center justify-between text-white hover:bg-white/10"
                onClick={onToggleSpeedMenu}
              >
                <span> Speed</span>
                <span className="text-gray-400 text-sm">{selectedSpeed}x</span>
              </div>
              <div 
                className="px-4 py-2.5 cursor-pointer flex items-center justify-between text-white hover:bg-white/10"
                onClick={onToggleQualityMenu}
              >
                <span>Quality</span>
                <span className="text-gray-400 text-sm">{selectedQuality}</span>
              </div>
            </>
          )}
          
          {showSpeedMenu && (
            <>
              <div 
                className="px-3 py-2 bg-gray-800/70 text-white/90 text-sm font-medium border-b border-gray-700/60 flex items-center"
              >
                <button 
                  className="mr-2 text-white hover:text-gray-300"
                  onClick={onBackFromSpeed}
                >
                  ← 
                </button>
                Playback Speed
              </div>
              {speedOptions.map((speed) => (
                <div 
                  key={speed}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between ${selectedSpeed === speed ? 'text-blue-400' : 'text-white hover:bg-white/10'}`}
                  onClick={() => onSpeedChange(speed)}
                >
                  <span>{speed}x</span>
                  {selectedSpeed === speed && <FaCheck size={14} className="ml-4" />}
                </div>
              ))}
            </>
          )}
          
          {showQualityMenu && (
            <>
              <div 
                className="px-3 py-2 bg-gray-800/70 text-white/90 text-sm font-medium border-b border-gray-700/60 flex items-center"
              >
                <button 
                  className="mr-2 text-white hover:text-gray-300"
                  onClick={onBackFromQuality}
                >
                  ← 
                </button>
                Quality
              </div>
              {qualities.map((quality) => (
                <div 
                  key={quality}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between ${selectedQuality === quality ? 'text-blue-400' : 'text-white hover:bg-white/10'}`}
                  onClick={() => onQualityChange(quality)}
                >
                  <span>{quality}</span>
                  {selectedQuality === quality && <FaCheck size={14} className="ml-4" />}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;