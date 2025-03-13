// utils/dateUtils.ts

export const getDateRange = (pastDays: number, futureMonths: number) => {
    const currentDate = new Date();
    
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - pastDays);
  
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + futureMonths);
  
    return { startDate, currentDate, endDate };
  };
  
  export const formatDate = (date: Date) => date.toISOString().split("T")[0];
  