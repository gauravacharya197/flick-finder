import { delay } from 'framer-motion';
import apiClient from '../axiosConfig';
let baseUrl = `${'https://localhost:7264/'}`;

export const getRecommendation = async (text: string) => {
  
   
    return await apiClient.post(`${baseUrl}api/Recommendation/dummy`, {text : text, delay:7000}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };





  