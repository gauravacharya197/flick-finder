
import apiClient from "@/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getFeaturedMovie = async (searchQuery?: string,category?:string) => {
    return await apiClient.get(`${baseUrl}api/Featured?search=${searchQuery}&category=${category}`);
};

export const featureMovie = async (movie,category) => {
    

    // Make the POST request using axios
    return await apiClient.post(`${baseUrl}api/Featured?category=${category}`, movie,);



};
export const deletefeatureMovie = async (movie: any,category:string) => {


    // Make the POST request using axios
    return await apiClient.delete(`${baseUrl}api/Featured?movieId=${movie}&category=${category}`);



};

