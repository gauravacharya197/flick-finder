const VidPlayer = ({ sourceUrl, sandbox = '' }) => {
  return (
<div className="relative w-full h-[40vh] sm:h-[70vh]">
<iframe
      src={sourceUrl as string} // Ensure sourceUrl is a string
      referrerPolicy="origin"
      allowFullScreen={true}
      style={{ width: "100%", height: "100%", border: "none" }}
      {...(sandbox ? { sandbox } : {})} // Add sandbox only if it has a value
    />
  </div>
  );
};

export default VidPlayer;
