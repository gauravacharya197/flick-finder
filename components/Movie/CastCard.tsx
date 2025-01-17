

const CastCard = ({ imgSrc, name, role }) => {
  return (
    <>
    <div
      className="overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105"
      style={{ animation: "0.5s ease-out 0s 1 normal forwards running fadeIn" }}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Fallback image
            e.currentTarget.onerror = null; // Prevent infinite loop in case fallback image is also not found
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1 truncate text-lg font-semibold leading-tight">
          {name}
        </h3>
        <p className="truncate text-sm text-gray-400">{role}</p>
      </div>
    </div>
    </>
  );
};

export default CastCard;
