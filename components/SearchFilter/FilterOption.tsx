import React, { useState } from 'react';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';

const FilterOption = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('');

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi'];
  const countries = ['USA', 'UK', 'France', 'Japan'];
  const years = ['2020', '2021', '2022', '2023'];
  const sortOptions = ['Popularity', 'Rating', 'Release Date'];

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const renderDropdown = (type, options, selectedValue, setSelectedValue) => (
    <div className="relative w-full">
      <button 
        onClick={() => toggleDropdown(type)}
        className="py-1 text-black dark:text-white flex items-center justify-between w-full p-2  transition"
      >
        <div className="flex items-center">
          <FilterOutlined className="mr-2" />
          <span className="truncate">
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {selectedValue && `: ${selectedValue}`}
          </span>
        </div>
        <DownOutlined />
      </button>
      
      {openDropdown === type && (
        <div className="absolute z-10 w-full mt-1 bg-gray-900  border rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelectedValue(option);
                setOpenDropdown(null);
              }}
              className="p-2  cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-center w-full  ">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 max-w-5xl sm:px-25 w-full mt-2 md:mt-0
">
        {renderDropdown('genre', genres, selectedGenre, setSelectedGenre)}
        {renderDropdown('country', countries, selectedCountry, setSelectedCountry)}
        {renderDropdown('year', years, selectedYear, setSelectedYear)}
        {renderDropdown('sort', sortOptions, sortBy, setSortBy)}
      </div>
    </div>
  );
};

export default FilterOption;