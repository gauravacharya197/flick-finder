import apiClient from "@/axiosConfig";

let baseUrl = `${'https://localhost:7264/'}`;

export const GetUser = async (code: string) => {
   return apiClient.post(`${baseUrl}api/auth`, { code })
  };

  export const Logout = async () => {
    return apiClient.post(`${baseUrl}api/auth/logout`)
   };
