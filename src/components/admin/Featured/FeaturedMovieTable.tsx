import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/primitives/table";
import { Switch } from "@/components/ui/primitives/switch";
import { truncateString } from "@/utils/truncateString";
import { CustomTag } from "@/components/common/CustomTag";

const FeaturedMoviesTable = ({ 
  movies, 
  featuredStates, 
  onFeatureToggle, 
  isLoading 
}) => {
  // Helper function to get the current featured state
  const getMovieFeaturedState = (movie) => {
    // If we have a managed state, use it
    if (movie.movie.id in featuredStates) {
      return featuredStates[movie.movie.id];
    }
    // Otherwise fall back to the initial isFeatured value
    return movie.isFeatured;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movies?.length) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
          No movies found
        </h3>
        <p className="mt-2 text-gray-400 dark:text-gray-500">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Poster</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead>Media Type</TableHead>
          <TableHead>Overview</TableHead>
          
          <TableHead className="text-right">Featured Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movies.map((movie, index) => {
          const isFeatured = getMovieFeaturedState(movie);
          return (
            <TableRow key={index}>
              <TableCell>
                {movie.movie.posterPath ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${movie.movie.posterPath}`}
                    alt={movie.movie.displayTitle}
                    className="h-16 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                    No image
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {movie.movie.displayTitle}
              </TableCell>
              <TableCell>
                {movie.movie.displayReleaseDate || "Release date unknown"}
              </TableCell>
              <TableCell>
               <CustomTag text={movie.movie.mediaType}/>
              </TableCell>
              <TableCell>
                {truncateString(movie.movie.overview, 40)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {isFeatured ? "Featured" : "Not Featured"}
                  </span>
                  <Switch
                    checked={isFeatured}
                    onCheckedChange={() => onFeatureToggle(movie.movie, isFeatured)}
                    className={`${isFeatured ? 'bg-blue-500' : 'bg-gray-200'} transition-colors`}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
        )}
      </TableBody>
    </Table>
  );
};

export default FeaturedMoviesTable;