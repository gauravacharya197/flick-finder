import { Tooltip } from "antd";


const CastCard = ({ imgSrc, name, role }) => {
  let fallBackImageUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
  return (
    <>
    <div
      className="overflow-hidden rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105 "
      style={{ animation: "0.5s ease-out 0s 1 normal forwards running fadeIn" }}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={imgSrc || fallBackImageUrl }
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          
        />
      </div>
      <Tooltip title={role ? `${name} as ${role}` : name} placement="top">
      <div className="p-4  text-white">
          <h3 className="mb-1 truncate text-lg font-semibold leading-tight">
            {name}
          </h3>
          <p className="truncate text-sm text-gray-50">{role}</p>
        </div>
      </Tooltip>
    </div>
    </>
  );
};

export default CastCard;
