import apiClient from '../axiosConfig';
let baseUrl = `${'https://localhost:7264/'}`;

export const getRecommendation = async (text: string) => {
  
   
    return await apiClient.post(`${baseUrl}api/Recommendation`, {text}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };





  