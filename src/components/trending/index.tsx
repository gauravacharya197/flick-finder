'use client'
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setMediaType } from '@/redux/movies/advanceSearchSlice'
import { MovieList } from '../movie/MovieList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getTrending } from '@/services/MovieService'
import ErrorMessage from '../common/ErrorMessage'
import SectionHeader from '../common/SectionHeader'
import { MediaSection } from '../common/MediaSection'
import { Segmented } from '../ui/Segmented'

export const Trending = () => {
  const { mediaType } = useSelector((state: RootState) => state.advanceSearch)
  const dispatch = useDispatch()



  return (
    <>
      <SectionHeader className="pb-4 pt-2" text="Trending"/>
      <Segmented
        size="large"
        value={mediaType}
        options={['All', 'Movie', 'TV']}
        className="custom-segmented mb-2"
        onChange={(value) => dispatch(setMediaType(value))}
      />
        <MediaSection mediaType={mediaType.toString() as any|| 'movie'}/>
      
    </>
  )
}
