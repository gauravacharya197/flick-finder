import React from "react";
import { Input, Button, Card } from "antd";
import SingleMovieCard from "./SingleMovieCard";

const AISuggestedMovies = ({movies}) => {
  

  return (
    <section className="overflow-hidden pb-20 pt-25 md:pt-3 xl:pb-25 xl:pt-2">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1  gap-2 w-screen">
            {movies.map((movie, index) => (
               <SingleMovieCard index movie={movie}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISuggestedMovies;
