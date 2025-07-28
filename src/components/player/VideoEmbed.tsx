import { useState } from 'react';

const VideoEmbed = ({ sourceUrl, sandbox = '' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative w-full h-[40vh] sm:h-[70vh] xl:h-[72vh] 2xl:h-[75vh]"
      style={{ backgroundColor: "#000" }}
    >
      

      <iframe
        src={sourceUrl}
        referrerPolicy="origin"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.2s ease-in-out"
        }}
      />
    </div>
  );
};

export default VideoEmbed;
