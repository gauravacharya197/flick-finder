import React from "react";
import { Input, Button, Card } from "antd";

const SupportPage = () => {
  const movies = [
    {
      title: "Movie 1",
      description: "Description of movie 1",
      runtime: "120 min",
      rating: "8.5",
      releaseYear: "2021",
    },
    {
      title: "Movie 2",
      description: "Description of movie 2",
      runtime: "110 min",
      rating: "7.8",
      releaseYear: "2020",
    },
    {
      title: "Movie 3",
      description: "Description of movie 3",
      runtime: "130 min",
      rating: "9.0",
      releaseYear: "2019",
    },
  ];

  return (
    <section className="overflow-hidden pb-20 pt-25 md:pt-10 xl:pb-25 xl:pt-25">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="flex items-center justify-center mb-6">
          <Input placeholder="Search..." className="mr-2" />
          <Button type="primary">Search</Button>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1  gap-2 w-screen">
            {movies.map((movie, index) => (
              <Card
                key={index}
                title={movie.title}
                bordered={false}
                className="h-96 bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <div className="grid grid-cols-2 gap-4">
    <div>
      <p>{movie.description}</p>
      <p>Runtime: {movie.runtime}</p>
    </div>
    <div>
      <p>Rating: {movie.rating}</p>
      <p>Release Year: {movie.releaseYear}</p>
    </div>
  </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportPage;
