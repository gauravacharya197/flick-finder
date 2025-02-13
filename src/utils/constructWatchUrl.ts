// utils/constructWatchUrl.ts
export const constructWatchUrl = (mediaType: string, movieId: string, displayTitle: string | undefined): string => {
    const formattedTitle = displayTitle
      ? encodeURIComponent(displayTitle.toLowerCase().replace(/\s+/g, '-'))
      : '';
    return `/watch/${mediaType}/${movieId}/${formattedTitle}`;
  };
  