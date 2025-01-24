import React, { useState } from "react";
import { FilterOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setGenres, setCountries, setYears, setSortBy } from "@/redux/movies/advanceSearchSlice";

const FilterOption = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const { countries, genres, languages } = useSelector((state: any) => state.filters); 
  const { 
    countries: searchCountries, 
    genres: searchGenres, 
    years: searchYears, 
    sortBy 
  } = useSelector((state: RootState) => state.advanceSearch); 

  const countryOptions = countries?.slice(0,20).map((country: any) => ({
    value: country.isoName,
    label: country.nativeName,
  }));

  const genreOptions = genres?.map((genre: any) => ({
    value: genre.externalId,
    label: genre.name,
  }));

  const yearOptions = [2024,2023,2022,2021,2020,2019,2018]?.map((year: any) => ({
    value: year,
    label: String(year),
  }));

  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'recent', label: 'Most Recent' }
  ];

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const renderDropdown = (type, options, selectedValue, dispatchAction) => {
    const isGridLayout = options.length > 10;
    
    return (
<div className="relative w-full md:w-60">
<button
          onClick={() => toggleDropdown(type)}
          className="py-1 text-black dark:text-white flex items-center justify-between w-full p-2 transition bg-gray-200 dark:bg-gray-800 rounded truncate"
        >
          <div className="flex items-center">
            <FilterOutlined className="mr-2" />
            <span className="truncate">
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {selectedValue && `: ${
                options.find(option => option.value === selectedValue)?.label || selectedValue
              }`}
            </span>
          </div>
          <DownOutlined />
        </button>
  
        {openDropdown === type && (
          <div
          className={`absolute z-10 mt-1 bg-gray-900 border rounded shadow-lg
            ${isGridLayout 
              ? 'w-full sm:w-[250%] grid sm:grid-cols-3 grid-cols-2 gap-0 p-2 max-h-[300px] overflow-y-auto'
              : 'w-full max-h-60 overflow-y-auto'
            }
            scrollbar-hide`}
        
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  dispatch(dispatchAction(option.value));
                  setOpenDropdown(null);
                }}
                className={`p-2 cursor-pointer hover:bg-gray-700 text-white text-sm
                  ${isGridLayout 
                    ? 'text-center flex items-center justify-center' 
                    : ''
                  }`}
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-visible">
        {renderDropdown("genre", genreOptions, searchGenres, setGenres)}
        {renderDropdown("country", countryOptions, searchCountries, setCountries)}
        {renderDropdown("year", yearOptions, searchYears, setYears)}
        {renderDropdown("sort", sortOptions, sortBy, setSortBy)}
      </div>
    </div>
  );
};

export default FilterOption;