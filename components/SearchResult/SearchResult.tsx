import React from 'react'
import FilterOption from '../SearchFilter/FilterOption'
import { MovieList } from '../Movie/MovieList'
import { Segmented } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setMediaType } from '@/redux/movies/advanceSearchSlice'


export const SearchResult = ({ query,movies }: { query?: string, movies:any }) => {
  const dispatch = useDispatch()
    return (
    <div className='container mx-auto'>
     
          
        
           {query && <h2 className="text-2xl font-bold pb-2">Results for '{query}'</h2>}
            <FilterOption/>
           

            
      
         <div className='mt-5'> <MovieList movies={movies}  /></div>
         
        
    

    </div>
  )
}
