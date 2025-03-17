import React from 'react';
import { FaRegBookmark } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addToWatchlist, iswatchlisted } from '@/services/WatchlistService';

interface WatchlistButtonProps {
  movieId: string;
  movie: any;
  isLoggedIn: boolean;
  userId?: any;
}

// Add this function to check watchlist status


const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  movieId,
  movie,
  isLoggedIn,
  userId,
}) => {
  // Query to check initial watchlist status
  const { data: isWatchlistedInitially } = useQuery({
    queryKey: ['watchlist-status', userId, movieId],
    queryFn: () => iswatchlisted(userId, movieId),
    enabled: !!isLoggedIn && !!userId, // Only run query if user is logged in and userId exists
    staleTime: Infinity,
  });
  const queryClient = useQueryClient()

  const [isWatchlisted, setIsWatchlisted] = React.useState(false);

  // Update local state when initial data is fetched
  React.useEffect(() => {
    if (isWatchlistedInitially !== undefined) {
      setIsWatchlisted(isWatchlistedInitially.data.watchListed);
    }
  }, [isWatchlistedInitially]);

  const mutation = useMutation({
    mutationFn: ({ id, movie, userId }: { id: string, movie: any, userId: string }) => {
      const filteredMovie = {
        id: movie.id,
        displayTitle: movie.displayTitle,
        displayReleaseDate: movie.displayReleaseDate,
       
        posterPath: movie.posterPath,
        mediaType: movie.mediaType,
        
        voteAverage: movie.imdbRating,
      };
  
      return addToWatchlist(id, filteredMovie, userId);
    },
    onSuccess: () => {
      setIsWatchlisted(prev => !prev);
      // Query invalidation in React Query is like telling the library "this data is now outdated (stale), and needs to be refetched"once user changes watchlist
      queryClient.invalidateQueries({queryKey: ['watchlist', userId], refetchType: 'none'});
      queryClient.invalidateQueries({queryKey: ['watchlist-status', userId, movieId], refetchType: 'none'});
      toast.success(isWatchlisted ? "Removed from watchlist!" : "Added to watchlist!", {
        position: "bottom-center"
      });
    },
    onError: () => {
      toast.error("Failed to update watchlist.", {
        position: "bottom-center"
      });
    },
  });

  const handleWatchlist = () => {
    if (!isLoggedIn) {
      toast.error("You need to log in to use this feature", {
        position: "bottom-center",
      });
      return;
    }

    if (!userId) {
      toast.error("User ID is missing", {
        position: "bottom-center",
      });
      return;
    }

    mutation.mutate({ id: movieId, movie, userId });
  };

  return (
    <button
      onClick={handleWatchlist}
      className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 text-sm hover:bg-gray-800/50"
      disabled={mutation.isPending}
    >
      <FaRegBookmark
        className={`h-4 w-4 transition-colors  ${
          isWatchlisted ? 'text-primary' : 'text-white'
        }`}
      />
      <span className='text-white'>Watchlist</span>
    </button>
  );
};

export default WatchlistButton;