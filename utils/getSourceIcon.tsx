import { FaStar, FaFilm } from "react-icons/fa";
import { GiTomato } from "react-icons/gi"; // Rotten Tomatoes
import { MdOutlineRateReview } from "react-icons/md"; // Metacritic
import { FaImdb } from "react-icons/fa6";
import { SiRottentomatoes } from "react-icons/si";
import { SiMetacritic } from "react-icons/si";

export const getSourceIcon = (source:string) => {
  switch (source) {
    case "Internet Movie Database":
      return <FaImdb  />;
    case "Rotten Tomatoes":
      return <SiRottentomatoes className="text-red-500" />;
    case "Metacritic":
      return <SiMetacritic className="text-blue-500" />;
    default:
      return <FaFilm className="text-gray-400" />; // Fallback icon
  }
};