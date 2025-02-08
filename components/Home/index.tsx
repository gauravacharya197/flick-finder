"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Spin } from "antd";

import { getRecommendation } from "@/services/MovieService";
import MovieSuggestions from "../Movie/MovieSuggestions";
import searchSuggestion from "../../data/searchSuggestion"; // Adjust the import path if necessary
import ErrorMessage from "../Common/ErrorMessage";

const QUERY_KEY = ["movieSearch"] as const;

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
    const searchText = cachedData.searchText    
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
  // useEffect(() => {
  //   let typingInterval;
  //   if (!cachedData?.searchText) {
  //     typingInterval = setInterval(() => {
  //       const randomSuggestion = searchSuggestion[Math.floor(Math.random() * searchSuggestion.length)];
  //       let typedText = "";
  //       let index = 0;

  //       const typeEffect = setInterval(() => {
  //         typedText += randomSuggestion.charAt(index);
  //         setPlaceholder(typedText);
  //         index++;

  //         if (index === randomSuggestion.length) {
  //           clearInterval(typeEffect); // Clear the interval once the word is fully typed
  //         }
  //       }, 100); // Speed of typing effect

  //       return () => clearInterval(typingInterval); // Cleanup the interval when component unmounts or when search is not empty
  //     }, 3000); // Change suggestion every 3 seconds
  //   }

  //   return () => clearInterval(typingInterval); // Cleanup if unmounted
  // }, [cachedData?.searchText]);


  const loading = mutation.isPending;
  const displayData = data?.data || mutation.data?.data || [];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div  />

        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="animate-fade-in bg-gradient-to-r from-primary to-primary bg-clip-text font-bold text-transparent text-2xl xl:text-hero">
            🎬 Let AI Suggest Your Next Movie!
          </h2>

          <p className="mt-6 animate-fade-in-delay text-lg text-gray-600 dark:text-gray-300">
            🍿 Type an emoji of your mood, and AI will find the perfect movie for you! 🎉
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="relative mx-auto flex max-w-xl items-center">
              <div className="group relative flex-1">
                <input
                  type="text"
                  value={cachedData?.searchText || ""}
                  onChange={handleInputChange}
                  placeholder={placeholder || "Search..."}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-6 py-2 text-lg shadow-lg transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary"
                />

                {cachedData?.searchText && (
                  <button
                    type="button"
                    onClick={() => queryClient.setQueryData(QUERY_KEY, { ...cachedData, searchText: "" })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  >
                    <IoMdClose className="h-5 w-5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-lg transition-all duration-200 hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50"
              >
                {loading ? <Spin className="h-6 w-6 animate-spin" /> : <FaSearch className="h-6 w-6" />}
              </button>
            </div>
          </form>
          <div className="mx-auto mt-4 max-w-3xl ">
          <div className="flex flex-wrap justify-center gap-2">
              {searchSuggestion.slice(15,25).map((mood) => (
                <button
                  key={mood}
                 onClick={() => queryClient.setQueryData(QUERY_KEY, (oldData: any) => ({
                  ...oldData,
                  searchText: mood,
                }))}
                  className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {mood}
                </button>
              ))}
              </div>
            </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Finding your perfect matches...
            </p>
          </div>
        ) : mutation.isError? <ErrorMessage message={mutation.error.message}/> : displayData.length > 0 ? (
          <MovieSuggestions movies={displayData} />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
