"use client";
import { useFetchAndDispatchFilters } from "@/hooks/useFetchDispatchFilter";
import Navbar from "./Navbar";

const Header = () => {
  useFetchAndDispatchFilters();


  return (
    <Navbar/>
  );
};


export default Header;
