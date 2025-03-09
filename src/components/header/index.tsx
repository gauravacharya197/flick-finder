"use client";
import { useFetchAndDispatchFilters } from "@/hooks/useFetchDispatchFilter";
import { useEffect } from "react";
import { Navigation } from "./Navigation";

const Header = () => {

  useFetchAndDispatchFilters();
  

  return (
    <Navigation/>
  );
};


export default Header;
