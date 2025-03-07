export const shareContent = async (
    title: string,
    text: string,
    url: string = window.location.href
  ): Promise<void> => {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };