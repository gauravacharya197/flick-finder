import { useState, useEffect } from 'react';

const VidPlayer = ({ sourceUrl, sandbox = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  // Reset loading state when source URL changes
  useEffect(() => {
    setIsLoading(true);
  }, [sourceUrl]);
  
  return (
    <div className="relative w-full h-[40vh] sm:h-[70vh] xl:h-[72vh] 2xl:h-[65vh] bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 h-full w-full rounded-full border-2 border-white opacity-20"></div>
              <div className="absolute inset-0 h-full w-full rounded-full border-t-2 border-white animate-spin"></div>
            </div>
            <p className="text-sm text-white font-medium">Loading</p>
          </div>
        </div>
      )}
      
      <iframe
        src={sourceUrl}
        referrerPolicy="origin"
        allowFullScreen={true}
        style={{ width: "100%", height: "100%", border: "none" }}
        onLoad={handleIframeLoad}
        {...(sandbox ? { sandbox } : {})}
      />
    </div>
  );
};

export default VidPlayer;