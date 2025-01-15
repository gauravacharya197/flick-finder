import { setFilters } from '@/redux/movies/filterSlice';
import { getFilters } from '@/services/MovieService';
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export const MyApp = () => {

    console.log("load configuration");
    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchFilters = async () => {
        try {
          const response = await getFilters();
          dispatch(setFilters(response.data));
          console.log('Filters set');
          
        } catch (error) {
          toast.error('Error fetching filters:');
        }
      };
  
        fetchFilters();
      
  
     
    }, []);
    
  return (
    <div></div>
  )
}
