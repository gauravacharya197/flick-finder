import { useEffect, RefObject } from 'react';

const useVideoKeyboardShortcuts = ({
  videoRef,
  togglePlay,
  toggleFullscreen,
  setVolume,
  setIsMuted
}: {
  videoRef:any;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      
      switch (e.key.toLowerCase()) {
        case ' ': // Space - Play/Pause
          e.preventDefault();
          togglePlay();
          break;
  
        case 'm': // M - Mute/Unmute
          e.preventDefault();
          video.muted = !video.muted;
          setIsMuted(video.muted);
          break;
  
        case 'f': // F - Fullscreen
          e.preventDefault();
          toggleFullscreen();
          break;
  
        case 'arrowleft': // ← - Rewind 10s
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
  
        case 'arrowright': // → - Forward 10s
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
  
        case 'arrowup': // ↑ - Volume Up
          e.preventDefault();
          const newVolumeUp = Math.min(1, video.volume + 0.1);
          video.volume = newVolumeUp;
          video.muted = false;
          setVolume(newVolumeUp);
          setIsMuted(false);
          break;
  
        case 'arrowdown': // ↓ - Volume Down
          e.preventDefault();
          const newVolumeDown = Math.max(0, video.volume - 0.1);
          video.volume = newVolumeDown;
          setVolume(newVolumeDown);
          setIsMuted(newVolumeDown === 0);
          break;
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoRef, togglePlay, toggleFullscreen, setVolume, setIsMuted]);
};

export default useVideoKeyboardShortcuts;