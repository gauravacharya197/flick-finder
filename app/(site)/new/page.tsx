import { Dashboard } from '@/components/Dashboard';
import React from 'react'

const NewMoviesPage = () => {
  return (

    <section className=" overflow-hidden pb-5 pt-20 dark:bg-gray-900 dark:text-white md:pt-5 xl:pb-5 xl:pt-30">
    
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
        <div className="col-span-2 bg-black rounded-lg">
          <div className="relative pb-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              
            ></iframe>
          </div>
  
          <div className="mt-4">
            <h1 className="text-2xl font-semibold">Video Title</h1>
            <p className="mt-2 text-lg text-gray-400">By Channel Name</p>
            <p className="mt-4 text-gray-300">
              This is the video description. You can add a detailed description of the video content here.
            </p>
  
            <div className="mt-6 flex space-x-4">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <span>👍</span>
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <span>👎</span>
                <span>Dislike</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <span>💬</span>
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <span>🔗</span>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
  
        <div className="space-y-8">
          <div className=" dark:bg-gray-800 dark:text-white rounded-lg p-4">
            <h3 className="text-xl font-semibold">Suggested Videos</h3>
            <ul>
              <li className="mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <div className="flex space-x-4">
                    <div className="w-24 h-14 bg-gray-600 rounded-md"></div>
                    <div>
                      <p className="text-sm font-semibold">Suggested Video Title</p>
                      <p className="text-xs text-gray-500">Channel Name</p>
                    </div>
                  </div>
                </a>
              </li>
              <li className="mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <div className="flex space-x-4">
                    <div className="w-24 h-14 bg-gray-600 rounded-md"></div>
                    <div>
                      <p className="text-sm font-semibold">Suggested Video Title</p>
                      <p className="text-xs text-gray-500">Channel Name</p>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  </section>
  
)
{/* <section className="overflow-hidden pb-5 pt-20 dark:bg-gray-900 dark:text-white md:pt-15 xl:pb-25 xl:pt-46">
  <div className="container mx-auto px-4 md:px-8"> 
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 1</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 2</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 3</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 4</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 5</div>
    </div>      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 2</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 3</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 4</div>
      <div className="bg-gray-200 p-4 text-center dark:bg-gray-800">Item 5</div>
    </div>
  </div>
</section> */}

  
}
export default NewMoviesPage;
