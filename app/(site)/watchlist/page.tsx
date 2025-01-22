'use client'

import React from 'react'


 const WatchListPage = () => {


  return (
    <section className=" overflow-hidden pb-5 pt-20 dark:bg-gray-900 dark:text-white md:pt-15 xl:pb-25 xl:pt-46">
    <div className="mx-auto flex max-w-c-1390  px-4 md:px-8 2xl:px-0">
      <div className="flex flex-col lg:items-start lg:gap-8 xl:gap-32.5">
      
      <table className="w-full">
        <tbody>
          {[
            { label: "Movie Name", value: "The Calendar Killer" },
            { label: "Original Language", value: "DE" },
            { label: "Release Date", value: "January 15, 2025" },
            { label: "Runtime", value: "95 minutes" },
            { label: "Country", value: "Germany" },
            { label: "Genres", value: "Thriller, Crime, Drama" },
            { label: "Writer", value: "N/A" },
            { label: "Director", value: "Adolfo J. Kolmerer" },
            {
              label: "Producer",
              value:
                "Regina Ziegler, Barbara Thielen, Susa Kusche, Tillman Geithe, Philip Pratt, Verena Schilling",
            },
            { label: "Editor", value: "Laura Wachauf" },
            { label: "Music", value: "Tim Schwerdter" },
            { label: "Cinematography", value: "Christian Huck" },
            { label: "Screenplay", value: "Susanne Schneider" },
            {
              label: "Production Co",
              value: "Ziegler Film, Amazon MGM Studios",
            },
            { label: "Budget", value: "N/A" },
          ].map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-700 last:border-0"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-300 w-1/3">
                {item.label}
              </td>
              <td className="px-6 py-4 text-white">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      </div>
 
  </section>
  )
}
export default WatchListPage;
