
import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  
 
export const getManga = async (keyword?: string, page: number = 1,genreId?:string,sortOption?:string) => {
  // Build the URL with pagination
  let url = `${baseUrl}api/manga/trending?page=${page}`;
  
  // Add search parameter if provided
  if (keyword && keyword.trim()) {
    url += `&search=${encodeURIComponent(keyword.trim())}`;
  }
  if (genreId) {
    url += `&genreId=${genreId}`;
  }
  if (sortOption) {
    url += `&sortOption=${sortOption}`;
  }
  // Make the API call
  return await apiClient.get(url);
};

   
  export const getMangaDetails = async (mangaId: string) => {
    return await apiClient.get(`${baseUrl}api/manga/Details/${mangaId}`);
  };

  export const getMangaGenre = async () => {
    return [
      {
        "id": "07251805-a27e-4d59-b488-f0bfbec15168",
        "name": "Thriller"
      },
      {
        "id": "256c8bd9-4904-4360-bf4f-508a76d67183",
        "name": "Sci-Fi"
      },
      {
        "id": "33771934-028e-4cb3-8744-691e866a923e",
        "name": "Historical"
      },
      {
        "id": "391b0423-d847-456f-aff0-8b0cfc03066b",
        "name": "Action"
      },
      {
        "id": "3b60b75c-a2d7-4860-ab56-05f391bb889c",
        "name": "Psychological"
      },
      {
        "id": "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
        "name": "Romance"
      },
      {
        "id": "4d32cc48-9f00-4cca-9b5a-a839f0764984",
        "name": "Comedy"
      },
      {
        "id": "50880a9d-5440-4732-9afb-8f457127e836",
        "name": "Mecha"
      },
      {
        "id": "5920b825-4181-4a17-beeb-9918b0ff7a30",
        "name": "Boys' Love"
      },
      {
        "id": "5ca48985-9a9d-4bd8-be29-80dc0303db72",
        "name": "Crime"
      },
      {
        "id": "69964a64-2f90-4d33-beeb-f3ed2875eb4c",
        "name": "Sports"
      },
      {
        "id": "7064a261-a137-4d3a-8848-2d385de3a99c",
        "name": "Superhero"
      },
      {
        "id": "81c836c9-914a-4eca-981a-560dad663e73",
        "name": "Magical Girls"
      },
      {
        "id": "87cc87cd-a395-47af-b27a-93258283bbc6",
        "name": "Adventure"
      }
    ]
    
  }