import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaRobot, FaSearch } from "react-icons/fa";
import searchSuggestion from "@/data/searchSuggestion";
import ErrorMessage from "./ErrorMessage";
import MovieSuggestions from "../movie/MovieSuggestions";
import { getRecommendation } from "@/services/MovieService";
import Spin from "./Spin";
import Modal from "../ui/Modal";
import { MyTooltip } from "../ui/MyTooltip";

const QUERY_KEY = ["movieSearch"];

export const RobotSearchModal = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getRecommendation(cachedData?.searchText || ""),
    enabled: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: getRecommendation,
    onMutate: (searchText) => {
      const existingCache = queryClient.getQueryData(QUERY_KEY) as any;
      if (existingCache?.searchHistory?.[searchText.toLowerCase()]) {
        return {
          skipRequest: true,
          data: existingCache.searchHistory[searchText.toLowerCase()],
        };
      }
      return { skipRequest: false };
    },
    onSuccess: (responseData, searchText, context) => {
      if (context?.skipRequest) return;

      queryClient.setQueryData(QUERY_KEY, (oldData: any) => ({
        searchText,
        data: responseData.data,
        searchHistory: {
          ...(oldData?.searchHistory || {}),
          [searchText.toLowerCase()]: responseData.data,
        },
      }));
    },
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
    const searchText = cachedData?.searchText;
    if (searchText) {
      const existingCache = queryClient.getQueryData(QUERY_KEY) as any;
      const cachedResults =
        existingCache?.searchHistory?.[searchText.toLowerCase()];

      if (cachedResults) {
        queryClient.setQueryData(QUERY_KEY, {
          ...existingCache,
          searchText,
          data: cachedResults,
        });
      } else {
        mutation.mutate(searchText);
      }
    }
  };

  const loading = mutation.isPending;
  const displayData = data?.data || mutation.data?.data || [];
  const cachedData = queryClient.getQueryData(QUERY_KEY) as any;

  return (
    <>
      <div className="relative flex items-center gap-4">
      <MyTooltip content="Search With AI">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`group flex items-center gap-2 rounded-md bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 text-white transition-all hover:translate-y-[-2px] hover:shadow-lg ${
              isModalOpen ? 'bg-gray-700' : ''
            }`}
          >
           <FaRobot 
        className={`h-4 w-4 transition-all duration-300 ${
          isModalOpen 
            ? 'text-primary-400 animate-pulse shadow-lg ' 
            : 'text-primary'
        } group-hover:rotate-12`}
      />
          </button>
          </MyTooltip>

       
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
       
        centered
        
      >
        <div className="max-h-[min(500px,70vh)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-4 pt-4 pb-2">
            <div className="relative mx-auto flex items-center">
              <div className="group relative flex-1">
                <input
                  type="text"
                  value={cachedData?.searchText || ""}
                  onChange={handleInputChange}
                  placeholder="Whats on your mind?"
                  className="w-full rounded-xl border border-gray-600/30 bg-gray-900 px-6 py-2.5 text-base text-white placeholder:text-gray-400 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600/50"
                />
                {cachedData?.searchText && (
                  <button
                    type="button"
                    onClick={() =>
                      queryClient.setQueryData(QUERY_KEY, {
                        ...cachedData,
                        searchText: "",
                      })
                    }
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <IoMdClose className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-white disabled:opacity-50"
                >
                  {loading ? (
                    <Spin  />
                  ) : (
                    <FaSearch className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="px-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {searchSuggestion.slice(15, 25).map((mood) => (
                <button
                  key={mood}
                  onClick={() =>
                    queryClient.setQueryData(QUERY_KEY, (oldData: any) => ({
                      ...oldData,
                      searchText: mood,
                    }))
                  }
                  className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
                >
                  {mood}
                </button>
              ))}
            </div>

            <div className="space-y-2 pb-4">
              {loading ? (
                Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 mt-3"
                    >
                      <div className="w-16 h-13 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      <div className="flex-1 space-y-3">
                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    </div>
                  ))
              ) : mutation.isError ? (
                <div className="text-center py-4">
                  <p className="text-gray-400">
                    <ErrorMessage message={mutation.error.message} />
                  </p>
                </div>
              ) : displayData.length > 0 ? (
                <MovieSuggestions
                  movies={displayData}
                  onMovieClick={() => setIsModalOpen(false)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};