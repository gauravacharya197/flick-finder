"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { Input, Select, Slider, Button } from 'antd';

export const SearchFilter = () => {
  const { countries, genres, languages, years } = useSelector((state: any) => state.filters); // Destructure the filters from the Redux store

  const countryOptions = countries?.map((country: any) => ({
    value: country.nativeName,
    label: country.nativeName,
  }));

  const genreOptions = genres?.map((genre: any) => ({
    value: genre.name,
    label: genre.name,
  }));

  const languageOptions = languages?.map((x: any) => ({
    value: x.englishName,
    label: x.englishName,
  }));

  const yearOptions = years?.map((year: any) => ({
    value: year,
    label: year,
  }));

  return (
    <div >
      <h2 className="text-2xl font-bold mb-4">Movies</h2>
      <div className="flex flex-wrap gap-4">
        {/* Search Query */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Query</label>

          <Input placeholder="Search for movies..." className="w-full" />
        </div>

        {/* Country */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Country</label>

          <Select
            mode="multiple"
            showSearch
            placeholder="Select Country"
            className="w-full"
            options={countryOptions}
            
          />
        </div>

        {/* Genre */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Genre</label>

          <Select
            mode="multiple"
            showSearch
            placeholder="Select Genre"
            className="w-full"
            options={genreOptions}
            
          />
        </div>

        {/* Released Year */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Released Year</label>

          <Select
            mode="multiple"
            showSearch
            placeholder="Select Year"
            className="w-full"
            options={yearOptions}
            
          />
        </div>

        {/* Language */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Language</label>

          <Select
            mode="multiple"
            showSearch
            placeholder="Select Language"
            className="w-full"
            options={languageOptions}
            
          />
        </div>

        {/* IMDb Rating */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">IMDb Rating</label>
          <Slider className='mt-4.5' range defaultValue={[0, 10]} min={0} max={10} step={0.1} />
        </div>

        {/* Search Button */}
        <div className="flex-1 min-w-[200px] flex justify-start">
          <Button type="primary" className="flex items-center justify-center  bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho">Search</Button>
        </div>
      </div>
    </div>
  );
};