'use client'
import React, { RefObject, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setGenres,
  setCountries,
  setYears,
  setSortBy,
  setMediaType,
  clearAllFilters,

} from "@/redux/movies/advanceSearchSlice";
import useClickOutside from "@/hooks/useClickOutside";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { Segmented } from "../ui/Segmented";
import { AiOutlineFilter } from "react-icons/ai";
import { MdClearAll } from "react-icons/md";
import { Option } from '../../types/option';
import { formatDate, getDateRange } from "@/utils/sortDate";
// Types for options and state

const FilterOption = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { genres } = useSelector((state: any) => state.filters);
  const {
    countries: searchCountries,
    genres: searchGenres,
    years: searchYears,
    sortBy,
    mediaType,
  } = useSelector((state: RootState) => state.advanceSearch);

  // Check if any filters are applied
  const hasActiveFilters = !!(searchGenres || searchCountries || searchYears || sortBy || (mediaType!=''));

  // Prepare options for countries, genres, years, and sort
  const countryOptions: Option[] = [
    { value: "US", label: "United States" },
    { value: "IN", label: "India" },
    { value: "CN", label: "China" },
    { value: "JP", label: "Japan" },
    { value: "GB", label: "United Kingdom" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "RU", label: "Russia" },
    { value: "BR", label: "Brazil" },
    { value: "MX", label: "Mexico" },
    { value: "CA", label: "Canada" },
    { value: "KR", label: "South Korea" },
    { value: "NG", label: "Nigeria" },
    { value: "AU", label: "Australia" },
    { value: "AR", label: "Argentina" },
    { value: "ZA", label: "South Africa" },
    { value: "TH", label: "Thailand" },
  ];

  const genreOptions: Option[] = genres?.map((genre: any) => ({
    value: genre.externalId,
    label: genre.name,
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions: Option[] = Array.from({ length: 10 }, (_, index) => currentYear - index).map((year) => ({
    value: String(year),
    label: String(year),
  }));
  //past 40 days, upcoming 6 months
  const { startDate, currentDate, endDate } = getDateRange(40, 6);


  const sortOptions: Option[] = [
    { value: "popularity.desc", label: "Popular" },
    {
      value: `popularity.desc&primary_release_date.gte=${formatDate(startDate)}&primary_release_date.lte=${formatDate(currentDate)}`,
      label: "Recently Released",
    },
    { value: "vote_count.desc", label: "Top Rated" },
    { value: "revenue.desc", label: "Top Grossing" },
    {
      value: `popularity.desc&primary_release_date.gte=${formatDate(currentDate)}&primary_release_date.lte=${formatDate(endDate)}`,
      label: "Upcoming Releases",
    },
    { value: "original_title.asc", label: "A to Z Title" },
  ];

  const dropdownRefs = {
    genre: useRef<HTMLDivElement>(null),
    country: useRef<HTMLDivElement>(null),
    year: useRef<HTMLDivElement>(null),
    sort: useRef<HTMLDivElement>(null),
  };

  // Use click outside hook for all dropdowns
  useClickOutside(
    Object.values(dropdownRefs) as RefObject<HTMLElement>[],
    () => setOpenDropdown(null),
    openDropdown !== null, // Only enable when any dropdown is open
  );

  // Toggles the dropdown state when clicking on a filter
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Toggles the selection for each filter type
  const toggleSelection = (type: any, value: any) => {
    toggleDropdown(type);
    if (type === "genre") {
      // If the same item is clicked again, deselect it
      dispatch(setGenres(searchGenres === value ? null : value));
    } else if (type === "country") {
      dispatch(setCountries(searchCountries === value ? null : value));
    } else if (type === "year") {
      dispatch(setYears(searchYears === value ? null : value));
    } else if (type === "sort") {
      dispatch(setSortBy(sortBy === value ? null : value));
    }
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    dispatch(clearAllFilters())
    setOpenDropdown(null);
  };

  // Renders individual dropdowns
  const renderDropdown = (type: string, options: Option[], selectedValue: string | null) => {
    const isGridLayout = options.length > 10;

    return (
      <div className="relative w-full md:w-full" ref={dropdownRefs[type as keyof typeof dropdownRefs]}>
        {/* Dropdown button */}
        <button
          onClick={() => toggleDropdown(type)}
          className={`flex w-full items-center justify-between truncate rounded p-2 py-1 transition
            ${selectedValue 
              ? "bg-primary bg-opacity-20 text-primary dark:bg-primary dark:bg-opacity-30 dark:text-white" 
              : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"}`}
        >
          <div className="flex items-center">
            <AiOutlineFilter className="mr-2" />
            <span className="truncate">
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {selectedValue &&
                `: ${options.find((option: Option) => option.value === selectedValue)?.label || selectedValue}`}
            </span>
          </div>
          {openDropdown === type ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </button>

        {/* Dropdown content */}
        {openDropdown === type && (
          <div
            className={`absolute z-10 mt-1 rounded border bg-gray-900 shadow-lg
              ${isGridLayout
                ? "--2 grid max-h-[300px] w-full grid-cols-2 overflow-y-auto p-2 sm:w-[200%] sm:grid-cols-3"
                : "max-h-60 w-full overflow-y-auto"
              } scrollbar-hide`}
          >
            {options.map((option: Option) => (
              <div
                key={option.value}
                onClick={() => toggleSelection(type, option.value)}
                className={`cursor-pointer p-2 text-sm text-white
                  ${isGridLayout ? "flex items-center justify-center text-center" : ""}
                  ${selectedValue === option.value ? "bg-primary" : "hover:bg-gray-700"}`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-1 flex w-full flex-col items-start overflow-visible">
      <div className="mb-2 flex w-full items-center justify-between">
        <h3 className=" font-medium">Filter Options</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAllFilters}
            className="group flex items-center gap-1 rounded bg-red-500 bg-opacity-10 px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-opacity-20 dark:bg-red-500 dark:bg-opacity-20 dark:text-red-400 dark:hover:bg-opacity-30"
          >
            <MdClearAll className="transition group-hover:rotate-12" />
            Clear All
          </button>
        )}
      </div>
      
      {/* Filter Options Grid */}
      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-5">
        {renderDropdown("genre", genreOptions, searchGenres)}
        {renderDropdown("country", countryOptions, searchCountries)}
        {renderDropdown("year", yearOptions, searchYears)}
        {renderDropdown("sort", sortOptions, sortBy)}
      </div>
      <Segmented
        size="large"
        value={mediaType}
        options={["Movie", "TV"]}
        className="custom-segmented mb-1 mt-4"
        onChange={(value) => dispatch(setMediaType(value))}
      />
    </div>
  );
};

export default FilterOption;