import { Menu } from "@/types/menu";
import { AiOutlineHeart } from "react-icons/ai";
import { 
  FaFilm, 
  FaTv, 
  FaFire, 
  FaStar, 
  FaPlus, 
  FaHome,
  FaBookmark,
  FaHistory,
  FaAddressBook
} from 'react-icons/fa';
import { FaBookOpen, FaFilter } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
const menuData: Menu[] = [
 
  {
    id: 2,
    title: "Home",
    newTab: false,
    path: "/",
    requireLogin: false,
    icon: FaHome,
    showOnMobile : true,

  },
  {
    id: 3,
    title: "Movies",
    newTab: false,
    path: "/explore/movie",
    requireLogin: false,
    icon: FaFilm,
    showOnMobile : true,
  },
  {
    id: 4,
    title: "TV Shows",
    newTab: false,
    path: "/explore/tv",
    requireLogin: false,
    icon: FaTv,
    showOnMobile : true,
  },

  {
    id: 5,
    title: "Trending",
    newTab: false,
    path: "/trending",
    requireLogin: false,
    icon: FaFire,
    showOnMobile : true,
  },
  {
    id: 6,
    title: "Filter",
    newTab: false,
    path: "/results",
    requireLogin: false,
    icon: FaFilter
  },
 
  // {
  //   id: 2.1,
  //   title: "New",
  //   newTab: false,
  //   path: "/new",
  //   requireLogin: false,
  //   icon: FaPlus
  // },
  
  {
    id: 7,
    title: "Top Rated",
    newTab: false,
    path: "/top-movies-tv",
    requireLogin: false,
    icon: FaStar,
    showOnMobile : true,
  },
  {
    id: 7.2,
    title: "Manga",
    newTab: false,
    path: "/explore/manga",
    requireLogin: false,
    icon: FaBookOpen,
    showOnMobile : true,
  },
  {
    id: 10,
    title: "History",
    newTab: false,
    path: "/history",
    requireLogin : false,
    icon: FaHistory,
    showOnMobile : true,

  },
  {
    id: 8,
    title: "Watchlist",
    newTab: false,
    path: "/watchlist",
    requireLogin: true,
    icon: FaBookmark ,
    showOnMobile : true,
  },
  {
    id: 9,
    title: "Setting",
    newTab: false,
    path: "/settings",
    requireLogin: true,
    icon:  IoSettings,
    showOnMobile : true,
  },

];

export default menuData;
