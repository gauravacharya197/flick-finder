export const formatRating = (voteAverage: string | number | undefined | null): number => {
    if (voteAverage === undefined || voteAverage === null) {
      return 0
    }
  
    // Convert to number if it's a string
    const numericValue = typeof voteAverage === 'string' ? parseFloat(voteAverage) : voteAverage
  
    // Check if it's a valid number
    if (isNaN(numericValue)) {
      return 0
    }
  
    // Round to 1 decimal place and convert back to number
    return Number(Number(numericValue).toFixed(1))
  }