import React from "react";
import { Input, Button, Card } from "antd";
import {
  StarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Divider, Flex, Tag } from "antd";

export const SingleMovie = ({ index, movie }) => {
  return (
    <Card
      key={index}
     
      bordered={false}
      className="bg-white text-black dark:bg-gray-800 dark:text-white"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="flex font-bold text-black dark:text-white xl:text-hero">
            {movie.title}
          </h2>
          <div className="font-sans mt-2 flex items-center space-x-4  text-lg font-bold">
            <div className="flex items-center">
              <StarOutlined className="mr-1" />
              <span>{movie.imdbRating} imDB</span>
            </div>
            <div className="flex items-center">
              <CommentOutlined className="mr-1" />
              <span>{movie.released}</span>
            </div>
            <div className="flex items-center">
              <ClockCircleOutlined className="mr-1" />
              <span>{movie.runtime}</span>
            </div>
          </div>
          {movie.genre.split(",").map((x, index) => {
            return (
              <Tag
                className={`${index == 0 ? "mt-2" : ""} px-4 py-2 text-lg`}
                bordered={false}
              >
                {x}
              </Tag>
            );
          })}

          <br />

          <p className=" font-sans mt-2 text-lg font-medium">{movie.plot}</p>
          <p className="font-sans mt-4 text-lg font-medium">
            <span className="text-gray-500">Cast:</span> {movie.actors}
          </p>
          <p className="font-sans mt-2 text-lg font-medium">
            <span className="text-gray-500">Director:</span> {movie.director}
          </p>
          <p className="font-sans mt-2 text-lg font-medium">
            <span className="text-gray-500">Awards:</span> {movie.awards}
          </p>
        </div>
      </div>
    </Card>
  );
};
