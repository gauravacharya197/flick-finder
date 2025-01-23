'use client';
import { SearchResult } from '@/components/SearchResult/SearchResult';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';




const ResultsPage = ({ searchParams }: { searchParams: { query?: string } }) => {
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
  return (
      <section className=" overflow-hidden pb-10  dark:bg-gray-900 dark:text-white md:pt-2   xl:pt-5">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col lg:items-start lg:gap-3 xl:gap-4">
        <SearchResult query={searchParams.query} />
        </div>
      </div>
    </section>
      
    
  );
};

export default ResultsPage;
