import apiClient from "@/axiosConfig";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



   export const GetStats = async()=>{
    return apiClient.get(`${baseUrl}api/Dashboard/stats`)
   }
   export const GetUsers = async()=>{
      return apiClient.get(`${baseUrl}api/Dashboard/users`)
     }

