import { Menu } from "@/types/menu";
import { AiOutlineHeart } from "react-icons/ai";
import { 
  FaFilm, 
  FaTv, 
  FaFire, 
  FaStar, 
  FaPlus, 
  FaHome
} from 'react-icons/fa';
import { FaFilter } from "react-icons/fa6";
const menuData: Menu[] = [
  // {
  //   id: 1,
  //   title: "Home",
  //   newTab: false,
  //   path: "/",
  // },
  {
    id: 2,
    title: "Home",
    newTab: false,
    path: "/",
    requireLogin: false,
    icon: FaHome
  },
  {
    id: 3,
    title: "Movies",
    newTab: false,
    path: "/explore/movies",
    requireLogin: false,
    icon: FaFilm
  },
  {
    id: 4,
    title: "TV Shows",
    newTab: false,
    path: "/explore/tv",
    requireLogin: false,
    icon: FaTv
  },
  {
    id: 5,
    title: "Trending",
    newTab: false,
    path: "/trending",
    requireLogin: false,
    icon: FaFire
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
    icon: FaStar
  },
  // {
  //   id: 5,
  //   title: "History",
  //   newTab: false,
  //   path: "/history",
  //   requireLogin : false

  // },

 
  // {
  //   id: 3,
  //   title: "Pages",
  //   newTab: false,
  //   submenu: [
  //     {
  //       id: 31,
  //       title: "Blog Grid",
  //       newTab: false,
  //       path: "/blog",
  //     },
  //     {
  //       id: 34,
  //       title: "Sign In",
  //       newTab: false,
  //       path: "/auth/signin",
  //     },
  //     {
  //       id: 35,
  //       title: "Sign Up",
  //       newTab: false,
  //       path: "/auth/signup",
  //     },
      // {
      //   id: 35,
      //   title: "Docs",
      //   newTab: false,
      //   path: "/docs",
      // },
      // {
      //   id: 35.1,
      //   title: "Support",
      //   newTab: false,
      //   path: "/support",
      // },
      // {
      //   id: 36,
      //   title: "404",
      //   newTab: false,
      //   path: "/error",
      // },
    //],
 // },

  // {
  //   id: 4,
  //   title: "Support",
  //   newTab: false,
  //   path: "/support",
  // },
];

export default menuData;
