"use client"
import { discover, getPopular } from '@/services/MovieService';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { SearchFilter } from '../SearchFilter/SearchFilter';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const Trending = () => {
  const { query, countries, genres, years, imdbRating } = useSelector((state: RootState) => state.advanceSearch); 

     const [movies, setmovies] = useState<any>([]);
      useEffect(() => {
        discover(query,countries,genres,years,imdbRating[0].toString(),imdbRating[1].toString()).then((response) => {
          setmovies(response.data);
        }).catch((error) => { toast.error("Error fetching popular movies:", error); } )
       }, [query,genres,imdbRating,years,countries])
       const featuredMovie = movies?.results?.[0];
  return (
    <>
    <h2 className="text-2xl font-bold">Trending Now</h2>
      <SearchFilter/>
      {featuredMovie && (
        <div className="relative w-full  mb-8">
           <Link
               href={`watchnow/${featuredMovie.id}`}>
          <img
             src={`http://image.tmdb.org/t/p/original/${featuredMovie?.backdropPath}`}
            alt={featuredMovie.title}
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 rounded-md">
            <h1 className="text-4xl font-bold text-white">{featuredMovie.title}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-gray-800 text-white px-2 py-1 rounded">{"Crime, Thriller"}</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded">{featuredMovie?.releaseDate}</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded">{"120 min"}</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded">{Number(featuredMovie?.voteAverage?.toFixed(1))}</span>
            </div>
          </div>
          </Link>
         
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6">
      {movies?.results?.slice(1).map((relatedMovie, index) => (
  <div
    key={index}
    className="flex flex-col items-start gap-4 rounded-md bg-white p-4 shadow-lg dark:bg-gray-800"
  >
     <Link
               href={`watchnow/${relatedMovie.id}`}
              className="flex items-center space-x-2 hover:text-blue-600"
            >           
           
    <img
      src={`http://image.tmdb.org/t/p/w500/${relatedMovie?.posterPath}`}
      alt={relatedMovie?.title}
      className="h-60 w-80 object-cover rounded-md" // Increased height
    />
     </Link>
    <div className="w-100">
      <h3 className="text-lg font-bold">{relatedMovie?.title}</h3>
      <p className="text-sm">{relatedMovie?.releaseDate}</p>
      <p className="text-sm">
        <strong>Rating:</strong> {Number(relatedMovie?.voteAverage.toFixed(1))}
       
      </p>
    </div>
  </div>
))}
      </div>
    </>
  )
}
