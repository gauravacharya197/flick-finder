import { delay } from 'framer-motion';
import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRecommendation = async (text: string) => {


  return await apiClient.post(`${baseUrl}api/Recommendation/dummy`, { text: text, delay: 0 }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const getDetails = async (imdbID: string) => {


  return await apiClient.get(`${baseUrl}api/Movies/details/${imdbID}`)

};
export const getPopular = async () => {


  return await apiClient.get(`${baseUrl}api/Movies/popular`)

};
export const getSimilarMovies = async (id:string) => {


  return await apiClient.get(`${baseUrl}api/Movies/similar/${id}`)

};
export const getFilters = async () => {

  return await apiClient.get(`${baseUrl}api/filters`)

};



