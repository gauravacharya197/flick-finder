import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { fetchAndConvertSubtitles } from '@/utils/subtitleUtil';
import VideoControls from './VideoControls';
import ProgressBar from './ProgressBar';
import { FaPause, FaPlay } from 'react-icons/fa';
import useVideoKeyboardShortcuts from '@/hooks/useVideoKeyboardShortcut';
interface HLSVideoPlayerProps {
  src: string;
  poster?: string;
  captions?: {
    src: string;
    label: string;
    language: string;
  }[];
  title?: string;
  qualities?: string[];
}

const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ 
  src, 
  poster,
  captions = [],
  title = '',
  qualities = ['Auto', '1080p', '720p', '480p', '360p']
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeCaptionTrack, setActiveCaptionTrack] = useState<number | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];


  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const setupHls = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          enableWorker: true,
          debug: false,
        });
        hlsRef.current = hls;
        
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (video.paused) {
            setIsPlaying(false);
          }
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error, trying to recover...');
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error, trying to recover...');
                hls?.recoverMediaError();
                break;
              default:
                console.error('Unrecoverable error');
                hls?.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    };

    setupHls();

    if (captions && captions.length > 0) {
      captions.forEach((caption, index) => {
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.src = caption.src;
        track.label = caption.label;
        track.srclang = caption.language;
        if (index === 0) {
          track.default = true;
          setActiveCaptionTrack(0);
        }
        video.appendChild(track);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, captions]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const onProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const onFullscreenChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement ||
        !!(document as any).webkitFullscreenElement ||
        !!(document as any).mozFullScreenElement ||
        !!(document as any).msFullscreenElement
      );
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('progress', onProgress);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('volumechange', onVolumeChange);
    
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('volumechange', onVolumeChange);
      
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
    };
  }, [isDraggingProgress]);

  // Update the auto-hide controls useEffect
useEffect(() => {
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isDraggingProgress && !isDraggingVolume) {
        setShowControls(false);
      }
    }, 3000);
  };

  // New touch handler specifically for mobile
  const handleTouchEnd = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // Shorter timeout for mobile devices
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isDraggingProgress && !isDraggingVolume) {
        setShowControls(false);
      }
    }, 2000); // Reduced timeout for mobile
  };

  const container = containerRef.current;
  if (container) {
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchend', handleTouchEnd); // Changed from touchstart to touchend
  }

  return () => {
    if (container) {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchend', handleTouchEnd);
    }
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };
}, [isPlaying, isDraggingProgress, isDraggingVolume]);
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(error => console.error('Error playing video:', error));
    } else {
      video.pause();
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const handleCaptionToggle = async (index: number | null, src?: string | null) => {
    const video = videoRef.current;
    if (!video) return;
   
    if (index === null) {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = 'hidden';
      }
      setActiveCaptionTrack(null);
      return;
    }
   
    if (src) {
      try {
        const vttContent = await fetchAndConvertSubtitles(src);
        if (!vttContent) return;
        
        const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
        const vttUrl = URL.createObjectURL(vttBlob);
        
        const tracks = video.querySelectorAll('track');
        tracks.forEach(track => {
          if (track.label === 'External Subtitles') {
            track.remove();
          }
        });
        
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = 'External Subtitles';
        track.srclang = 'en';
        track.src = vttUrl;
        track.className = 'v-subtitles';
        track.style.display = 'none';
        
        video.appendChild(track);
        
        setTimeout(() => {
          let trackIndex = -1;
          for (let i = 0; i < video.textTracks.length; i++) {
            if (video.textTracks[i].label === 'External Subtitles') {
              trackIndex = i;
              break;
            }
          }
          
          if (trackIndex >= 0) {
            for (let i = 0; i < video.textTracks.length; i++) {
              video.textTracks[i].mode = (i === trackIndex) ? 'showing' : 'hidden';
            }
          }
          
          setActiveCaptionTrack(index);
        }, 300);
        
      } catch (error) {
        console.error('Failed to load subtitles:', error);
      }
    } else {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = i === index ? 'showing' : 'hidden';
      }
      setActiveCaptionTrack(index);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = speed;
    setSelectedSpeed(speed);
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  

  // In HLSVideoPlayer.tsx
const handleProgressChange = (percent: number) => {
  const video = videoRef.current;
  if (!video || !duration) return; // Add duration check
  
  const newTime = percent * duration;
  video.currentTime = newTime;
  setCurrentTime(newTime); // Update the state to reflect the change
};

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      video.muted = true;
    } else if (video.muted) {
      video.muted = false;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };
  useVideoKeyboardShortcuts({
    videoRef,
    togglePlay,
    toggleFullscreen,
    setVolume,
    setIsMuted
  });
  return (
    <>
    {/* This is the main video container wrapper */}
<div
  ref={containerRef}
  className="relative w-screen h-screen bg-[#000000] overflow-hidden group"
  onKeyDown={(e) => e.stopPropagation()}
  onMouseEnter={() => setShowControls(true)}
  onMouseLeave={() => {
    if (isPlaying && !isDraggingProgress && !isDraggingVolume) {
      setShowControls(false);
    }
  }}
  onTouchStart={(e) => {
    // Prevent default to avoid issues with touch scrolling
    e.preventDefault();
    setShowControls(true);
  }}
>
  {/* Video element */}
  <video
    ref={videoRef}
    className="w-full h-full"
    poster={poster}
    playsInline
    onClick={togglePlay}
  />
  
  {/* Center play/pause button - properly centered with z-index to ensure it's above other elements */}
  <div 
    className={`absolute inset-0 flex items-center justify-center z-14 pointer-events-none ${!isPlaying || showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
  >
    <button
      onClick={togglePlay}
      className="w-20 h-20  flex items-center justify-center text-white transition-all duration-200 group  pointer-events-auto"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? 
        <FaPause size={35} className="group-hover:scale-110 transition-transform" /> :
        <FaPlay size={35} className="ml-1 group-hover:scale-110 transition-transform" /> }
    </button>
  </div>
  
  {/* Title section */}
  {title && (
  <div className={`absolute top-4 left-0 right-0 text-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
    <p className="text-white text-sm sm:text-base md:text-lg font-medium px-4">
      You&apos;re watching<br />
      <span className="text-base sm:text-lg md:text-xl font-semibold">{title}</span>
    </p>
  </div>
)}

  {/* Controls section at bottom */}
  <div className={`absolute bottom-0 left-0 right-0 to-transparent pt-16 pb-4 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
  <ProgressBar
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          isDragging={isDraggingProgress}
          onProgressChange={handleProgressChange}
          onDragStart={() => setIsDraggingProgress(true)}
          onDragEnd={() => setIsDraggingProgress(false)}
          showControls={showControls}
        />
    <VideoControls
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
      isMuted={isMuted}
      isFullscreen={isFullscreen}
      showControls={showControls}
      activeCaptionTrack={activeCaptionTrack}
      selectedSpeed={selectedSpeed}
      selectedQuality={selectedQuality}
      captions={captions}
      qualities={qualities}
      speedOptions={speedOptions}
      onPlayPause={togglePlay}
      onVolumeChange={handleVolumeChange}
      onToggleMute={toggleMute}
      onToggleFullscreen={toggleFullscreen}
      onCaptionToggle={handleCaptionToggle}
      onSpeedChange={handleSpeedChange}
      onQualityChange={handleQualityChange}
      onVolumeDragStart={() => setIsDraggingVolume(true)}
      onVolumeDragEnd={() => setIsDraggingVolume(false)}
    />
  </div>
</div>
    </>
  );
};

export default HLSVideoPlayer;