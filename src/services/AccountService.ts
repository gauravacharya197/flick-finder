import apiClient from "@/axiosConfig";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export const GetUser = async (code: string) => {
   return apiClient.post(`${baseUrl}api/auth/AuthenticateWithGoogle`, { code })
  };
  export const Register = async (data) => {
    return apiClient.post(`${baseUrl}api/auth/Register`,  data)
   };
   export const UserLogin = async (data) => {
    return apiClient.post(`${baseUrl}api/auth/Login`,  data)
   };
   export const SavePreferences = async (data) => {
    return apiClient.post(`${baseUrl}api/UserPreference`,  data)
   };
   export const FetchUserPreferences = async()=>{
    return apiClient.get(`${baseUrl}api/UserPreference`)
   }

  export const Logout = async () => {
    return apiClient.post(`${baseUrl}api/auth/Logout`)
   };
   export const AdminLogin = async (data) => {
    return apiClient.post(`${baseUrl}api/auth/Admin-Login`,  data)
   };
