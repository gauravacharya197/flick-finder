export const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const hh = h > 0 ? `${h}:` : '';
    const mm = `${h > 0 && m < 10 ? '0' : ''}${m}:`;
    const ss = `${s < 10 ? '0' : ''}${s}`;
    
    return `${hh}${mm}${ss}`;
  };