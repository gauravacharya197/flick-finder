const VidPlayer = ({ sourceUrl }) => {
  return (
    <>
      <iframe
        src={sourceUrl as string} // Ensure sourceUrl is a string
        referrerPolicy="origin"
        allowFullScreen={true}
        style={{ width: "100%", height: "56vh", border: "none" }}
      />
    </>
  );
};
export default VidPlayer;
