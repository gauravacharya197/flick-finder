"use client";
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaSearch } from "react-icons/fa";
import { getRecommendation } from '@/services/MovieService';
import { Spin } from 'antd';
import MovieSuggestions from '../Movie/MovieSuggestions';
import searchSuggestion from "../../data/searchSuggestion"; // Adjust the import path as necessary
import { IoMdClose } from 'react-icons/io';

const QUERY_KEY = ['movieSearch'] as const;

const Home = () => {
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(QUERY_KEY) as any;

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getRecommendation(cachedData?.searchText || ''),
    enabled: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: getRecommendation,
    onMutate: (searchText) => {
      // Check if we already have cached data for this search term
      const existingCache = queryClient.getQueryData(QUERY_KEY) as any;
      if (existingCache?.searchHistory?.[searchText.toLowerCase()]) {
        // Return early to prevent API call
        return { skipRequest: true, data: existingCache.searchHistory[searchText.toLowerCase()] };
      }
      return { skipRequest: false };
    },
    onSuccess: (responseData, searchText, context) => {
      if (context?.skipRequest) return; // Don't update cache if we used cached data

      queryClient.setQueryData(QUERY_KEY, (oldData: any) => ({
        searchText,
        data: responseData.data,
        searchHistory: {
          ...(oldData?.searchHistory || {}),
          [searchText.toLowerCase()]: responseData.data
        }
      }));
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = e.target.value;
    queryClient.setQueryData(QUERY_KEY, (oldData: any) => ({
      ...oldData,
      searchText: newSearchText,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchText = formData.get('search')?.toString().trim() || '';
    
    if (searchText) {
      // Check if we have cached results
      const existingCache = queryClient.getQueryData(QUERY_KEY) as any;
      const cachedResults = existingCache?.searchHistory?.[searchText.toLowerCase()];
      
      if (cachedResults) {
        // Use cached results instead of making API call
        queryClient.setQueryData(QUERY_KEY, {
          ...existingCache,
          searchText,
          data: cachedResults
        });
      } else {
        // Make API call if no cached results exist
        mutation.mutate(searchText);
      }
    }
  };
  const [placeholder, setPlaceholder] = useState("");
  useEffect(() => {
    let typingInterval;
    if (!cachedData?.searchText) {
      typingInterval = setInterval(() => {
        const randomSuggestion = searchSuggestion[Math.floor(Math.random() * searchSuggestion.length)];
        let typedText = "";
        let index = 0;

        const typeEffect = setInterval(() => {
          typedText += randomSuggestion.charAt(index);
          setPlaceholder(typedText);
          index++;

          if (index === randomSuggestion.length) {
            clearInterval(typeEffect); // Clear the interval once the word is fully typed
          }
        }, 100); // Speed of typing effect

        return () => clearInterval(typingInterval); // Cleanup the interval when component unmounts or when search is not empty
      }, 3000); // Change suggestion every 3 seconds
    }

    return () => clearInterval(typingInterval); // Cleanup if unmounted
  }, [cachedData?.searchText]);


  const loading = mutation.isPending;
  const displayData = data?.data || mutation.data?.data || [];

  return (
    <>
      <div className="dark:text-white">
        <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10 pt-20 md:pt-40">
          <div className="text-center md:text-left">
          <h2 className="mb-5 flex justify-center font-bold text-black dark:text-white text-2xl xl:text-hero">
                🎬 Let AI Suggest Your Next Movie!
              </h2>
              <h4 className="mb-7 flex justify-center text-medium text-gray-700 dark:text-gray-300">
                🍿 You can also just type emoji of your mood and let our AI suggest the perfect movie for you! 🎉
              </h4>
              <form onSubmit={handleSubmit}>
  <div className="flex flex-wrap justify-center">
    <div className="relative max-w-md w-auto sm:w-full">
      <input
        type="text"
        name="search"
        value={cachedData?.searchText || ''}
        onChange={handleInputChange}
        placeholder={placeholder || "Describe your movie"}
        className="w-full rounded border border-stroke px-3 py-2.5 pr-10 shadow-solid-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"
      />
      {cachedData?.searchText && (
        <button
          type="button"
          onClick={() => {
            queryClient.setQueryData(QUERY_KEY, (oldData: any) => ({
              ...oldData,
              searchText: "",
            }));
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <IoMdClose className="text-2xl text-primary" />
        </button>
      )}
    </div>
    <button
      type="submit"
      disabled={loading}
      aria-label="get started button"
      className={`flex rounded px-2.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho ${
        loading ? "bg-gray-400 opacity-50" : "bg-black"
      }`}
    >
      <FaSearch className="mt-1.5 w-8 text-primary" />
    </button>
  </div>
</form>
          </div>
        </div>
      </div>
      
      <section className="flex items-center justify-center overflow-hidden dark:bg-gray-900 dark:text-white">
        <div className="mx-auto flex max-w-c-1390 justify-center px-4 md:px-8 2xl:px-0">
          {loading ? (
            <div className="flex flex-col items-center">
              <Spin size="large" className="text-6xl" />
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                Please wait
              </h2>
              <br />
            </div>
          ) : displayData.length > 0 ? (
            <MovieSuggestions movies={displayData} />
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;