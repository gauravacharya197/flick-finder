"use client";
import { Skeleton, Spin } from 'antd';
import React, { use } from 'react'

 const SeenMoviesPage = () => {
  return (
    <section className=" overflow-hidden pb-5 pt-20 dark:bg-gray-900 dark:text-white md:pt-15 xl:pb-25 xl:pt-46">
    <div className="mx-auto flex max-w-c-1390  px-4 md:px-8 2xl:px-0">
      <div className="flex flex-col lg:items-start lg:gap-8 xl:gap-32.5">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
      <Skeleton
                active
                className=" dark:text-white"
                title={{ width: "100%" }}
                paragraph={{
                  rows: 10,
                  width: ["100%", "100%", "100%", "100%", "50%", "50%", "50%", "50%"],
                }}
              /> 
      </div>
    </div>
  </section>
  )
}
export default SeenMoviesPage;
