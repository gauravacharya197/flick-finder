import React from "react";

import { SimilarMovieCard } from "./SimilarMovieCard";
import { Movie } from "@/types/movie";

const MovieSuggestions = ({movies, onMovieClick}) => {
  
  let moviesMap:Movie[] = movies.map(x => ({
    posterPath: x.poster,
    displayTitle: x.title,
    displayReleaseDate: x.released,
    voteAverage:x.imdbRating,
    mediaType:"movie",
    id:x.imdbID
  }));
  return (
    <section>
   
    <div className="flex justify-center">
  <div 
    className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-6xl" 
    onClick={onMovieClick}
  >
    {moviesMap.map((movie, index) => (
      <SimilarMovieCard 
        index={index} 
        mediaType="movie" 
        key={index} 
        movie={movie}
      />
    ))}
  </div>
</div>
  
  </section>
  );
};

export default MovieSuggestions;
