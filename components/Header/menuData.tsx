import { Menu } from "@/types/menu";
import { AiOutlineHeart } from "react-icons/ai";

const menuData: Menu[] = [
  // {
  //   id: 1,
  //   title: "Home",
  //   newTab: false,
  //   path: "/",
  // },
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
    requireLogin : false

  },
  {
    id: 2,
    title: "Trending",
    newTab: false,
    path: "/trending",
    requireLogin : false

  },
  {
    id: 2.1,
    title: "New",
    newTab: false,
    path: "/new",
    requireLogin : false

  },
  
  {
    id: 4,
    title: "IMDB Top 100",
    newTab: false,
    path: "/imdb",
    requireLogin : false

  },

 
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
