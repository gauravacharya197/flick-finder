import { SearchFilter } from '@/components/SearchFilter/SearchFilter';
import React from 'react'

 const SearchPage = () => {
  return (
    <section className=" overflow-hidden pb-5 pt-20 dark:bg-gray-900 dark:text-white md:pt-15 xl:pb-25 xl:pt-46">
    <div className="mx-auto flex max-w-c-1390  px-4 md:px-8 2xl:px-0">
      <div className="flex flex-col lg:items-start">
      
      <SearchFilter/>
      </div>
    </div>
  </section>
  )
}
export default SearchPage;
