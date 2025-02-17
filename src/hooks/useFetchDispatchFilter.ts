// hooks/useFetchAndDispatchFilters.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { setFilters } from "@/redux/movies/filterSlice";
import { getFilters } from "@/services/MovieService";

export const useFetchAndDispatchFilters = () => {
  const dispatch = useDispatch();

  // Fetch filters data using React Query
  const { data, error, isError } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const response = await getFilters();
      return response.data;
    },
    staleTime: Infinity, // Cache for a long time
  });

  // Handle error in useEffect to avoid triggering during render
  useEffect(() => {
    if (isError && error) {
      toast.error("Error fetching filters");
    }
  }, [isError, error]);

  // Dispatch to Redux only when data is available
  useEffect(() => {
    if (data) {
      dispatch(setFilters(data)); // Dispatch data to Redux store
    }
  }, [data, dispatch]);

  // Return nothing as this is just for side effects
  return null;
};