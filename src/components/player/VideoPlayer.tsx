import { useState, useEffect } from 'react';

const VidPlayer = ({ sourceUrl, sandbox = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  // Reset loading state when source URL changes
  // useEffect(() => {
  //   setIsLoading(true);
  // }, [sourceUrl]);
  
  return (
    <div className="relative w-full h-[40vh] sm:h-[70vh] xl:h-[72vh] 2xl:h-[65vh] bg-black">
       {/* {isLoading && (
         <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </div>
      )} */}
      
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