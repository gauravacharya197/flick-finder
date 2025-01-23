import React from "react";
import FilterOption from "./FilterOption";

const FilterDropdown = ({ isOpen }) => {
  return isOpen ? (
    <FilterOption/>
  ) : null;
};

export default FilterDropdown;
