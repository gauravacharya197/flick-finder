"use client";
import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Input, Select, Slider, Button } from 'antd';
import { FilterState, setCountries, setGenres, setImdbRating, setQuery, setYears } from '@/redux/movies/advanceSearchSlice';
import { RootState } from '@/redux/store';

export const SearchFilter = () => {
  const dispatch = useDispatch();
  const { countries, genres, languages } = useSelector((state: any) => state.filters); 
  const { query, countries: searchCountries, genres: searchGenres, years: searchYears, imdbRating } = useSelector((state: RootState) => state.advanceSearch); 

  const countryOptions = countries?.map((country: any) => ({
    value: country.isoName,
    label: country.nativeName,
  }));

  const genreOptions = genres?.map((genre: any) => ({
    value: genre.externalId,
    label: genre.name,
  }));

 

  const yearOptions = [2022,2021,2020,2019,2018]?.map((year: any) => ({
    value: year,
    label: year,
  }));

  return (
    < >
   
     
      {/* <h2 className="text-2xl font-bold mb-4">Movies</h2> */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
      {/* {query+ searchCountries+ " " +searchGenres + " " +searchYears +" " + imdbRating} */}
        {/* Search Query */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Query</label>

          <Input placeholder="Search for movies..." value={query} className="w-full" onChange={(e) => dispatch(setQuery(e.target.value))}
          />
        </div>

       

        {/* Country */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Country</label>

          <Select
            
            showSearch
            placeholder="Select Country"
            className="w-full"
            options={countryOptions}
            value={searchCountries}
            onChange={(value) => dispatch(setCountries(value))}
            
          />
        </div>

        {/* Genre */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Genre</label>

          <Select
           
            showSearch
            placeholder="Select Genre"
            className="w-full"
            options={genreOptions}
            value={searchGenres}
            onChange={(value) => dispatch(setGenres(value))}
            
          />
        </div>

        {/* Released Year */}
        <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Released Year</label>

          <Select
           
            showSearch
            placeholder="Select Year"
            className="w-full"
            options={yearOptions}
            value={searchYears}
            onChange={(value) => dispatch(setYears(value))}
            
          />
        </div>

       

        {/* IMDb Rating */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">IMDb Rating</label>
          <Slider className='mt-4.5' range defaultValue={imdbRating} min={0}  max={10} step={0.1}  onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                dispatch(setImdbRating([value[0], value[1]]));
              }
            }} />
        </div>
        

        {/* Search Button */}
        {/* <div className="w-full flex justify-start">
          <Button type="primary" className="flex items-center justify-center bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho">Search</Button>
        </div> */}
      </div>
    </>
  );
};