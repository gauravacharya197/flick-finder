"use client";
import { useFetchAndDispatchFilters } from "@/hooks/useFetchDispatchFilter";
import Navbar from "./Navbar";
import { useEffect } from "react";

const Header = () => {

  useFetchAndDispatchFilters();
  

  return (
    <Navbar/>
  );
};


export default Header;
