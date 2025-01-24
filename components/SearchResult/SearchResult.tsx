import React from 'react'
import FilterOption from '../SearchFilter/FilterOption'


export const SearchResult = ({ query }: { query?: string }) => {
    return (
    <div className='container mx-auto'>
     
          
        
            <h2 className="text-2xl font-bold pb-2">Results for '{query}'</h2>
            <FilterOption/>

    </div>
  )
}
