// utils/constructWatchUrl.ts
export const constructWatchUrl = (mediaType: string, movieId: string, displayTitle: string | undefined): string => {
    const formattedTitle = displayTitle
      ? encodeURIComponent(displayTitle.toLowerCase().replace(/\s+/g, '-'))
      : '';
    if(mediaType.toLowerCase()=='manga')
    {
      return `/manga/${movieId}/${formattedTitle}`;
    }
    return `/watch/${mediaType}/${movieId}/${formattedTitle}`;
  };
  