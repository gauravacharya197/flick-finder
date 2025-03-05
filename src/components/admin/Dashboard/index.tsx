'use client'
import { GetStats } from '@/services/AdminService';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { FaUsers, FaVideo, FaDatabase, FaFilm } from 'react-icons/fa';

export const Dashboard = () => {

    const { data: statsResponse, isLoading } = useQuery({
        queryKey: ["movies", "TopRated"],
        queryFn: () => GetStats(),
        staleTime: 1000 * 60 * 60 * 24,
      });
      
      // Now you can access both the data and headers
      const stats = statsResponse?.data;
      const headers = statsResponse?.headers;
      
  // Sample data - in a real app, this would come from props or API calls


  return (
    <div className="p-6 bg-background min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <Link href="/admin/users">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 font-medium">Total Users</p>
              <h2 className="text-3xl font-bold text-white">{stats?.totalUsers}</h2>
            </div>
            <div className="p-4 bg-blue-900 rounded-full">
              <FaUsers className="text-blue-400 text-2xl" />
            </div>
          </div>
          {/* <div className="mt-4">
            <p className="text-green-400 text-sm font-medium">
              <span className="font-bold">↑ 12%</span> from last month
            </p>
          </div> */}
        </div>
        </Link>

        {/* Videos Card */}
        <Link href="/admin/videos">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 font-medium">Total Videos</p>
              <h2 className="text-3xl font-bold text-white">{stats?.totalVideos.toLocaleString()}</h2>
            </div>
            <div className="p-4 bg-red-900 rounded-full">
              <FaVideo className="text-red-400 text-2xl" />
            </div>
          </div>
          {/* <div className="mt-4">
            <p className="text-green-400 text-sm font-medium">
              <span className="font-bold">↑ 8.3%</span> from last month
            </p>
          </div> */}
        </div>
        </Link>
        <Link href="/admin/movie-detail-caches">

        {/* Movie Details Caches Card */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 font-medium">Movie Details Caches</p>
              <h2 className="text-3xl font-bold text-white">{stats?.totalMovieDetailsCaches.toLocaleString()}</h2>
            </div>
            <div className="p-4 bg-purple-900 rounded-full">
              <FaDatabase className="text-purple-400 text-2xl" />
            </div>
          </div>
          {/* <div className="mt-4">
            <p className="text-green-400 text-sm font-medium">
              <span className="font-bold">↑ 5.7%</span> from last month
            </p>
          </div> */}
        </div>
        </Link>
        <Link href="/admin/movie-caches">

        {/* Movie Caches Card */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 font-medium">Movie Caches</p>
              <h2 className="text-3xl font-bold text-white">{stats?.totalMovieCaches.toLocaleString()}</h2>
            </div>
            <div className="p-4 bg-green-900 rounded-full">
              <FaFilm className="text-green-400 text-2xl" />
            </div>
          </div>
          {/* <div className="mt-4">
            <p className="text-green-400 text-sm font-medium">
              <span className="font-bold">↑ 9.4%</span> from last month
            </p>
          </div> */}
        </div>
        </Link>
      </div>

      {/* Additional dashboard sections could go here */}
     
    </div>
  );
};