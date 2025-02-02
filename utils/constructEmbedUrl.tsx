export const constructUrl = (
    baseUrl: string,
    mediaType: any,
    imdbID: any,
    selectedSeason: number | null,
    selectedEpisode: number | null,
    separator = "-",
  ) => {
    if (
      mediaType === "tv" &&
      selectedSeason !== null &&
      selectedEpisode !== null
    ) {
      return `${baseUrl}/${mediaType}/${imdbID}${separator}${selectedSeason}${separator}${selectedEpisode}`;
    }
    return `${baseUrl}/${mediaType}/${imdbID}`;
  };