import { MediaCategory } from "@/types/MediaCategory";
import { RiNetflixFill } from "react-icons/ri";
import { MdFeaturedPlayList } from "react-icons/md";

export const featuredMediaCategories: MediaCategory[] = [
    { 
        id: "1", 
        name: "Featured", 
        displayName: "Featured",
        icon: MdFeaturedPlayList 
      },
      { 
        id: "2", 
        name: "Netflix_Latest", 
        displayName: "Netflix New",
        icon: RiNetflixFill
      }
  ];