import apiClient from "@/axiosConfig";

let baseUrl = `${'https://localhost:7264/'}`;

export const GetUser = async (code: string) => {
   return apiClient.post(`${baseUrl}api/auth/AuthenticateWithGoogle`, { code })
  };
  export const Register = async (data) => {
    return apiClient.post(`${baseUrl}api/auth/Register`,  data)
   };
   export const UserLogin = async (data) => {
    return apiClient.post(`${baseUrl}api/auth/Login`,  data)
   };

  export const Logout = async () => {
    return apiClient.post(`${baseUrl}api/auth/Logout`)
   };
