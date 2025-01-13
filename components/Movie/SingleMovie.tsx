import React from "react";
import { Input, Button, Card } from "antd";
import {
  StarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Divider, Flex, Tag } from "antd";
import { FaStar, FaHeart, FaShareAlt, FaBookmark } from "react-icons/fa"; // Replace with the actual icons you want to use
import Link from "next/link";

export const SingleMovie = ({ index, movie }) => {
  const liked = true;
  return (
    <Card
      key={index}
      bordered={false}
      className="bg-white text-black dark:bg-gray-800 dark:text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="flex font-bold text-black dark:text-white text-xl md:text-2xl xl:text-hero">
            {movie.title}
          </h2>
        
          <div className="font-sans mt-2 flex flex-wrap items-center space-x-4 text-base md:text-lg font-bold">
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
          <div>
          {movie.genre.split(",").map((x, index) => (
            <Tag
              key={index}
              className={`${index == 0 ? "mt-2" : ""} px-4 py-2 text-sm md:text-lg`}
              bordered={false}
            >
              {x}
            </Tag>
          ))}
          </div>

          <br />

          <p className="font-sans mt-2 text-base md:text-lg font-medium">{movie.plot}</p>
          <p className="font-sans mt-4 text-base md:text-lg font-medium">
            <span className="text-gray-500">Cast:</span> {movie.actors}
          </p>
          <p className="font-sans mt-2 text-base md:text-lg font-medium">
            <span className="text-gray-500">Director:</span> {movie.director}
          </p>
          <p className="font-sans mt-2 text-base md:text-lg font-medium">
            <span className="text-gray-500">Awards:</span> {movie.awards}
          </p>
          <div className="flex mt-auto space-x-4 md:space-x-8">
            <a  className="flex items-center space-x-2 hover:text-blue-600">
              <FaHeart className={`text-lg md:text-xl ${liked ? "text-blue-500 dark:text-blue-400" : ""}`} />
              <span>Favorite</span>
            </a>
            
            <a  className="flex items-center space-x-2 hover:text-blue-600">
              <FaBookmark className={`text-lg md:text-xl ${liked ? "text-blue-500 dark:text-blue-400" : ""}`} />
              <span>Watch later</span>
            </a>
            
            <a  className="flex items-center space-x-2 hover:text-blue-600">
              <FaShareAlt className={`text-lg md:text-xl ${liked ? "text-blue-500 dark:text-blue-400" : ""}`} />
              <span>Share</span>
            </a>
            
            <Link
               href={`watchnow/${movie.imdbID}`}
              className="flex items-center space-x-2 hover:text-blue-600"
            >            <FaStar fill="white" className="text-lg md:text-xl text-blue-500 dark:text-blue-400" />
              <span>Watch Now</span>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SingleMovie;