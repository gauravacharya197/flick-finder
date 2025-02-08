export const formatDate = (date: string): string => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return date;
    }
    return parsedDate.toLocaleDateString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric'
    }).replace(',', '');
};
