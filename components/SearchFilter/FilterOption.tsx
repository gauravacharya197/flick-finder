import React, { useState } from "react";
import { FilterOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setGenres, setCountries, setYears, setSortBy, setMediaType } from "@/redux/movies/advanceSearchSlice";
import { Segmented } from "antd";

const FilterOption = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const {  genres } = useSelector((state: any) => state.filters);
  const { 
    countries: searchCountries, 
    genres: searchGenres, 
    years: searchYears, 
    sortBy ,
    mediaType
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
  const yearOptions = Array.from({ length: 10 }, (_, index) => currentYear - index).map((year) => ({
    value: year,
    label: String(year),
  }));

  const sortOptions = [
    { value: 'vote_count.desc', label: 'Top Rated' },
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'primary_release_date.desc', label: 'Most Recent' },
    { value: 'upcoming', label: 'Upcoming Releases' },
    { value: 'original_title.asc', label: 'A to Z Title' },
  ];

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
      <div className="relative w-full md:w-60">
        {/* Dropdown button */}
        <button
          onClick={() => toggleDropdown(type)}
          className="py-1 text-black dark:text-white flex items-center justify-between w-full p-2 transition bg-gray-200 dark:bg-gray-800 rounded truncate"
        >
          <div className="flex items-center">
            <FilterOutlined className="mr-2" />
            <span className="truncate">
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {selectedValue && `: ${options.find(option => option.value === selectedValue)?.label || selectedValue}`}
            </span>
          </div>
          {openDropdown === type ? <UpOutlined /> : <DownOutlined />}
        </button>

        {/* Dropdown content */}
        {openDropdown === type && (
          <div
            className={`absolute z-10 mt-1 bg-gray-900 border rounded shadow-lg
              ${isGridLayout 
                ? 'w-full sm:w-[200%] grid sm:grid-cols-3 grid-cols-2 --2 p-2 max-h-[300px] overflow-y-auto'
                : 'w-full max-h-60 overflow-y-auto'
              } scrollbar-hide`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleSelection(type, option.value)}
                className={`p-2 cursor-pointer  text-white text-sm
                  ${isGridLayout ? 'text-center flex items-center justify-center' : ''}
                  ${selectedValue === option.value ? 'bg-primary' : 'hover:bg-gray-700'}  // Highlight selected item
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
    <div className="flex flex-col items-start w-full mt-1 overflow-visible">
      {/* Filter Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5  w-full">
        {renderDropdown("genre", genreOptions, searchGenres)}
        {renderDropdown("country", countryOptions, searchCountries)}
        {renderDropdown("year", yearOptions, searchYears)}
        {renderDropdown("sort", sortOptions, sortBy)}
      </div>

       <Segmented
              size="large"
              value={mediaType}
              options={['Movie', 'TV']}
              className="custom-segmented mb-1 mt-4"
              onChange={(value) => dispatch(setMediaType(value))}
            />
    </div>
  );
};

export default FilterOption;
