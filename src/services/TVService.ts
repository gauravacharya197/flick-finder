export const fetchEpisodes = async ({ mediaId, seasonNumber }: { mediaId: string; seasonNumber: number }) => {
    const response = await fetch(`/api/seasons/${mediaId}/${seasonNumber}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch episodes');
    return data.episodes;
  };