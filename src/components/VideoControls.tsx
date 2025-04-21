import React, { useState } from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaCog,
  FaClosedCaptioning,
  FaCheck,
} from "react-icons/fa";
import VolumeControl from "./VolumeControls";
import SettingsMenu from "./SettingsMenu";
import { formatTime } from "@/utils/formatPlayerTime";

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
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onCaptionToggle,
  onSpeedChange,
  onQualityChange,
  onVolumeDragStart,
  onVolumeDragEnd,
}) => {
  const [showCaptionsMenu, setShowCaptionsMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="text-white focus:outline-none hover:text-gray-300 transition-colors hidden sm:block"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={25} /> : <FaPlay size={25} />}
          </button>

          <div className="text-white text-sm sm:tex-md font-medium sm:!ml-5">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
            onDragStart={onVolumeDragStart}
            onDragEnd={onVolumeDragEnd}
            showControls={showControls}
          />
        </div>

        <div className="flex items-center">
          {captions.length > 0 && (
            <div className="relative mr-4 sm:mr-6">
              <button
                id="captions-button"
                onClick={() => {
                  setShowCaptionsMenu(!showCaptionsMenu);
                  setShowSettingsMenu(false);
                }}
                className={`focus:outline-none transition-colors flex items-center justify-center h-8 w-8 ${
                  activeCaptionTrack !== null
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                aria-label="Captions"
              >
                <FaClosedCaptioning size={28} />
              </button>

              {showCaptionsMenu && (
                <div
                  id="captions-menu"
                  className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-md overflow-hidden shadow-xl w-48 sm:w-52 transform origin-bottom-right scale-100 transition-all duration-150"
                  style={{
                    maxWidth: "calc(100vw - 16px)",
                    maxHeight: "calc(100vh - 80px)",
                    zIndex: 50,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 sm:px-4 py-2 bg-gray-800/70 text-white/90 font-medium border-b border-gray-700/60 text-sm sm:text-base">
                    Subtitles
                  </div>
                  <div className="max-h-56 sm:max-h-72 overflow-y-auto">
                    <div
                      className={`px-3 sm:px-4 py-2 cursor-pointer flex items-center justify-between text-sm sm:text-base ${
                        activeCaptionTrack === null
                          ? "bg-gray-700/50"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => {
                        onCaptionToggle(null);
                        setShowCaptionsMenu(false);
                      }}
                    >
                      <span className="text-white">Off</span>
                      {activeCaptionTrack === null && (
                        <FaCheck
                          size={14}
                          className="ml-2 sm:ml-4 text-white"
                        />
                      )}
                    </div>
                    {captions.map((caption, index) => (
                      <div
                        key={caption.language}
                        className={`px-3 sm:px-4 py-2 cursor-pointer flex items-center justify-between text-sm sm:text-base ${
                          activeCaptionTrack === index
                            ? "bg-gray-700/50"
                            : "hover:bg-white/10"
                        }`}
                        onClick={() => {
                          onCaptionToggle(index, caption.src);
                          setShowCaptionsMenu(false);
                        }}
                      >
                        <span className="text-white whitespace-normal pr-2 sm:pr-4 break-words">
                          {caption.label}
                        </span>
                        {activeCaptionTrack === index && (
                          <FaCheck
                            size={14}
                            className="ml-2 sm:ml-4 flex-shrink-0 text-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>
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
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <FaCompress size={25} /> : <FaExpand size={25} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoControls;
