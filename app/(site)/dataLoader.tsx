import { useQuery } from "@tanstack/react-query";
import { getFilters } from "@/services/MovieService";
import { setFilters } from "@/redux/movies/filterSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const DataLoader = () => {
  const dispatch = useDispatch();

  const { data, error } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const response = await getFilters();
      return response.data;
    },
    staleTime: Infinity, // Cache for 10 minutes
  });

  if (error) {
    toast.error("Error fetching filters");
  }

  // Dispatch only if data is available
  if (data) {
    dispatch(setFilters(data));
  }

  return <div></div>;
};
