import { getPopular, getSimilarMovies } from '@/services/MovieService';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';

export const SimilarMovie = ({id}) => {
    const [movies, setmovies] = useState<any>([]);
    useEffect(() => {
        if(id)
        getSimilarMovies(id).then((response) => {
        setmovies(response.data);
      }).catch((error) => { toast.error("Error fetching popular movies:", error); } )
     }, [])
     // Dummy related movies data
      
  return (
    <div className="w-full lg:w-1/4">
            <div className="flex flex-col gap-4">
              {movies?.results?.map((relatedMovie, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-md bg-white p-4 shadow-lg dark:bg-gray-800"
                >
                     <Link
               href={`/watchnow/${relatedMovie.id}`}
              className="flex items-center space-x-2 hover:text-blue-600"
            >  
                  <img
                    src={`http://image.tmdb.org/t/p/w500/${relatedMovie?.posterPath}`}
                    alt={relatedMovie?.title}
                    className="h-24 w-16 rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{relatedMovie?.title}</h3>
                    <p className="text-sm">{relatedMovie?.releaseDate}</p>
                    <span className="rounded px-2 py-1">
                                          <FaStar className="mb-1 inline text-yellow-500" />{" "}
                                          {Number(relatedMovie?.voteAverage?.toFixed(1))}
                                        </span>

                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
  )
}
