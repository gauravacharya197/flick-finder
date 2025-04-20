import React, { useState } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaExpand, 
  FaCompress,
  FaVolumeUp, 
  FaVolumeMute,
  FaCog,
  FaClosedCaptioning,
  FaCheck
} from 'react-icons/fa';
import VolumeControl from './VolumeControls';
import SettingsMenu from './SettingsMenu'

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  activeCaptionTrack: number | null;
  selectedSpeed: number;
  selectedQuality: string;
  captions: {
    src: string;
    label: string;
    language: string;
  }[];
  qualities: string[];
  speedOptions: number[];
  formatTime: (seconds: number) => string;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onCaptionToggle: (index: number | null, src?: string | null) => void;
  onSpeedChange: (speed: number) => void;
  onQualityChange: (quality: string) => void;
  onVolumeDragStart: () => void;
  onVolumeDragEnd: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  showControls,
  activeCaptionTrack,
  selectedSpeed,
  selectedQuality,
  captions,
  qualities,
  speedOptions,
  formatTime,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onCaptionToggle,
  onSpeedChange,
  onQualityChange,
  onVolumeDragStart,
  onVolumeDragEnd
}) => {
  const [showCaptionsMenu, setShowCaptionsMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  return (
    <>
    
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onPlayPause}
              className="text-white focus:outline-none hover:text-gray-300 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
            </button>
            
            <div className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
              onDragStart={onVolumeDragStart}
              onDragEnd={onVolumeDragEnd}
              showControls={showControls}
            />

            {captions.length > 0 && (
              <div className="relative mr-6">
                <button 
                  id="captions-button"
                  onClick={() => {
                    setShowCaptionsMenu(!showCaptionsMenu);
                    setShowSettingsMenu(false);
                  }}
                  className={`text-white focus:outline-none hover:text-gray-300 transition-colors flex items-center justify-center h-8 w-8 ${activeCaptionTrack !== null ? 'text-blue-400' : ''}`}
                  aria-label="Captions"
                >
                  <FaClosedCaptioning size={20} />
                </button>
                
                {showCaptionsMenu && (
                  <div 
                    id="captions-menu"
                    className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-md overflow-hidden shadow-xl min-w-32 transform origin-bottom-right scale-95 transition-all duration-150"
                  >
                    <div className="px-3 py-2 bg-gray-800/70 text-white/90 text-sm font-medium border-b border-gray-700/60">
                      Subtitles
                    </div>
                    <div 
                      className={`px-4 py-2.5 cursor-pointer flex items-center justify-between ${activeCaptionTrack === null ? 'text-blue-400' : 'text-white hover:bg-white/10'}`}
                      onClick={() => {
                        onCaptionToggle(null);
                        setShowCaptionsMenu(false);
                      }}
                    >
                      <span>Off</span>
                      {activeCaptionTrack === null && <FaCheck size={14} className="ml-4" />}
                    </div>
                    {captions.map((caption, index) => (
                      <div 
                        key={caption.language}
                        className={`px-4 py-2.5 cursor-pointer flex items-center justify-between ${activeCaptionTrack === index ? 'text-blue-400' : 'text-white hover:bg-white/10'}`}
                        onClick={() => {
                          onCaptionToggle(index, caption.src);
                          setShowCaptionsMenu(false);
                        }}
                      >
                        <span>{caption.label}</span>
                        {activeCaptionTrack === index && <FaCheck size={14} className="ml-4" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <SettingsMenu
              showSettingsMenu={showSettingsMenu}
              showSpeedMenu={showSpeedMenu}
              showQualityMenu={showQualityMenu}
              selectedSpeed={selectedSpeed}
              selectedQuality={selectedQuality}
              speedOptions={speedOptions}
              qualities={qualities}
              onToggleSettings={() => {
                setShowSettingsMenu(!showSettingsMenu);
                setShowCaptionsMenu(false);
              }}
              onToggleSpeedMenu={() => {
                setShowSpeedMenu(true);
                setShowQualityMenu(false);
              }}
              onToggleQualityMenu={() => {
                setShowQualityMenu(true);
                setShowSpeedMenu(false);
              }}
              onSpeedChange={(speed) => {
                onSpeedChange(speed);
                setShowSpeedMenu(false);
              }}
              onQualityChange={(quality) => {
                onQualityChange(quality);
                setShowQualityMenu(false);
              }}
              onBackFromSpeed={() => setShowSpeedMenu(false)}
              onBackFromQuality={() => setShowQualityMenu(false)}
            />

            <button 
              onClick={onToggleFullscreen}
              className="text-white focus:outline-none hover:text-gray-300 transition-colors flex items-center justify-center h-8 w-8"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>
        </div>
    
    </>
  );
};

export default VideoControls;