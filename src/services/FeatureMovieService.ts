
import apiClient from "@/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getFeaturedMovie = async (searchQuery?: string) => {
    return await apiClient.get(`${baseUrl}api/Featured?search=${searchQuery}`)
};

export const featureMovie = async (movie: any) => {


    // Make the POST request using axios
    return await apiClient.post(`${baseUrl}api/Featured`, movie);



};
export const deletefeatureMovie = async (movie: any) => {


    // Make the POST request using axios
    return await apiClient.delete(`${baseUrl}api/Featured?movieId=${movie}`);



};

