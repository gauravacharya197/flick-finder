import apiClient from '../axiosConfig';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE = `${baseUrl}api/Recommendation/community`;

export interface RecommendationItem {
  id: number;
  externalId: string;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  runtime: number;
  upVotes: number;
  downVotes: number;
  createdAt: string;
  userHasVoted?: boolean;
  userVoteIsUpvote?: boolean;
}

export interface RecommendationListResponse {
  results: RecommendationItem[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export const getRecommendations = async (
  mediaType?: string,
  sortBy = 'votes',
  page = 1,
  pageSize = 12
): Promise<RecommendationListResponse> => {
  const params = new URLSearchParams();
  if (mediaType && mediaType !== 'all') params.append('mediaType', mediaType);
  params.append('sortBy', sortBy);
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  const response = await apiClient.get(`${BASE}?${params.toString()}`);
  return response.data;
};

export const addRecommendation = async (data: {
  externalId: string;
  mediaType: string;
  title: string;
  overview: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  runtime: number;
  fingerprint: string;
}) => {
  const response = await apiClient.post(BASE, data);
  return response.data;
};

export const voteRecommendation = async (
  id: number,
  fingerprint: string,
  isUpvote: boolean
) => {
  const response = await apiClient.post(`${BASE}/${id}/vote`, { fingerprint, isUpvote });
  return response.data;
};

export const getVoteStatus = async (id: number, fingerprint: string) => {
  const response = await apiClient.get(
    `${BASE}/${id}/vote-status?fingerprint=${encodeURIComponent(fingerprint)}`
  );
  return response.data;
};

// Search TMDB via existing discover endpoint
export const searchForRecommend = async (keyword: string) => {
  const params = new URLSearchParams({ keyword, pageNumber: '1', mediaType: '2' });
  const response = await apiClient.get(`${baseUrl}api/movies/discover?${params.toString()}`);
  return response.data;
};