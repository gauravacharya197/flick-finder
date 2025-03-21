'use client'
import React, { useState } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/Select";
import { Segmented } from "../ui/Segmented";
import { AiOutlineFilter } from "react-icons/ai";
import { MdClearAll, MdFilterList, MdSort, MdCalendarMonth, MdLanguage } from "react-icons/md";
import { Option } from '../../types/option';
import { formatDate, getDateRange } from "@/utils/sortDate";

const FilterOption = () => {
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
  const hasActiveFilters = !!(searchGenres || searchCountries || searchYears || sortBy || (mediaType !== ''));

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
  })) || [];

  const currentYear = new Date().getFullYear();
  const yearOptions: Option[] = Array.from({ length: 10 }, (_, index) => currentYear - index).map((year) => ({
    value: String(year),
    label: String(year),
  }));
  
  // Past 40 days, upcoming 6 months
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

  // Handle genre selection
  const handleGenreChange = (value: any) => {
    dispatch(setGenres(value === "all" ? null : value));
  };

  // Handle country selection
  const handleCountryChange = (value: any) => {
    dispatch(setCountries(value === "all" ? null : value));
  };

  // Handle year selection
  const handleYearChange = (value: any) => {
    dispatch(setYears(value === "all" ? null : value));
  };

  // Handle sort selection
  const handleSortChange = (value: any) => {
    dispatch(setSortBy(value === "all" ? null : value));
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
  };

  // Helper function to get current label for each filter
  const getGenreLabel = () => {
    const selected = genreOptions.find(option => option.value === searchGenres);
    return selected ? selected.label : "Genre";
  };

  const getCountryLabel = () => {
    const selected = countryOptions.find(option => option.value === searchCountries);
    return selected ? selected.label : "Country";
  };

  const getYearLabel = () => {
    const selected = yearOptions.find(option => option.value === searchYears);
    return selected ? selected.label : "Year";
  };

  const getSortLabel = () => {
    const selected = sortOptions.find(option => option.value === sortBy);
    return selected ? selected.label : "Sort By";
  };

  return (
    <div className="mt-1 flex w-full flex-col items-start overflow-visible">
      <div className="mb-2 flex w-full items-center justify-between">
        <h3 className="font-medium">Filter Options</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAllFilters}
            className="group flex items-center gap-1 rounded bg-red-500 bg-opacity-10 px-2 py-1 text-xs font-medium text-red-400 transition hover:bg-opacity-20 dark:bg-red-500 dark:bg-opacity-20 dark:text-red-400 dark:hover:bg-opacity-30"
          >
            <MdClearAll className="transition group-hover:rotate-12" />
            Clear All
          </button>
        )}
      </div>
      
      {/* Filter Options Grid */}
      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
        {/* Genre Select */}
        <Select value={searchGenres || "all"} onValueChange={handleGenreChange}>
          <SelectTrigger 
            className={`border-gray-700 ${searchGenres ? "bg-primary bg-opacity-20 text-primary" : "bg-gray-800"} 
            ring-gray-900 h-10 w-full`}
          >
            <div className="flex items-center gap-2">
              <MdFilterList className="text-lg" />
              <SelectValue placeholder={getGenreLabel()} />
            </div>
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
            <SelectItem value="all" className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">All Genres</SelectItem>
            {genreOptions.map((genre) => (
              <SelectItem key={genre.value} value={genre.value} className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">
                {genre.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country Select */}
        <Select value={searchCountries || "all"} onValueChange={handleCountryChange}>
          <SelectTrigger 
            className={`border-gray-700 ${searchCountries ? "bg-primary bg-opacity-20 text-primary" : "bg-gray-800"} 
            ring-gray-900 h-10 w-full`}
          >
            <div className="flex items-center gap-2">
              <MdLanguage className="text-lg" />
              <SelectValue placeholder={getCountryLabel()} />
            </div>
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-gray-100  overflow-y-auto">
            <SelectItem value="all" className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">All Countries</SelectItem>
            {countryOptions.map((country) => (
              <SelectItem key={country.value} value={country.value} className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Select */}
        <Select value={searchYears || "all"} onValueChange={handleYearChange}>
          <SelectTrigger 
            className={`border-gray-700 ${searchYears ? "bg-primary bg-opacity-20 text-primary" : "bg-gray-800"} 
            ring-gray-900 h-10 w-full`}
          >
            <div className="flex items-center gap-2">
              <MdCalendarMonth className="text-lg" />
              <SelectValue placeholder={getYearLabel()} />
            </div>
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
            <SelectItem value="all" className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">All Years</SelectItem>
            {yearOptions.map((year) => (
              <SelectItem key={year.value} value={year.value} className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Select */}
        <Select value={sortBy || "all"} onValueChange={handleSortChange}>
          <SelectTrigger 
            className={`border-gray-700 ${sortBy ? "bg-primary bg-opacity-20 text-primary" : "bg-gray-800"} 
            ring-gray-900 h-10 w-full`}
          >
            <div className="flex items-center gap-2">
              <MdSort className="text-lg" />
              <SelectValue placeholder={getSortLabel()} />
            </div>
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
            <SelectItem value="all" className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">Default Sorting</SelectItem>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Media Type Segmented Control */}
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