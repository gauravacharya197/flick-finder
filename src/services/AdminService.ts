import apiClient from "@/axiosConfig";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



export const GetStats = async () => {
   return apiClient.get(`${baseUrl}api/Dashboard/stats`)
}
export const GetUsers = async () => {
   return apiClient.get(`${baseUrl}api/Dashboard/users`)
}
export const GetMovieCaches = async (searchQuery?: string, category?: string) => {
   return apiClient.get(`${baseUrl}api/Dashboard/users`)
}
export const GetMovieDetailCache = async (searchQuery?: string, pageNumber?: string, sortBy: string = 'CreatedAt',
   sortDescending: boolean = true) => {
   return apiClient.get(`${baseUrl}api/Dashboard/moviesdetailcache?search=${searchQuery}&pageNumber=${pageNumber}&sortBy=${sortBy}&sortDescending=${sortDescending}`)
}
export const deleteMovie = async (movieId: string) => {
   const response = await apiClient.delete(`${baseUrl}movies/remove/${movieId}`);
   return response.data;
 };