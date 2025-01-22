import React from 'react';

const FilterDropdown = ({ isOpen }) => {
  return isOpen ? (
    <div className="flex mt-1 flex-col items-center">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-800 dark:text-gray-300">
            Genre
          </label>
          <select className="w-48 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-black dark:text-white">
            <option>All Genres</option>
            <option>Action</option>
            <option>Drama</option>
            <option>Comedy</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-800 dark:text-gray-300">
            Rating
          </label>
          <select className="w-48 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-black dark:text-white">
            <option>All Ratings</option>
            <option>PG</option>
            <option>PG-13</option>
            <option>R</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-800 dark:text-gray-300">
            Year
          </label>
          <select className="w-48 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-black dark:text-white">
            <option>All Years</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
        </div>
      </div>
    </div>
  ) : null;
};

export default FilterDropdown;
