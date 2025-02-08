import React, { RefObject, useRef, useState } from "react";
import { FilterOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setGenres,
  setCountries,
  setYears,
  setSortBy,
  setMediaType,
} from "@/redux/movies/advanceSearchSlice";
import { Segmented } from "antd";
import useClickOutside from "@/hooks/useClickOutside";

const FilterOption = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const { genres } = useSelector((state: any) => state.filters);
  const {
    countries: searchCountries,
    genres: searchGenres,
    years: searchYears,
    sortBy,
    mediaType,
  } = useSelector((state: RootState) => state.advanceSearch);

  // Prepare options for countries, genres, years, and sort
  const countryOptions = [
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

  const genreOptions = genres?.map((genre: any) => ({
    value: genre.externalId,
    label: genre.name,
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 10 },
    (_, index) => currentYear - index,
  ).map((year) => ({
    value: year,
    label: String(year),
  }));

  const currentDate = new Date();
  const recentStartDate = new Date(currentDate);
  recentStartDate.setDate(currentDate.getDate() - 40);
  const upcomingEndDate = new Date(currentDate);
  upcomingEndDate.setMonth(currentDate.getMonth() + 6);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    {
      value: `popularity.desc&primary_release_date.gte=${formatDate(recentStartDate)}&primary_release_date.lte=${formatDate(currentDate)}`,
      label: "Most Recent",
    },
    { value: "vote_count.desc", label: "Top Rated" },
    { value: "revenue.desc", label: "Top Grossing" },
    {
      value: `popularity.desc&primary_release_date.gte=${formatDate(currentDate)}&primary_release_date.lte=${formatDate(upcomingEndDate)}`,
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
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Toggles the selection for each filter type
  const toggleSelection = (type, value) => {
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

  // Renders individual dropdowns
  const renderDropdown = (type, options, selectedValue) => {
    const isGridLayout = options.length > 10;

    return (
      <div className="relative w-full md:w-full" ref={dropdownRefs[type]}>
        {/* Dropdown button */}
        <button
          onClick={() => toggleDropdown(type)}
          className="flex w-full items-center justify-between truncate rounded bg-gray-200 p-2 py-1 text-black transition dark:bg-gray-800 dark:text-white"
        >
          <div className="flex items-center">
            <FilterOutlined className="mr-2" />
            <span className="truncate">
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {selectedValue &&
                `: ${options.find((option) => option.value === selectedValue)?.label || selectedValue}`}
            </span>
          </div>
          {openDropdown === type ? <UpOutlined /> : <DownOutlined />}
        </button>

        {/* Dropdown content */}
        {openDropdown === type && (
          <div
            className={`absolute z-10 mt-1 rounded border bg-gray-900 shadow-lg
              ${
                isGridLayout
                  ? "--2 grid max-h-[300px] w-full grid-cols-2 overflow-y-auto p-2 sm:w-[200%] sm:grid-cols-3"
                  : "max-h-60 w-full overflow-y-auto"
              } scrollbar-hide`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleSelection(type, option.value)}
                className={`cursor-pointer p-2  text-sm text-white
                  ${isGridLayout ? "flex items-center justify-center text-center" : ""}
                  ${selectedValue === option.value ? "bg-primary" : "hover:bg-gray-700"}  // Highlight selected item
                `}
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
