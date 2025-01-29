import React from 'react'
import { FaStar } from 'react-icons/fa'

export const Rating = ({voteAverage}) => {
    if(!voteAverage) return "";
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 text-sm text-yellow-600 dark:text-yellow-400">
    <FaStar className="w-3 h-3" />
    {Number(voteAverage?.toFixed(1))}
  </span>
  )
}
