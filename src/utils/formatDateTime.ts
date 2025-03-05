export function formatDateTime(utcDate: string): string {
  // Create a Date object from the UTC string
  const utcDateTime = new Date(utcDate);
  if (isNaN(utcDateTime.getTime())) {
    return "Error Date(UTC)";
}
  // Nepal is UTC+5:45, so add 5 hours and 45 minutes (in milliseconds)
  const nepalOffsetMs = (5 * 60 + 45) * 60 * 1000; // 5h 45m in milliseconds
  const nepalTimeMs = utcDateTime.getTime() + nepalOffsetMs;
  
  // Create new Date object with Nepal time
  const nepalDateTime = new Date(nepalTimeMs);
  
  // Format the date to a readable string
  // Using toLocaleString with specific options for Nepal
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
   
      hour12: false,
      timeZone: 'Asia/Kathmandu'
  };
  
  return nepalDateTime.toLocaleString('en-US', options);
}

//Example usage with your specific date
